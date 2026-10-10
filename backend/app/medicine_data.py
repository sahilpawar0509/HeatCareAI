from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from threading import Lock
from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

router = APIRouter(prefix="/api/medicines", tags=["Medicine Inventory"])

DATA_FILE = Path(__file__).resolve().parent.parent / "data" / "medicine_inventory.json"
LOCK = Lock()

DEFAULT_MEDICINES = [
    {"id": 1, "name": "Oral Rehydration Salts (ORS)", "category": "Rehydration", "quantity": 240, "unit": "sachets", "minimum_stock": 80, "expiry_date": ""},
    {"id": 2, "name": "Normal Saline 0.9%", "category": "IV Fluids", "quantity": 160, "unit": "bottles", "minimum_stock": 50, "expiry_date": ""},
    {"id": 3, "name": "Paracetamol", "category": "Emergency Medicines", "quantity": 300, "unit": "tablets", "minimum_stock": 100, "expiry_date": ""},
    {"id": 4, "name": "Cooling Packs", "category": "Cooling & First Aid", "quantity": 45, "unit": "packs", "minimum_stock": 20, "expiry_date": ""},
    {"id": 5, "name": "IV Cannula", "category": "Medical Supplies", "quantity": 75, "unit": "units", "minimum_stock": 30, "expiry_date": ""},
]


class MedicineCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    category: str = Field(min_length=1, max_length=60)
    quantity: int = Field(ge=0, le=100000000)
    unit: str = Field(min_length=1, max_length=30)
    minimum_stock: int = Field(ge=0, le=100000000)
    expiry_date: str = Field(default="", max_length=30)


class MedicineUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=120)
    category: str | None = Field(default=None, min_length=1, max_length=60)
    quantity: int | None = Field(default=None, ge=0, le=100000000)
    unit: str | None = Field(default=None, min_length=1, max_length=30)
    minimum_stock: int | None = Field(default=None, ge=0, le=100000000)
    expiry_date: str | None = Field(default=None, max_length=30)


def now_utc() -> str:
    return datetime.now(timezone.utc).isoformat()


def write_store(data: dict[str, Any]) -> None:
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    temp = DATA_FILE.with_suffix(".tmp")
    with temp.open("w", encoding="utf-8") as file:
        json.dump(data, file, indent=2)
    temp.replace(DATA_FILE)


def ensure_store() -> None:
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    if not DATA_FILE.exists():
        write_store({"medicines": [dict(row) for row in DEFAULT_MEDICINES], "updated_at": now_utc(), "demo_data": True})


def read_store() -> dict[str, Any]:
    ensure_store()
    try:
        with DATA_FILE.open("r", encoding="utf-8") as file:
            data = json.load(file)
        if not isinstance(data.get("medicines"), list):
            raise ValueError("Invalid medicine inventory store")
        return data
    except (OSError, json.JSONDecodeError, ValueError):
        data = {"medicines": [dict(row) for row in DEFAULT_MEDICINES], "updated_at": now_utc(), "demo_data": True}
        write_store(data)
        return data


def clean_fields(values: dict[str, Any]) -> dict[str, Any]:
    return {key: value.strip() if isinstance(value, str) else value for key, value in values.items()}


def make_alerts(medicines: list[dict[str, Any]]) -> list[dict[str, str]]:
    alerts = []
    today = datetime.now(timezone.utc).date()
    for medicine in medicines:
        quantity = int(medicine.get("quantity", 0))
        minimum = int(medicine.get("minimum_stock", 0))
        if quantity == 0:
            alerts.append({"id": f'{medicine["id"]}-empty', "level": "Critical", "title": f'{medicine["name"]} is out of stock'})
        elif quantity <= minimum:
            alerts.append({"id": f'{medicine["id"]}-low', "level": "Warning", "title": f'{medicine["name"]} is at or below minimum stock'})
        expiry = str(medicine.get("expiry_date", "")).strip()
        if expiry:
            try:
                expiry_date = datetime.strptime(expiry, "%Y-%m-%d").date()
                days_left = (expiry_date - today).days
                if days_left < 0:
                    alerts.append({"id": f'{medicine["id"]}-expired', "level": "Critical", "title": f'{medicine["name"]} has an expiry date in the past'})
                elif days_left <= 30:
                    alerts.append({"id": f'{medicine["id"]}-expiry', "level": "Warning", "title": f'{medicine["name"]} expires within {days_left} day(s)'})
            except ValueError:
                alerts.append({"id": f'{medicine["id"]}-expiry-invalid', "level": "Warning", "title": f'{medicine["name"]} has an invalid expiry date'})
    return alerts


