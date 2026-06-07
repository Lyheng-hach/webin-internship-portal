from sqlalchemy import Column, Date, DateTime, Enum, ForeignKey, Integer, String, func
from database import Base


class Document(Base):
    __tablename__ = "Document"

    document_id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey("Student.student_id", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False)
    document_type = Column(String(100), nullable=True)
    file_name = Column(String(250), nullable=True)
    file_url = Column(String(250), nullable=True)
    status = Column(Enum("Pending", "Verified", "Rejected"), nullable=False, default="Pending")
    upload_date = Column(Date, nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
