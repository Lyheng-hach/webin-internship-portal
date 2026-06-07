from sqlalchemy import Column, DateTime, Enum, Integer, String, func
from database import Base


class UserAccount(Base):
    __tablename__ = "UserAccount"

    user_id = Column(Integer, primary_key=True, autoincrement=True)
    user_email = Column(String(100), unique=True, nullable=False)
    user_password = Column(String(255), nullable=False)
    role = Column(Enum("student", "supervisor", "company", "admin"), nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
