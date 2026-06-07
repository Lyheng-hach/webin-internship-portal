from datetime import datetime
from typing import Literal, Optional
from pydantic import BaseModel


class InterviewCreate(BaseModel):
    application_id: int
    student_id: int
    scheduled_at: datetime
    location: str
    interview_type: Literal["Online", "Onsite"] = "Online"


class InterviewStatusUpdate(BaseModel):
    status: Literal["Scheduled", "Completed", "Cancelled"]


class InterviewOut(BaseModel):
    interview_id: int
    application_id: int
    company_id: int
    student_id: int
    scheduled_at: datetime
    location: str
    interview_type: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
