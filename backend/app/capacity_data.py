from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from threading import Lock
from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

router = APIRouter(prefix="/api/capacity", tags=["Hospital Capacity"])

DATA_FILE = (
    Path(__file__).resolve().parent.parent
    / "data"
    / "capacity_units.json"
)

LOCK = Lock()

DEFAULT_UNITS = [
    {
        "id": 1,
        "name": "General ward",
        "category": "Ward",
        "total": 70,
        "occupied": 42,
    },
    {
        "id": 2,
        "name": "Intensive Care Unit (ICU)",
        "category": "ICU",
        "total": 22,
        "occupied": 18,
    },
    {
        "id": 3,
        "name": "Emergency observation",
        "category": "Emergency",
        "total": 18,
        "occupied": 11,
    },
    {
        "id": 4,
        "name": "Step-down unit",
        "category": "Ward",
        "total": 10,
        "occupied": 7,
    },
]


class UnitCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    category: str = Field(min_length=1, max_length=30)
    total: int = Field(ge=1, le=100000)
    occupied: int = Field(ge=0, le=100000)


class UnitUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=100)
    category: str | None = Field(default=None, min_length=1, max_length=30)
    total: int | None = Field(default=None, ge=1, le=100000)
    occupied: int | None = Field(default=None, ge=0, le=100000)


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def write_store(data: dict[str, Any]) -> None:
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)

    temporary = DATA_FILE.with_suffix(".tmp")

    with temporary.open("w", encoding="utf-8") as file:
        json.dump(data, file, indent=2)

    temporary.replace(DATA_FILE)


def ensure_store() -> None:
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)

    if not DATA_FILE.exists():
        write_store({
            "units": DEFAULT_UNITS,
            "updated_at": utc_now(),
            "demo_data": True,
        })


def read_store() -> dict[str, Any]:
    ensure_store()

    try:
        with DATA_FILE.open("r", encoding="utf-8") as file:
            data = json.load(file)

        if not isinstance(data.get("units"), list):
            raise ValueError("Invalid capacity data")

        return data

    except (OSError, json.JSONDecodeError, ValueError):
        data = {
            "units": [dict(unit) for unit in DEFAULT_UNITS],
            "updated_at": utc_now(),
            "demo_data": True,
        }

        write_store(data)
        return data


def build_alerts(
    units: list[dict[str, Any]]
) -> list[dict[str, str]]:

    alerts = []

    for unit in units:
        total = int(unit["total"])
        occupied = int(unit["occupied"])
        available = total - occupied

        percent = (
            round((occupied / total) * 100)
            if total
            else 0
        )

        if available == 0:
            alerts.append({
                "level": "Critical",
                "title": f'{unit["name"]}: no beds available',
                "description": (
                    "All registered beds are occupied. "
                    "Confirm current figures and follow "
                    "hospital escalation procedures."
                ),
            })

        elif percent >= 95:
            alerts.append({
                "level": "Critical",
                "title": f'{unit["name"]}: occupancy at {percent}%',
                "description": (
                    f"{available} beds remain. "
                    "Occupancy has reached the critical threshold."
                ),
            })

        elif percent >= 80:
            alerts.append({
                "level": "Warning",
                "title": (
                    f'{unit["name"]}: high occupancy ({percent}%)'
                ),
                "description": (
                    f"{available} beds remain. "
                    "Review capacity and staffing."
                ),
            })

        elif available < 20:
            alerts.append({
                "level": "Warning",
                "title": (
                    f'{unit["name"]}: fewer than 20 beds available'
                ),
                "description": (
                    f"{available} beds remain available in this unit."
                ),
            })

    return alerts


@router.get("")
def get_capacity() -> dict[str, Any]:
    with LOCK:
        data = read_store()

    units = data["units"]

    return {
        "units": units,
        "updated_at": data.get("updated_at"),
        "alerts": build_alerts(units),
        "source": "server_capacity_register",
        "demo_data": data.get("demo_data", True),
    }


@router.post("")
def add_capacity_unit(
    payload: UnitCreate,
) -> dict[str, Any]:

    if payload.occupied > payload.total:
        raise HTTPException(
            status_code=422,
            detail="Occupied beds cannot exceed total beds.",
        )

    with LOCK:
        data = read_store()

        if any(
            item["name"].casefold() == payload.name.strip().casefold()
            for item in data["units"]
        ):
            raise HTTPException(
                status_code=409,
                detail="A unit with this name already exists.",
            )

        next_id = max(
            (
                int(unit.get("id", 0))
                for unit in data["units"]
            ),
            default=0,
        ) + 1

        unit = {
            "id": next_id,
            "name": payload.name.strip(),
            "category": payload.category.strip(),
            "total": payload.total,
            "occupied": payload.occupied,
        }

        data["units"].append(unit)
        data["updated_at"] = utc_now()
        data["demo_data"] = False

        write_store(data)

    return {
        "message": "Unit added.",
        "unit": unit,
        "updated_at": data["updated_at"],
    }


@router.patch("/{unit_id}")
def update_capacity_unit(
    unit_id: int,
    payload: UnitUpdate,
) -> dict[str, Any]:

    changes = payload.model_dump(exclude_unset=True)

    if not changes:
        raise HTTPException(
            status_code=400,
            detail="No changes supplied.",
        )

    with LOCK:
        data = read_store()

        unit = next(
            (
                item
                for item in data["units"]
                if int(item["id"]) == unit_id
            ),
            None,
        )

        if unit is None:
            raise HTTPException(
                status_code=404,
                detail="Hospital unit not found.",
            )

        updated = {**unit, **changes}

        if "name" in changes:
            updated["name"] = changes["name"].strip()

        if "category" in changes:
            updated["category"] = changes["category"].strip()

        if int(updated["occupied"]) > int(updated["total"]):
            raise HTTPException(
                status_code=422,
                detail="Occupied beds cannot exceed total beds.",
            )

        for item in data["units"]:
            if (
                int(item["id"]) != unit_id
                and item["name"].casefold()
                == str(updated["name"]).casefold()
            ):
                raise HTTPException(
                    status_code=409,
                    detail="A unit with this name already exists.",
                )

        unit.update(updated)

        data["updated_at"] = utc_now()
        data["demo_data"] = False

        write_store(data)

    return {
        "message": "Unit updated.",
        "unit": unit,
        "updated_at": data["updated_at"],
    }


@router.delete("/{unit_id}")
def delete_capacity_unit(
    unit_id: int,
) -> dict[str, Any]:

    with LOCK:
        data = read_store()

        original_count = len(data["units"])

        data["units"] = [
            item
            for item in data["units"]
            if int(item["id"]) != unit_id
        ]

        if len(data["units"]) == original_count:
            raise HTTPException(
                status_code=404,
                detail="Hospital unit not found.",
            )

        data["updated_at"] = utc_now()
        data["demo_data"] = False

        write_store(data)

    return {
        "message": "Unit removed.",
        "updated_at": data["updated_at"],
    }


@router.post("/reset")
def reset_capacity_demo() -> dict[str, Any]:

    with LOCK:
        data = {
            "units": [
                dict(unit)
                for unit in DEFAULT_UNITS
            ],
            "updated_at": utc_now(),
            "demo_data": True,
        }

        write_store(data)

    return {
        "message": "Demo capacity records restored.",
        "updated_at": data["updated_at"],
    }