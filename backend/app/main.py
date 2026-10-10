import os
import csv
import io
import json
import urllib.request
import urllib.error

from pathlib import Path
from datetime import datetime
from typing import Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from app.capacity_data import router as capacity_router
from app.resource_data import router as resource_router
from app.staff_data import router as staff_router
from app.medicine_data import router as medicine_router
from app.hospital_data import router as hospital_data_router
from app.forecasting import router as forecast_router


# ==========================================================
# CONFIGURATION
# ==========================================================

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"

NHS_DATA_FILE = DATA_DIR / "nhs_ae_attendances.csv"

load_dotenv(BASE_DIR / ".env")
FIRMS_MAP_KEY = os.getenv("FIRMS_MAP_KEY")


# ==========================================================
# FASTAPI APPLICATION
# ==========================================================

app = FastAPI(
    title="HeatCare AI API",
    description=(
        "HeatCare AI: Environmental Heat Risk, "
        "NHS Emergency Activity and Hospital Preparedness"
    ),
    version="1.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5175",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all existing routers plus the new forecasting router.
app.include_router(hospital_data_router)
app.include_router(capacity_router)
app.include_router(resource_router)
app.include_router(staff_router)
app.include_router(medicine_router)
app.include_router(forecast_router)


# ==========================================================
# SHARED JSON FETCH HELPER
# ==========================================================

def fetch_json(url):
    request = urllib.request.Request(
        url,
        headers={"User-Agent": "HeatCare-AI/1.2"},
    )

    with urllib.request.urlopen(request, timeout=20) as response:
        return json.loads(response.read().decode("utf-8"))


# ==========================================================
# NHS DATASET CONFIGURATION
# ==========================================================

NHS_ATTENDANCE_COLUMNS = [
    "A&E attendances Type 1",
    "A&E attendances Type 2",
    "A&E attendances Other A&E Department",
]

NHS_WAITING_COLUMNS = [
    "Attendances over 4hrs Type 1",
    "Attendances over 4hrs Type 2",
    "Attendances over 4hrs Other Department",
]

NHS_ADMISSION_COLUMNS = [
    "Emergency admissions via A&E - Type 1",
    "Emergency admissions via A&E - Type 2",
    "Emergency admissions via A&E - Other A&E department",
    "Other emergency admissions",
]

NHS_REQUIRED_COLUMNS = [
    "Period",
    "Org Code",
    "Parent Org",
    "Org name",
    *NHS_ATTENDANCE_COLUMNS,
    *NHS_WAITING_COLUMNS,
    "Patients who have waited 4-12 hs from DTA to admission",
    "Patients who have waited 12+ hrs from DTA to admission",
    *NHS_ADMISSION_COLUMNS,
]


def parse_nhs_number(value):
    """Convert a valid NHS CSV numeric value to an integer."""
    if value is None:
        return None

    value = str(value).strip()
    if value == "":
        return None

    try:
        number = float(value.replace(",", ""))
        if not number.is_integer():
            return None
        return int(number)
    except (ValueError, TypeError):
        return None


def sum_nhs_columns(row, columns):
    """Sum valid values, returning None when all requested values are missing."""
    values = [parse_nhs_number(row.get(column)) for column in columns]
    valid_values = [value for value in values if value is not None]

    if not valid_values:
        return None

    return sum(valid_values)


def load_nhs_dataset():
    """
    Read the configured NHS CSV from backend/data.
    Exclude the overall TOTAL row to prevent double counting.
    """
    if not NHS_DATA_FILE.exists():
        raise HTTPException(
            status_code=500,
            detail={
                "message": "NHS dataset file was not found.",
                "expected_path": str(NHS_DATA_FILE),
                "instruction": (
                    "Place nhs_ae_attendances.csv inside "
                    "the backend/data folder."
                ),
            },
        )

    try:
        with open(NHS_DATA_FILE, "r", newline="", encoding="utf-8-sig") as file:
            reader = csv.DictReader(file)

            if not reader.fieldnames:
                raise HTTPException(
                    status_code=500,
                    detail="The NHS CSV has no column headers.",
                )

            reader.fieldnames = [name.strip() for name in reader.fieldnames]

            missing_columns = [
                column for column in NHS_REQUIRED_COLUMNS
                if column not in reader.fieldnames
            ]
            if missing_columns:
                raise HTTPException(
                    status_code=500,
                    detail={
                        "message": (
                            "The NHS CSV structure does not match "
                            "the expected dataset."
                        ),
                        "missing_columns": missing_columns,
                    },
                )

            records = []

            for raw_row in reader:
                row = {
                    key.strip(): (value.strip() if value is not None else "")
                    for key, value in raw_row.items()
                    if key is not None
                }

                org_code = row.get("Org Code", "").strip()
                org_name = row.get("Org name", "").strip()

                if org_code.upper() == "TOTAL" or org_name.upper() == "TOTAL":
                    continue
                if not org_code or not org_name:
                    continue

                attendance_values = [
                    parse_nhs_number(row.get(column))
                    for column in NHS_ATTENDANCE_COLUMNS
                ]

                records.append({
                    "period": row.get("Period", ""),
                    "org_code": org_code,
                    "parent_org": row.get("Parent Org", ""),
                    "org_name": org_name,
                    "attendance_type_1": attendance_values[0],
                    "attendance_type_2": attendance_values[1],
                    "attendance_other_department": attendance_values[2],
                    "total_attendances": sum_nhs_columns(
                        row, NHS_ATTENDANCE_COLUMNS
                    ),
                    "attendances_over_4_hours": sum_nhs_columns(
                        row, NHS_WAITING_COLUMNS
                    ),
                    "patients_waiting_4_to_12_hours": parse_nhs_number(
                        row.get(
                            "Patients who have waited "
                            "4-12 hs from DTA to admission"
                        )
                    ),
                    "patients_waiting_12_plus_hours": parse_nhs_number(
                        row.get(
                            "Patients who have waited "
                            "12+ hrs from DTA to admission"
                        )
                    ),
                    "emergency_admissions": sum_nhs_columns(
                        row, NHS_ADMISSION_COLUMNS
                    ),
                })

            return records

    except HTTPException:
        raise
    except OSError as error:
        raise HTTPException(
            status_code=500,
            detail=f"Could not read the NHS CSV: {str(error)}",
        )
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Could not process the NHS CSV: {str(error)}",
        )


