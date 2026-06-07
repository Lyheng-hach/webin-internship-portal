from sqlalchemy import Column, Date, DateTime, Enum, ForeignKey, Integer, Text, UniqueConstraint, func
from database import Base


class Application(Base):
    __tablename__ = "Application"
    __table_args__ = (
        UniqueConstraint("student_id", "intern_position_id", name="uq_application_student_position"),
    )

    application_id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey("Student.student_id", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False)
    intern_position_id = Column(Integer, ForeignKey("InternPosition.intern_position_id", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False)
    apply_date = Column(Date, nullable=False)
    document_id = Column(Integer, ForeignKey("Document.document_id", ondelete="SET NULL", onupdate="CASCADE"), nullable=True)
    cover_letter = Column(Text, nullable=True)
    remarks = Column(Text, nullable=True)
    status = Column(
        Enum("Pending", "Reviewed", "Accepted", "Rejected", "Withdraw"),
        nullable=False,
        default="Pending",
    )
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
