from sqlalchemy import Column, DateTime, Enum, ForeignKey, Integer, String, func
from database import Base


class Supervisor(Base):
    __tablename__ = "Supervisor"

    supervisor_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("UserAccount.user_id", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False)
    university_id = Column(Integer, ForeignKey("University.university_id", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False)
    name = Column(String(50), nullable=False)
    phone = Column(String(20), unique=True, nullable=False)
    department = Column(String(100), nullable=False)
    position = Column(
        Enum("Lecturer", "Senior_Lecturer", "Associate_Professor", "Professor", "Advisor"),
        nullable=False,
        default="Lecturer",
    )
    specialization = Column(String(150), nullable=True)
    office = Column(String(100), nullable=True)
    office_hours = Column(String(100), nullable=True)
    status = Column(Enum("Active", "Inactive"), nullable=False, default="Active")
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