def sum_available(records, field):
    """Aggregate available values without treating missing values as zero."""
    values = [
        record.get(field)
        for record in records
        if record.get(field) is not None
    ]
    return sum(values) if values else None


# ==========================================================
# HOME API
# ==========================================================

@app.get("/")
def home():
    return {
        "message": "HeatCare AI backend is running",
        "status": "success",
        "version": "1.2.0",
        "services": [
            "NASA FIRMS satellite detections",
            "Pune live weather",
            "Environmental heat-risk analysis",
            "NHS emergency activity analytics",
            "NHS organisation filtering",
            "Hospital historical-data upload",
            "Hospital historical-data summary",
            "Hospital bed and ICU capacity management",
            "Staff management",
            "Medicine inventory",
            "Demo patient-demand forecasting",
        ],
    }


# ==========================================================
# NHS DATASET STATUS
# ==========================================================

@app.get("/api/nhs/status")
def get_nhs_status():
    """Check whether the configured NHS CSV exists and can be loaded."""
    records = load_nhs_dataset()
    periods = sorted({record["period"] for record in records if record["period"]})

    return {
        "available": True,
        "source": "NHS England",
        "dataset_file": NHS_DATA_FILE.name,
        "records": len(records),
        "periods": periods,
        "first_organisation": records[0]["org_name"] if records else None,
        "note": (
            "Records represent NHS England activity. "
            "They are not Pune hospital data."
        ),
    }


# ==========================================================
# NHS DATASET SUMMARY
# ==========================================================

@app.get("/api/nhs/summary")
def get_nhs_summary():
    """Return aggregate NHS activity from the configured CSV."""
    records = load_nhs_dataset()

    if not records:
        return {
            "available": True,
            "records": 0,
            "message": "No organisation records were found.",
        }

    periods = sorted({record["period"] for record in records if record["period"]})

    return {
        "available": True,
        "source": "NHS England",
        "dataset_file": NHS_DATA_FILE.name,
        "reporting_periods": periods,
        "organisation_count": len(records),
        "totals": {
            "emergency_attendances": sum_available(records, "total_attendances"),
            "attendances_over_4_hours": sum_available(
                records, "attendances_over_4_hours"
            ),
            "patients_waiting_4_to_12_hours": sum_available(
                records, "patients_waiting_4_to_12_hours"
            ),
            "patients_waiting_12_plus_hours": sum_available(
                records, "patients_waiting_12_plus_hours"
            ),
            "emergency_admissions": sum_available(
                records, "emergency_admissions"
            ),
        },
        "data_quality": {
            "organisations_with_missing_attendance_totals": sum(
                1 for record in records
                if record["total_attendances"] is None
            ),
            "organisations_with_missing_admission_totals": sum(
                1 for record in records
                if record["emergency_admissions"] is None
            ),
        },
        "disclaimer": (
            "Aggregates are calculated from organisation-level rows in the "
            "supplied NHS CSV. The published TOTAL row is excluded. These "
            "statistics describe NHS England activity and must not be "
            "represented as Pune hospital activity or heat-related cases."
        ),
    }


