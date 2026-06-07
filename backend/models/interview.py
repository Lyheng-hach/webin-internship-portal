from sqlalchemy import Column, DateTime, Enum, ForeignKey, Integer, Text, UniqueConstraint, func
from database import Base


class Interview(Base):
    __tablename__ = "Interview"
    __table_args__ = (
        UniqueConstraint("application_id", name="uq_interview_application"),
    )

    interview_id = Column(Integer, primary_key=True, autoincrement=True)
    application_id = Column(Integer, ForeignKey("Application.application_id", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False)
    company_id = Column(Integer, ForeignKey("Company.company_id", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False)
    student_id = Column(Integer, ForeignKey("Student.student_id", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False)
    scheduled_at = Column(DateTime, nullable=False)
    location = Column(Text, nullable=False)
    interview_type = Column(Enum("Online", "Onsite"), nullable=False, default="Online")
    status = Column(
        Enum("Scheduled", "Completed", "Cancelled", "Rescheduled"),
        nullable=False,
        default="Scheduled",
    )
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
