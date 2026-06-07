from datetime import date, datetime
from typing import Literal, Optional
from pydantic import BaseModel


class InternCreate(BaseModel):
    student_id: int
    intern_position_id: int
    department: str
    field: Optional[str] = None
    start_date: date
    end_date: date
    supervisor_id: int


class InternStatusUpdate(BaseModel):
    status: Literal["Pending", "Active", "Completed", "Terminated"]


class InternOut(BaseModel):
    intern_id: int
    student_id: int
    company_id: int
    supervisor_id: int
    intern_position_id: int
    department: str
    field: Optional[str]
    start_date: date
    end_date: date
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class InternRichOut(InternOut):
    """Enriched with joined names for display."""
    student_name: Optional[str] = None
    position_title: Optional[str] = None
    supervisor_name: Optional[str] = None
