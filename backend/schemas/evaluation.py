from datetime import datetime
from typing import Literal, Optional
from pydantic import BaseModel


class EvaluationCreate(BaseModel):
    intern_id: int
    evaluation_type: Literal["Midterm", "Final"]
    technical_score: Optional[int] = None
    communication_score: Optional[int] = None
    problem_solving: Optional[int] = None
    attitude_score: Optional[int] = None
    total_score: Optional[int] = None
    feedback: Optional[str] = None


class EvaluationOut(EvaluationCreate):
    evaluation_id: int
    supervisor_id: int
    status: str
    submitted_at: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True
