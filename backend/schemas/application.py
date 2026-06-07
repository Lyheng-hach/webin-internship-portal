from datetime import date, datetime
from decimal import Decimal
from typing import List, Literal, Optional
from pydantic import BaseModel


class ApplicationCreate(BaseModel):
    intern_position_id: int
    document_ids: Optional[List[int]] = []   # multi-doc support
    cover_letter: Optional[str] = None


class ApplicationStatusUpdate(BaseModel):
    status: Literal["Pending", "Reviewed", "Accepted", "Rejected", "Withdraw"]
    remarks: Optional[str] = None


class ApplicationOut(BaseModel):
    application_id: int
    student_id: int
    intern_position_id: int
    apply_date: date
    cover_letter: Optional[str]
    remarks: Optional[str]
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class DocInfo(BaseModel):
    doc_id:   int
    doc_type: Optional[str] = None
    doc_name: Optional[str] = None
    doc_url:  Optional[str] = None


class ApplicationRichOut(ApplicationOut):
    """Enriched application with joined position + company fields."""
    position_title: Optional[str] = None
    company_name:   Optional[str] = None
    company_id:     Optional[int] = None
    location:       Optional[str] = None
    position_type:  Optional[str] = None
    salary_min:     Optional[Decimal] = None
    salary_max:     Optional[Decimal] = None
    student_name:   Optional[str] = None
    university_id:  Optional[int] = None
    documents:      List[DocInfo] = []
