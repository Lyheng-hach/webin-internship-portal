from sqlalchemy import Column, Date, DateTime, Enum, ForeignKey, Integer, String, UniqueConstraint, func
from database import Base


class InternInfo(Base):
    __tablename__ = "InternInfo"
    __table_args__ = (
        UniqueConstraint("student_id", "intern_position_id", name="uq_interninfo_student_position"),
    )

    intern_id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey("Student.student_id", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False)
    company_id = Column(Integer, ForeignKey("Company.company_id", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False)
    supervisor_id = Column(Integer, ForeignKey("Supervisor.supervisor_id", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False)
    intern_position_id = Column(Integer, ForeignKey("InternPosition.intern_position_id", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False)
    department = Column(String(100), nullable=False)
    field = Column(String(100), nullable=True)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    status = Column(
        Enum("Pending", "Active", "Completed", "Terminated"),
        nullable=False,
        default="Pending",
    )
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
