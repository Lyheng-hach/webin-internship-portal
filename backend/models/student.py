from sqlalchemy import Column, Date, DateTime, Enum, ForeignKey, Integer, Numeric, String, func
from database import Base


class Student(Base):
    __tablename__ = "Student"

    student_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("UserAccount.user_id", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False)
    university_id = Column(Integer, ForeignKey("University.university_id", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False)
    name = Column(String(50), nullable=False)
    gender = Column(Enum("M", "F"), nullable=False)
    date_of_birth = Column(Date, nullable=False)
    nationality = Column(String(50), nullable=False)
    marital_status = Column(Enum("Single", "Married"), nullable=False, default="Single")
    phone = Column(String(20), nullable=False)
    address = Column(String(200), nullable=False)
    year_of_study = Column(Integer, nullable=False)
    major = Column(String(100), nullable=False)
    gpa = Column(Numeric(3, 2), nullable=True)
    profile_picture = Column(String(250), nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
