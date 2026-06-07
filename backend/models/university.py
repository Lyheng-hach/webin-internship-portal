from sqlalchemy import Column, DateTime, Integer, String, func
from database import Base


class University(Base):
    __tablename__ = "University"

    university_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    address = Column(String(255), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    phone = Column(String(20), nullable=False)
    website = Column(String(150), nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
