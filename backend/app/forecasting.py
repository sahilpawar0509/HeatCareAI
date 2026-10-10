from __future__ import annotations

from pathlib import Path
from typing import Any

import pandas as pd
from fastapi import APIRouter, HTTPException, Query
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error
from sklearn.model_selection import train_test_split
from pydantic import BaseModel, Field

router = APIRouter(prefix="/api/forecast", tags=["HeatCare Forecasting"])

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_FILE = BASE_DIR / "data" / "HeatCare_Hospital_Demo_Filled.xlsx"
REQUIRED_COLUMNS = ["date", "emergency_visits"]


class ForecastRequest(BaseModel):
    days: int = Field(default=7, ge=1, le=30)


def load_dataset() -> tuple[pd.DataFrame, list[str]]:
    """Load the demo workbook and validate the minimum columns."""
    if not DATA_FILE.exists():
        raise HTTPException(
            status_code=404,
            detail=(
                "Dataset not found. Save HeatCare_Hospital_Demo_Filled.xlsx "
                "inside backend/data/."
            ),
        )

    try:
        df = pd.read_excel(DATA_FILE, sheet_name="Daily_Data")
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Could not read Excel dataset: {exc}")

    df.columns = [str(col).strip().lower() for col in df.columns]
    missing = [col for col in REQUIRED_COLUMNS if col not in df.columns]
    if missing:
        raise HTTPException(
            status_code=400,
            detail=f"Dataset is missing required columns: {', '.join(missing)}",
        )

    df["date"] = pd.to_datetime(df["date"], errors="coerce")
    df["emergency_visits"] = pd.to_numeric(df["emergency_visits"], errors="coerce")
    df = df.dropna(subset=["date", "emergency_visits"]).copy()
    df = df[df["emergency_visits"] >= 0]
    df = df.sort_values("date").drop_duplicates(subset=["date"], keep="last")

    if len(df) < 60:
        raise HTTPException(
            status_code=400,
            detail="At least 60 daily records are required for this demo forecasting pipeline.",
        )

    df["day_of_week"] = df["date"].dt.dayofweek
    df["day_of_year"] = df["date"].dt.dayofyear
    df["month"] = df["date"].dt.month
    df["day_of_month"] = df["date"].dt.day
    df["is_weekend"] = (df["day_of_week"] >= 5).astype(int)

    # Use only features that can be supplied for future dates or derived from the date.
    feature_cols = [
        "day_of_week", "day_of_year", "month", "day_of_month", "is_weekend"
    ]

    # Weather features are included only for historical evaluation. Future weather
    # forecasts are not supplied by this endpoint, so they are intentionally excluded
    # from this first runnable model to avoid pretending future weather is known.
    return df, feature_cols


def train_model(df: pd.DataFrame, feature_cols: list[str]) -> tuple[Any, dict[str, float]]:
    X = df[feature_cols]
    y = df["emergency_visits"]

    split_index = int(len(df) * 0.8)
    if split_index < 30 or len(df) - split_index < 10:
        raise HTTPException(status_code=400, detail="Not enough rows for chronological evaluation.")

    X_train, X_test = X.iloc[:split_index], X.iloc[split_index:]
    y_train, y_test = y.iloc[:split_index], y.iloc[split_index:]

    model = RandomForestRegressor(
        n_estimators=250,
        max_depth=10,
        min_samples_leaf=3,
        random_state=42,
        n_jobs=-1,
    )
    model.fit(X_train, y_train)
    predictions = model.predict(X_test)

    mae = float(mean_absolute_error(y_test, predictions))
    rmse = float(mean_squared_error(y_test, predictions) ** 0.5)
    metrics = {
        "mae_patients": round(mae, 2),
        "rmse_patients": round(rmse, 2),
        "test_days": int(len(y_test)),
        "train_days": int(len(y_train)),
    }

    # Refit on all available history for the forward forecast.
    model.fit(X, y)
    return model, metrics


@router.get("/status")
def forecast_status():
    df, _ = load_dataset()
    return {
        "status": "ready",
        "dataset_file": DATA_FILE.name,
        "records": int(len(df)),
        "start_date": df["date"].min().strftime("%Y-%m-%d"),
        "end_date": df["date"].max().strftime("%Y-%m-%d"),
        "data_type": "SYNTHETIC_DEMO_NOT_REAL_HOSPITAL_DATA",
        "message": "Forecasts from this synthetic demo are for software testing only.",
    }


@router.get("/evaluate")
def evaluate_model():
    df, feature_cols = load_dataset()
    _, metrics = train_model(df, feature_cols)
    return {
        "data_type": "SYNTHETIC_DEMO_NOT_REAL_HOSPITAL_DATA",
        "evaluation": "Chronological holdout; metrics are not evidence of real-world performance.",
        **metrics,
    }


@router.get("/predict")
def predict_patients(days: int = Query(default=7, ge=1, le=30)):
    df, feature_cols = load_dataset()
    model, metrics = train_model(df, feature_cols)

    last_date = df["date"].max()
    future_dates = pd.date_range(last_date + pd.Timedelta(days=1), periods=days, freq="D")
    future = pd.DataFrame({"date": future_dates})
    future["day_of_week"] = future["date"].dt.dayofweek
    future["day_of_year"] = future["date"].dt.dayofyear
    future["month"] = future["date"].dt.month
    future["day_of_month"] = future["date"].dt.day
    future["is_weekend"] = (future["day_of_week"] >= 5).astype(int)

    predictions = model.predict(future[feature_cols])
    forecast = []
    for date, value in zip(future_dates, predictions):
        forecast.append({
            "date": date.strftime("%Y-%m-%d"),
            "predicted_emergency_visits": max(0, int(round(float(value)))),
        })

    return {
        "hospital_name": str(df["hospital_name"].iloc[-1])
        if "hospital_name" in df.columns else "Unknown demo hospital",
        "data_type": "SYNTHETIC_DEMO_NOT_REAL_HOSPITAL_DATA",
        "forecast_days": days,
        "forecast": forecast,
        "evaluation": metrics,
        "warning": (
            "Synthetic-data demonstration only. This model does not use future weather "
            "forecasts and is not validated for real hospital operations or clinical decisions."
        ),
    }
