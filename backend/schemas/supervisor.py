from datetime import datetime
from typing import Literal, Optional
from pydantic import BaseModel


class SupervisorCreate(BaseModel):
    university_id: int
    name: str
    phone: str
    department: str
    position: Literal["Lecturer", "Senior_Lecturer", "Associate_Professor", "Professor", "Advisor"] = "Lecturer"
    specialization: Optional[str] = None
    office: Optional[str] = None
    office_hours: Optional[str] = None


class SupervisorUpdate(BaseModel):
    phone: Optional[str] = None
    department: Optional[str] = None
    specialization: Optional[str] = None
    office: Optional[str] = None
    office_hours: Optional[str] = None


class SupervisorOut(SupervisorCreate):
    supervisor_id: int
    user_id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
