from datetime import date, datetime
from decimal import Decimal
from typing import Literal, Optional
from pydantic import BaseModel


class StudentCreate(BaseModel):
    university_id: int
    name: str
    gender: Literal["M", "F"]
    date_of_birth: date
    nationality: str
    marital_status: Literal["Single", "Married"] = "Single"
    phone: str
    address: str
    year_of_study: int
    major: str
    gpa: Optional[Decimal] = None
    profile_picture: Optional[str] = None


class StudentUpdate(BaseModel):
    university_id: Optional[int] = None
    name: Optional[str] = None
    gender: Optional[Literal["M", "F"]] = None
    date_of_birth: Optional[date] = None
    nationality: Optional[str] = None
    marital_status: Optional[Literal["Single", "Married"]] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    year_of_study: Optional[int] = None
    major: Optional[str] = None
    gpa: Optional[Decimal] = None
    profile_picture: Optional[str] = None


class StudentOut(StudentCreate):
    student_id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
