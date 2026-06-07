from datetime import datetime
from typing import Literal, Optional
from pydantic import BaseModel


class SupervisionRequestCreate(BaseModel):
    supervisor_id: int
    message: Optional[str] = None


class SupervisionRequestRespond(BaseModel):
    status: Literal["Approved", "Rejected"]


class SupervisionRequestOut(BaseModel):
    request_id:      int
    student_id:      int
    supervisor_id:   int
    message:         Optional[str]
    status:          str
    created_at:      datetime
    student_name:    Optional[str] = None
    supervisor_name: Optional[str] = None

    class Config:
        from_attributes = True


class SupervisorNotifOut(BaseModel):
    id:           int
    supervisor_id: int
    title:        str
    message:      str
    is_read:      bool
    created_at:   datetime

    class Config:
        from_attributes = True
