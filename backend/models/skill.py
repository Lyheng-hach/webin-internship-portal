from sqlalchemy import Column, DateTime, Enum, Integer, String, func
from database import Base


class Skill(Base):
    __tablename__ = "Skill"

    skill_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), unique=True, nullable=False)
    category = Column(
        Enum("Frontend", "Backend", "DataBase", "Mobile", "DevOps", "Design", "Data", "AI_ML", "Programming", "Other"),
        nullable=False,
    )
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
