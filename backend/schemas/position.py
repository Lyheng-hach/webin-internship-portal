from datetime import date, datetime
from decimal import Decimal
from typing import List, Literal, Optional
from pydantic import BaseModel


class PositionCreate(BaseModel):
    title: str
    description_post: Optional[str] = None
    location: str
    department: Optional[str] = None
    salary_min: Optional[Decimal] = None
    salary_max: Optional[Decimal] = None
    position_type: Literal["Full-Time", "Part-Time", "Remote", "Hybrid"] = "Full-Time"
    deadtime: Optional[date] = None
    slots: int = 1
    status: Literal["Active", "Draft", "Closed", "Expired"] = "Draft"
    skill_ids: List[int] = []


class PositionUpdate(BaseModel):
    title: Optional[str] = None
    description_post: Optional[str] = None
    location: Optional[str] = None
    department: Optional[str] = None
    salary_min: Optional[Decimal] = None
    salary_max: Optional[Decimal] = None
    position_type: Optional[Literal["Full-Time", "Part-Time", "Remote", "Hybrid"]] = None
    slots: Optional[int] = None
    status: Optional[Literal["Active", "Draft", "Closed", "Expired"]] = None
    deadtime: Optional[date] = None
    skill_ids: Optional[List[int]] = None


class PositionOut(BaseModel):
    intern_position_id: int
    company_id: int
    title: str
    description_post: Optional[str]
    location: str
    department: Optional[str]
    salary_min: Optional[Decimal]
    salary_max: Optional[Decimal]
    position_type: str
    posted_date: Optional[date]
    deadtime: Optional[date]
    status: str
    slots: int
    filled_slots: int
    created_at: datetime

    class Config:
        from_attributes = True


class PositionRichOut(PositionOut):
    """Enriched position with company name and skill names — returned by list/detail endpoints."""
    company_name: Optional[str] = None
    skills: List[str] = []
