from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from threading import Lock
from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

router = APIRouter(prefix="/api/resources", tags=["Hospital Resources"])
DATA_FILE = Path(__file__).resolve().parent.parent / "data" / "resource_inventory.json"
LOCK = Lock()

DEFAULT_RESOURCES = [
    {"id": 1, "name": "Oxygen cylinders", "category": "Medical gas", "quantity": 48, "unit": "cylinders", "minimum_stock": 20},
    {"id": 2, "name": "Portable ventilators", "category": "Critical equipment", "quantity": 12, "unit": "units", "minimum_stock": 6},
    {"id": 3, "name": "PPE kits", "category": "Protective supplies", "quantity": 160, "unit": "kits", "minimum_stock": 50},
    {"id": 4, "name": "ORS packets", "category": "Hydration supplies", "quantity": 240, "unit": "packets", "minimum_stock": 80},
    {"id": 5, "name": "Cooling units", "category": "Cooling equipment", "quantity": 8, "unit": "units", "minimum_stock": 4},
]

class ResourceCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    category: str = Field(min_length=1, max_length=50)
    quantity: int = Field(ge=0, le=10000000)
    unit: str = Field(min_length=1, max_length=30)
    minimum_stock: int = Field(ge=0, le=10000000)

class ResourceUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=100)
    category: str | None = Field(default=None, min_length=1, max_length=50)
    quantity: int | None = Field(default=None, ge=0, le=10000000)
    unit: str | None = Field(default=None, min_length=1, max_length=30)
    minimum_stock: int | None = Field(default=None, ge=0, le=10000000)

def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()

def save_data(data: dict[str, Any]) -> None:
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    temporary = DATA_FILE.with_suffix(".tmp")
    with temporary.open("w", encoding="utf-8") as file:
        json.dump(data, file, indent=2)
    temporary.replace(DATA_FILE)

def ensure_data() -> None:
    if not DATA_FILE.exists():
        save_data({"resources": [dict(item) for item in DEFAULT_RESOURCES], "updated_at": now_iso(), "demo_data": True})

def read_data() -> dict[str, Any]:
    ensure_data()
    try:
        with DATA_FILE.open("r", encoding="utf-8") as file:
            data = json.load(file)
        if not isinstance(data.get("resources"), list):
            raise ValueError("Invalid resource inventory")
        return data
    except (OSError, json.JSONDecodeError, ValueError):
        data = {"resources": [dict(item) for item in DEFAULT_RESOURCES], "updated_at": now_iso(), "demo_data": True}
        save_data(data)
        return data

def build_alerts(resources: list[dict[str, Any]]) -> list[dict[str, str]]:
    alerts = []
    for item in resources:
        quantity = int(item["quantity"])
        minimum = int(item["minimum_stock"])
        if quantity == 0:
            level = "Critical"
            message = f'{item["name"]} is out of stock.'
        elif quantity <= minimum:
            level = "Warning"
            message = f'{item["name"]} has reached its minimum stock level ({quantity} {item["unit"]} remaining).'
        else:
            continue
        alerts.append({"id": str(item["id"]), "level": level, "title": message, "resource_name": item["name"]})
    return alerts

@router.get("")
def get_resources() -> dict[str, Any]:
    with LOCK:
        data = read_data()
    return {"resources": data["resources"], "updated_at": data.get("updated_at"), "demo_data": data.get("demo_data", True), "alerts": build_alerts(data["resources"]), "source": "server_resource_register"}

@router.post("")
def add_resource(payload: ResourceCreate) -> dict[str, Any]:
    name = payload.name.strip()
    with LOCK:
        data = read_data()
        if any(item["name"].casefold() == name.casefold() for item in data["resources"]):
            raise HTTPException(status_code=409, detail="A resource with this name already exists.")
        next_id = max((int(item.get("id", 0)) for item in data["resources"]), default=0) + 1
        resource = {"id": next_id, "name": name, "category": payload.category.strip(), "quantity": payload.quantity, "unit": payload.unit.strip(), "minimum_stock": payload.minimum_stock}
        data["resources"].append(resource)
        data["updated_at"] = now_iso()
        data["demo_data"] = False
        save_data(data)
    return {"message": "Resource added.", "resource": resource, "updated_at": data["updated_at"]}

@router.patch("/{resource_id}")
def update_resource(resource_id: int, payload: ResourceUpdate) -> dict[str, Any]:
    changes = payload.model_dump(exclude_unset=True)
    if not changes:
        raise HTTPException(status_code=400, detail="No changes supplied.")
    with LOCK:
        data = read_data()
        resource = next((item for item in data["resources"] if int(item["id"]) == resource_id), None)
        if resource is None:
            raise HTTPException(status_code=404, detail="Resource not found.")
        updated = {**resource, **changes}
        for key in ("name", "category", "unit"):
            if key in changes:
                updated[key] = changes[key].strip()
        if any(int(item["id"]) != resource_id and item["name"].casefold() == str(updated["name"]).casefold() for item in data["resources"]):
            raise HTTPException(status_code=409, detail="A resource with this name already exists.")
        resource.update(updated)
        data["updated_at"] = now_iso()
        data["demo_data"] = False
        save_data(data)
    return {"message": "Resource updated.", "resource": resource, "updated_at": data["updated_at"]}

@router.delete("/{resource_id}")
def delete_resource(resource_id: int) -> dict[str, Any]:
    with LOCK:
        data = read_data()
        original_count = len(data["resources"])
        data["resources"] = [item for item in data["resources"] if int(item["id"]) != resource_id]
        if len(data["resources"]) == original_count:
            raise HTTPException(status_code=404, detail="Resource not found.")
        data["updated_at"] = now_iso()
        data["demo_data"] = False
        save_data(data)
    return {"message": "Resource removed.", "updated_at": data["updated_at"]}

@router.post("/reset")
def reset_resource_demo() -> dict[str, Any]:
    with LOCK:
        data = {"resources": [dict(item) for item in DEFAULT_RESOURCES], "updated_at": now_iso(), "demo_data": True}
        save_data(data)
    return {"message": "Demo resource records restored.", "updated_at": data["updated_at"]}
