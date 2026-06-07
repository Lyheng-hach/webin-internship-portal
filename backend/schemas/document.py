from datetime import date, datetime
from typing import Literal, Optional
from pydantic import BaseModel


class DocumentCreate(BaseModel):
    document_type: Literal["Resume", "ID Card", "Transcript", "Offer Letter", "Certificate", "Other"]
    file_name: str
    file_url: str


class DocumentUpdate(BaseModel):
    file_name: Optional[str] = None
    file_url:  Optional[str] = None


class DocumentOut(BaseModel):
    document_id:   int
    student_id:    int
    document_type: Optional[str]
    file_name:     Optional[str]
    file_url:      Optional[str]
    status:        str
    upload_date:   Optional[date]
    created_at:    datetime

    class Config:
        from_attributes = True
