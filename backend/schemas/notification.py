from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class NotificationOut(BaseModel):
    notification_id: int
    application_id:  int
    student_id:      int
    company_id:      int
    type:            str
    message:         str
    is_read:         bool
    created_at:      datetime
    # enriched fields
    student_name:    Optional[str] = None
    company_name:    Optional[str] = None
    position_title:  Optional[str] = None

    class Config:
        from_attributes = True
