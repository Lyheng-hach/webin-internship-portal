from sqlalchemy import Column, DateTime, Enum, ForeignKey, Integer, Text, func
from database import Base


class SupervisionRequest(Base):
    __tablename__ = "SupervisionRequest"

    request_id    = Column(Integer, primary_key=True, autoincrement=True)
    student_id    = Column(Integer, ForeignKey("Student.student_id",       ondelete="CASCADE"), nullable=False)
    supervisor_id = Column(Integer, ForeignKey("Supervisor.supervisor_id", ondelete="CASCADE"), nullable=False)
    message       = Column(Text, nullable=True)
    status        = Column(Enum("Pending", "Approved", "Rejected"), nullable=False, default="Pending")
    created_at    = Column(DateTime, default=func.now())
    updated_at    = Column(DateTime, default=func.now(), onupdate=func.now())
