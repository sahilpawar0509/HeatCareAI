import csv
import io
import os
from datetime import datetime
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile

router = APIRouter(tags=["Hospital Historical Data"])

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
DATA_FILE = DATA_DIR / "hospital_history.csv"

REQUIRED_COLUMNS = [
    "date",
    "emergency_visits",
    "heat_related_cases",
    "admissions",
]


def validate_date(value):
    try:
        datetime.strptime(value.strip(), "%Y-%m-%d")
        return True
    except (ValueError, AttributeError):
        return False


def read_hospital_data():
    if not DATA_FILE.exists():
        return []

    with open(DATA_FILE, "r", newline="", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        return list(reader)


@router.post("/api/hospital-data/upload")
async def upload_hospital_data(file: UploadFile = File(...)):
    if not file.filename or not file.filename.lower().endswith(".csv"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a CSV file."
        )

    content = await file.read()

    if not content:
        raise HTTPException(
            status_code=400,
            detail="The uploaded file is empty."
        )

    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(
            status_code=413,
            detail="File size must not exceed 10 MB."
        )

    try:
        decoded_content = content.decode("utf-8-sig")
        reader = csv.DictReader(io.StringIO(decoded_content))

        if not reader.fieldnames:
            raise HTTPException(
                status_code=400,
                detail="The CSV file has no column headers."
            )

        reader.fieldnames = [
            column.strip().lower()
            for column in reader.fieldnames
        ]

        missing_columns = [
            column
            for column in REQUIRED_COLUMNS
            if column not in reader.fieldnames
        ]

        if missing_columns:
            raise HTTPException(
                status_code=400,
                detail={
                    "message": "Required columns are missing.",
                    "required_columns": REQUIRED_COLUMNS,
                    "missing_columns": missing_columns,
                }
            )

        validated_rows = []
        errors = []

        for row_number, row in enumerate(reader, start=2):
            try:
                date_value = (row.get("date") or "").strip()

                if not validate_date(date_value):
                    raise ValueError(
                        "date must use YYYY-MM-DD format"
                    )

                cleaned_row = {"date": date_value}

                for column in [
                    "emergency_visits",
                    "heat_related_cases",
                    "admissions",
                ]:
                    value = (row.get(column) or "").strip()

                    if not value:
                        raise ValueError(
                            f"{column} cannot be empty"
                        )

                    number = int(value)

                    if number < 0:
                        raise ValueError(
                            f"{column} cannot be negative"
                        )

                    cleaned_row[column] = number

                if (
                    cleaned_row["heat_related_cases"]
                    > cleaned_row["emergency_visits"]
                ):
                    raise ValueError(
                        "heat_related_cases cannot exceed emergency_visits"
                    )

                validated_rows.append(cleaned_row)

            except (ValueError, TypeError) as error:
                errors.append({
                    "row": row_number,
                    "error": str(error),
                })

        if errors:
            raise HTTPException(
                status_code=400,
                detail={
                    "message": "Some rows failed validation. No data was saved.",
                    "errors": errors[:30],
                    "total_errors": len(errors),
                }
            )

        if not validated_rows:
            raise HTTPException(
                status_code=400,
                detail="The CSV contains no hospital records."
            )

        DATA_DIR.mkdir(parents=True, exist_ok=True)

        temporary_file = DATA_DIR / "hospital_history.tmp"

        with open(
            temporary_file,
            "w",
            newline="",
            encoding="utf-8",
        ) as output_file:
            writer = csv.DictWriter(
                output_file,
                fieldnames=REQUIRED_COLUMNS,
            )
            writer.writeheader()
            writer.writerows(validated_rows)

        os.replace(temporary_file, DATA_FILE)

        return {
            "success": True,
            "message": "Hospital historical data uploaded successfully.",
            "records_saved": len(validated_rows),
            "file": "hospital_history.csv",
            "columns": REQUIRED_COLUMNS,
            "note": (
                "Records were saved for analysis. "
                "A validated demand-prediction model has not been trained."
            ),
        }

    except UnicodeDecodeError:
        raise HTTPException(
            status_code=400,
            detail="The CSV must use UTF-8 encoding."
        )


@router.get("/api/hospital-data/summary")
def hospital_data_summary():
    rows = read_hospital_data()

    if not rows:
        return {
            "available": False,
            "records": 0,
            "message": "Upload historical hospital data to begin analysis.",
        }

    emergency_visits = [
        int(row["emergency_visits"])
        for row in rows
    ]

    heat_related_cases = [
        int(row["heat_related_cases"])
        for row in rows
    ]

    admissions = [
        int(row["admissions"])
        for row in rows
    ]

    dates = sorted(row["date"] for row in rows)

    return {
        "available": True,
        "records": len(rows),
        "date_range": {
            "from": dates[0],
            "to": dates[-1],
        },
        "totals": {
            "emergency_visits": sum(emergency_visits),
            "heat_related_cases": sum(heat_related_cases),
            "admissions": sum(admissions),
        },
        "averages": {
            "emergency_visits": round(
                sum(emergency_visits) / len(rows), 2
            ),
            "heat_related_cases": round(
                sum(heat_related_cases) / len(rows), 2
            ),
            "admissions": round(
                sum(admissions) / len(rows), 2
            ),
        },
        "prediction_status": "not_trained",
        "message": (
            "This summary uses uploaded records. "
            "It is not a validated hospital-demand forecast."
        ),
    }