# ==========================================================
# NHS ORGANISATION LIST
# ==========================================================

@app.get("/api/nhs/providers")
def get_nhs_providers(
    search: Optional[str] = Query(
        default=None,
        description="Search organisation name or organisation code",
    ),
    limit: int = Query(default=200, ge=1, le=500),
):
    """Return NHS organisations, with optional search filtering."""
    records = load_nhs_dataset()

    if search:
        search_text = search.strip().lower()
        records = [
            record for record in records
            if search_text in record["org_name"].lower()
            or search_text in record["org_code"].lower()
            or search_text in record["parent_org"].lower()
        ]

    records = sorted(records, key=lambda record: record["org_name"].lower())

    return {
        "source": "NHS England",
        "count": len(records),
        "providers": [
            {
                "org_code": record["org_code"],
                "org_name": record["org_name"],
                "parent_org": record["parent_org"],
                "period": record["period"],
            }
            for record in records[:limit]
        ],
    }


# ==========================================================
# NHS EMERGENCY ACTIVITY
# ==========================================================

@app.get("/api/nhs/activity")
def get_nhs_activity(
    search: Optional[str] = Query(
        default=None,
        description="Filter by organisation name or code",
    ),
    sort_by: str = Query(
        default="total_attendances",
        description=(
            "Sort by total_attendances, emergency_admissions, "
            "or attendances_over_4_hours"
        ),
    ),
    limit: int = Query(default=20, ge=1, le=200),
):
    """Return organisation-level activity with search and sorting."""
    allowed_sort_fields = {
        "total_attendances",
        "emergency_admissions",
        "attendances_over_4_hours",
    }

    if sort_by not in allowed_sort_fields:
        raise HTTPException(
            status_code=400,
            detail={
                "message": "Unsupported sort field.",
                "allowed_fields": sorted(allowed_sort_fields),
            },
        )

    records = load_nhs_dataset()

    if search:
        search_text = search.strip().lower()
        records = [
            record for record in records
            if search_text in record["org_name"].lower()
            or search_text in record["org_code"].lower()
            or search_text in record["parent_org"].lower()
        ]

    records.sort(
        key=lambda record: (
            record[sort_by] is not None,
            record[sort_by] if record[sort_by] is not None else -1,
        ),
        reverse=True,
    )
    selected_records = records[:limit]

    return {
        "source": "NHS England",
        "count": len(selected_records),
        "matched_organisations": len(records),
        "sort_by": sort_by,
        "data": selected_records,
        "disclaimer": (
            "This is reported emergency department activity, "
            "not a prediction of future demand."
        ),
    }


# ==========================================================
# NASA FIRMS SATELLITE DETECTION API
# ==========================================================

@app.get("/api/firms")
def get_firms():
    if not FIRMS_MAP_KEY:
        raise HTTPException(
            status_code=500,
            detail="NASA FIRMS API key is missing from backend/.env",
        )

    area = "72,16,75,20"
    source = "VIIRS_NOAA21_NRT"
    day_range = 2

    url = (
        "https://firms.modaps.eosdis.nasa.gov/api/area/csv/"
        f"{FIRMS_MAP_KEY}/{source}/{area}/{day_range}"
    )

    request = urllib.request.Request(
        url,
        headers={"User-Agent": "HeatCare-AI/1.2"},
    )

    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            csv_text = response.read().decode("utf-8")

        reader = csv.DictReader(io.StringIO(csv_text))
        records = []

        for row in reader:
            try:
                records.append({
                    "latitude": float(row["latitude"]),
                    "longitude": float(row["longitude"]),
                    "brightness": row.get("bright_ti4", ""),
                    "confidence": row.get("confidence", ""),
                    "frp": row.get("frp", ""),
                    "acq_date": row.get("acq_date", ""),
                    "acq_time": row.get("acq_time", ""),
                    "satellite": row.get("satellite", ""),
                    "daynight": row.get("daynight", ""),
                })
            except (ValueError, KeyError, TypeError):
                continue

        return {
            "source": "NASA FIRMS",
            "dataset": source,
            "area": "Maharashtra, India",
            "count": len(records),
            "data": records,
            "disclaimer": (
                "Satellite thermal anomalies are not direct measurements "
                "of ambient temperature and do not independently confirm a heatwave."
            ),
        }

    except urllib.error.HTTPError as error:
        raise HTTPException(
            status_code=502,
            detail=f"NASA FIRMS returned HTTP {error.code}",
        )
    except Exception as error:
        raise HTTPException(
            status_code=502,
            detail=f"Could not retrieve NASA FIRMS data: {str(error)}",
        )