@router.get("")
def list_medicines() -> dict[str, Any]:
    with LOCK:
        data = read_store()
    medicines = data["medicines"]
    return {
        "medicines": medicines,
        "updated_at": data.get("updated_at"),
        "demo_data": data.get("demo_data", True),
        "alerts": make_alerts(medicines),
        "summary": {
            "total_items": len(medicines),
            "total_quantity": sum(int(item.get("quantity", 0)) for item in medicines),
            "low_stock": sum(1 for item in medicines if 0 < int(item.get("quantity", 0)) <= int(item.get("minimum_stock", 0))),
            "out_of_stock": sum(1 for item in medicines if int(item.get("quantity", 0)) == 0),
        },
        "source": "server_medicine_inventory",
    }


@router.post("")
def add_medicine(payload: MedicineCreate) -> dict[str, Any]:
    values = clean_fields(payload.model_dump())
    if not values["name"] or not values["category"] or not values["unit"]:
        raise HTTPException(status_code=422, detail="Name, category, and unit are required.")
    if values["expiry_date"]:
        try:
            datetime.strptime(values["expiry_date"], "%Y-%m-%d")
        except ValueError:
            raise HTTPException(status_code=422, detail="Expiry date must use YYYY-MM-DD format.")
    with LOCK:
        data = read_store()
        if any(item["name"].casefold() == values["name"].casefold() for item in data["medicines"]):
            raise HTTPException(status_code=409, detail="A medicine with this name already exists.")
        next_id = max((int(item.get("id", 0)) for item in data["medicines"]), default=0) + 1
        item = {"id": next_id, **values}
        data["medicines"].append(item)
        data["updated_at"] = now_utc()
        data["demo_data"] = False
        write_store(data)
    return {"message": "Medicine added.", "medicine": item, "updated_at": data["updated_at"]}


@router.patch("/{medicine_id}")
def update_medicine(medicine_id: int, payload: MedicineUpdate) -> dict[str, Any]:
    changes = clean_fields(payload.model_dump(exclude_unset=True))
    if not changes:
        raise HTTPException(status_code=400, detail="No changes supplied.")
    if "expiry_date" in changes and changes["expiry_date"]:
        try:
            datetime.strptime(changes["expiry_date"], "%Y-%m-%d")
        except ValueError:
            raise HTTPException(status_code=422, detail="Expiry date must use YYYY-MM-DD format.")
    with LOCK:
        data = read_store()
        item = next((row for row in data["medicines"] if int(row["id"]) == medicine_id), None)
        if item is None:
            raise HTTPException(status_code=404, detail="Medicine not found.")
        if "name" in changes and any(int(row["id"]) != medicine_id and row["name"].casefold() == changes["name"].casefold() for row in data["medicines"]):
            raise HTTPException(status_code=409, detail="A medicine with this name already exists.")
        item.update(changes)
        data["updated_at"] = now_utc()
        data["demo_data"] = False
        write_store(data)
    return {"message": "Medicine updated.", "medicine": item, "updated_at": data["updated_at"]}


@router.delete("/{medicine_id}")
def delete_medicine(medicine_id: int) -> dict[str, Any]:
    with LOCK:
        data = read_store()
        before = len(data["medicines"])
        data["medicines"] = [row for row in data["medicines"] if int(row["id"]) != medicine_id]
        if len(data["medicines"]) == before:
            raise HTTPException(status_code=404, detail="Medicine not found.")
        data["updated_at"] = now_utc()
        data["demo_data"] = False
        write_store(data)
    return {"message": "Medicine removed.", "updated_at": data["updated_at"]}


@router.post("/reset")
def reset_demo_medicines() -> dict[str, Any]:
    with LOCK:
        data = {"medicines": [dict(row) for row in DEFAULT_MEDICINES], "updated_at": now_utc(), "demo_data": True}
        write_store(data)
    return {"message": "Illustrative medicine inventory restored.", "updated_at": data["updated_at"]}
