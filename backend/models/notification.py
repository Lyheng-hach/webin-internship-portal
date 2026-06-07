from sqlalchemy import Boolean, Column, DateTime, Enum, ForeignKey, Integer, Text, func
from database import Base


class Notification(Base):
    __tablename__ = "Notification"

    notification_id = Column(Integer, primary_key=True, autoincrement=True)
    application_id = Column(Integer, ForeignKey("Application.application_id", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False)
    student_id = Column(Integer, ForeignKey("Student.student_id", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False)
    company_id = Column(Integer, ForeignKey("Company.company_id", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False)
    type = Column(
        Enum(
            "APPLICATION_SUBMITTED",
            "APPLICATION_REVIEWED",
            "APPLICATION_ACCEPTED",
            "APPLICATION_REJECTED",
            "APPLICATION_WITHDRAW",
            "APPLICATION_DEADLINE",
        ),
        nullable=False,
    )
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, default=func.now())