# ==========================================================
# OPEN-METEO WEATHER API
# ==========================================================

def fetch_weather_data():
    latitude = 18.5204
    longitude = 73.8567

    url = (
        "https://api.open-meteo.com/v1/forecast"
        f"?latitude={latitude}"
        f"&longitude={longitude}"
        "&current=temperature_2m,relative_humidity_2m,"
        "apparent_temperature,wind_speed_10m"
        "&daily=temperature_2m_max,temperature_2m_min,"
        "precipitation_probability_max"
        "&timezone=Asia%2FKolkata"
        "&forecast_days=5"
    )

    try:
        weather = fetch_json(url)
        return {
            "source": "Open-Meteo",
            "location": "Pune, Maharashtra",
            "coordinates": {
                "latitude": latitude,
                "longitude": longitude,
            },
            "current": weather.get("current", {}),
            "daily": weather.get("daily", {}),
            "updated_at": datetime.now().isoformat(),
        }
    except urllib.error.HTTPError as error:
        raise HTTPException(
            status_code=502,
            detail=f"Weather provider returned HTTP {error.code}",
        )
    except Exception as error:
        raise HTTPException(
            status_code=502,
            detail=f"Weather data unavailable: {str(error)}",
        )


@app.get("/api/weather")
def get_weather():
    return fetch_weather_data()


# ==========================================================
# ENVIRONMENTAL HEAT-RISK ANALYSIS API
# ==========================================================

@app.get("/api/demand-analysis")
def get_demand_analysis():
    """
    Calculate an illustrative environmental heat-risk indicator.
    This is not a trained hospital-demand prediction model.
    """
    weather_response = fetch_weather_data()
    current = weather_response.get("current", {})

    try:
        temperature = float(current["temperature_2m"])
        feels_like = float(current["apparent_temperature"])
        humidity = float(current["relative_humidity_2m"])
        wind_speed = float(current["wind_speed_10m"])
    except (KeyError, TypeError, ValueError):
        raise HTTPException(
            status_code=502,
            detail="Weather provider returned incomplete current conditions.",
        )

    # Illustrative prototype formula; not a clinically validated risk model.
    temperature_score = min(max((temperature - 25) / 20 * 100, 0), 100)
    apparent_temperature_score = min(max((feels_like - 25) / 20 * 100, 0), 100)
    humidity_score = min(max(humidity, 0), 100)

    heat_risk_score = round(
        temperature_score * 0.45
        + apparent_temperature_score * 0.40
        + humidity_score * 0.15
    )

    if heat_risk_score < 25:
        risk_level = "Low"
        recommended_action = "Continue routine environmental monitoring."
    elif heat_risk_score < 50:
        risk_level = "Moderate"
        recommended_action = (
            "Review heat-safety guidance and maintain routine preparedness."
        )
    elif heat_risk_score < 75:
        risk_level = "High"
        recommended_action = (
            "Review heat-safety procedures and check preparedness resources."
        )
    else:
        risk_level = "Very High"
        recommended_action = (
            "Review local heat-health guidance and consider preparedness measures."
        )

    return {
        "source": "Open-Meteo",
        "location": weather_response["location"],
        "generated_at": datetime.now().isoformat(),
        "environment": {
            "temperature_c": temperature,
            "apparent_temperature_c": feels_like,
            "relative_humidity_percent": humidity,
            "wind_speed_kmh": wind_speed,
        },
        "analysis": {
            "heat_risk_score": heat_risk_score,
            "risk_level": risk_level,
            "components": {
                "temperature_score": round(temperature_score, 2),
                "apparent_temperature_score": round(
                    apparent_temperature_score, 2
                ),
                "humidity_score": round(humidity_score, 2),
            },
            "weights": {
                "temperature": 0.45,
                "apparent_temperature": 0.40,
                "humidity": 0.15,
            },
        },
        "recommended_action": recommended_action,
        "hospital_demand_prediction": {
            "status": "not_available",
            "reason": (
                "The environmental heat-risk indicator is not a trained "
                "hospital-demand prediction. The forecasting demo endpoint "
                "is separate and uses synthetic attendance data."
            ),
        },
        "disclaimer": (
            "The heat-risk score is an illustrative prototype indicator. "
            "It is not a validated medical warning or hospital-demand forecast."
        ),
    }
