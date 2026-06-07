from sqlalchemy import Column, DateTime, Enum, ForeignKey, Integer, SmallInteger, Text, UniqueConstraint, func
from database import Base


class Evaluation(Base):
    __tablename__ = "Evaluation"
    __table_args__ = (
        UniqueConstraint("intern_id", "evaluation_type", name="uq_evaluation_intern_type"),
    )

    evaluation_id = Column(Integer, primary_key=True, autoincrement=True)
    intern_id = Column(Integer, ForeignKey("InternInfo.intern_id", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False)
    supervisor_id = Column(Integer, ForeignKey("Supervisor.supervisor_id", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False)
    evaluation_type = Column(Enum("Midterm", "Final"), nullable=False)
    technical_score = Column(SmallInteger, nullable=True)
    communication_score = Column(SmallInteger, nullable=True)
    problem_solving = Column(SmallInteger, nullable=True)
    attitude_score = Column(SmallInteger, nullable=True)
    total_score = Column(SmallInteger, nullable=True)
    feedback = Column(Text, nullable=True)
    status = Column(Enum("Pending", "Submitted", "Reviewed"), nullable=False, default="Pending")
    submitted_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
