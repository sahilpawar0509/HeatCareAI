from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from threading import Lock
from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

router = APIRouter(prefix="/api/staff", tags=["Staff Management"])

DATA_FILE = Path(__file__).resolve().parent.parent / "data" / "staff_records.json"
LOCK = Lock()

DEFAULT_STAFF = [
    {"id": 1, "name": "Dr. Asha Kulkarni", "role": "Medical Officer", "department": "Emergency", "shift": "Morning", "status": "On Duty", "phone": ""},
    {"id": 2, "name": "Rahul Patil", "role": "Staff Nurse", "department": "ICU", "shift": "Night", "status": "On Duty", "phone": ""},
    {"id": 3, "name": "Priya Sharma", "role": "Staff Nurse", "department": "General Ward", "shift": "Evening", "status": "On Leave", "phone": ""},
    {"id": 4, "name": "Sameer Jadhav", "role": "Paramedic", "department": "Emergency", "shift": "Morning", "status": "Available", "phone": ""},
    {"id": 5, "name": "Neha Deshmukh", "role": "Technician", "department": "Laboratory", "shift": "Evening", "status": "Available", "phone": ""},
]


class StaffCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    role: str = Field(min_length=1, max_length=60)
    department: str = Field(min_length=1, max_length=80)
    shift: str = Field(min_length=1, max_length=30)
    status: str = Field(min_length=1, max_length=30)
    phone: str = Field(default="", max_length=30)


class StaffUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=100)
    role: str | None = Field(default=None, min_length=1, max_length=60)
    department: str | None = Field(default=None, min_length=1, max_length=80)
    shift: str | None = Field(default=None, min_length=1, max_length=30)
    status: str | None = Field(default=None, min_length=1, max_length=30)
    phone: str | None = Field(default=None, max_length=30)


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
        write_store({"staff": DEFAULT_STAFF, "updated_at": now_utc(), "demo_data": True})


def read_store() -> dict[str, Any]:
    ensure_store()
    try:
        with DATA_FILE.open("r", encoding="utf-8") as file:
            data = json.load(file)
        if not isinstance(data.get("staff"), list):
            raise ValueError("Invalid staff store")
        return data
    except (OSError, json.JSONDecodeError, ValueError):
        data = {"staff": [dict(row) for row in DEFAULT_STAFF], "updated_at": now_utc(), "demo_data": True}
        write_store(data)
        return data


def clean_fields(payload: dict[str, Any]) -> dict[str, Any]:
    return {
        key: value.strip() if isinstance(value, str) else value
        for key, value in payload.items()
    }


@router.get("")
def list_staff() -> dict[str, Any]:
    with LOCK:
        data = read_store()
    staff = data["staff"]
    on_duty = sum(1 for person in staff if person["status"] == "On Duty")
    available = sum(1 for person in staff if person["status"] == "Available")
    on_leave = sum(1 for person in staff if person["status"] == "On Leave")
    departments = sorted({person["department"] for person in staff})
    alerts = []
    for department in departments:
        active = sum(
            1 for person in staff
            if person["department"] == department
            and person["status"] in {"On Duty", "Available"}
        )
        if active == 0:
            alerts.append({
                "level": "Warning",
                "title": f"No active staff listed for {department}",
                "description": "Verify the roster and arrange cover if required."
            })
    return {
        "staff": staff,
        "updated_at": data.get("updated_at"),
        "demo_data": data.get("demo_data", True),
        "summary": {
            "total": len(staff),
            "on_duty": on_duty,
            "available": available,
            "on_leave": on_leave,
            "departments": len(departments),
        },
        "alerts": alerts,
        "source": "server_staff_register",
    }


@router.post("")
def create_staff(payload: StaffCreate) -> dict[str, Any]:
    values = clean_fields(payload.model_dump())
    if not values["name"] or not values["role"] or not values["department"]:
        raise HTTPException(status_code=422, detail="Name, role, and department are required.")
    with LOCK:
        data = read_store()
        if any(person["name"].casefold() == values["name"].casefold() for person in data["staff"]):
            raise HTTPException(status_code=409, detail="A staff member with this name already exists.")
        next_id = max((int(person.get("id", 0)) for person in data["staff"]), default=0) + 1
        person = {"id": next_id, **values}
        data["staff"].append(person)
        data["updated_at"] = now_utc()
        data["demo_data"] = False
        write_store(data)
    return {"message": "Staff member added.", "person": person, "updated_at": data["updated_at"]}


@router.patch("/{staff_id}")
def update_staff(staff_id: int, payload: StaffUpdate) -> dict[str, Any]:
    changes = clean_fields(payload.model_dump(exclude_unset=True))
    if not changes:
        raise HTTPException(status_code=400, detail="No changes supplied.")
    with LOCK:
        data = read_store()
        person = next((row for row in data["staff"] if int(row["id"]) == staff_id), None)
        if person is None:
            raise HTTPException(status_code=404, detail="Staff member not found.")
        if "name" in changes and any(
            int(row["id"]) != staff_id and row["name"].casefold() == changes["name"].casefold()
            for row in data["staff"]
        ):
            raise HTTPException(status_code=409, detail="A staff member with this name already exists.")
        person.update(changes)
        data["updated_at"] = now_utc()
        data["demo_data"] = False
        write_store(data)
    return {"message": "Staff record updated.", "person": person, "updated_at": data["updated_at"]}


@router.delete("/{staff_id}")
def delete_staff(staff_id: int) -> dict[str, Any]:
    with LOCK:
        data = read_store()
        before = len(data["staff"])
        data["staff"] = [row for row in data["staff"] if int(row["id"]) != staff_id]
        if len(data["staff"]) == before:
            raise HTTPException(status_code=404, detail="Staff member not found.")
        data["updated_at"] = now_utc()
        data["demo_data"] = False
        write_store(data)
    return {"message": "Staff member removed.", "updated_at": data["updated_at"]}


@router.post("/reset")
def reset_demo_staff() -> dict[str, Any]:
    with LOCK:
        data = {"staff": [dict(row) for row in DEFAULT_STAFF], "updated_at": now_utc(), "demo_data": True}
        write_store(data)
    return {"message": "Demo staff roster restored.", "updated_at": data["updated_at"]}
