from sqlalchemy import Column, Date, DateTime, Enum, ForeignKey, Integer, Numeric, String, Text, func
from database import Base


class InternPosition(Base):
    __tablename__ = "InternPosition"

    intern_position_id = Column(Integer, primary_key=True, autoincrement=True)
    company_id = Column(Integer, ForeignKey("Company.company_id", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False)
    title = Column(String(150), nullable=False)
    description_post = Column(Text, nullable=True)
    location = Column(String(250), nullable=False)
    department = Column(String(100), nullable=True)
    salary_min = Column(Numeric(10, 2), nullable=True)
    salary_max = Column(Numeric(10, 2), nullable=True)
    position_type = Column(
        Enum("Full-Time", "Part-Time", "Remote", "Hybrid"),
        nullable=False,
        default="Full-Time",
    )
    posted_date = Column(Date, nullable=True)
    deadtime = Column(Date, nullable=True)
    status = Column(Enum("Active", "Draft", "Closed", "Expired"), nullable=False, default="Draft")
    slots = Column(Integer, nullable=False, default=1)
    filled_slots = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())


class PositionSkill(Base):
    __tablename__ = "PositionSkill"

    intern_position_id = Column(
        Integer, ForeignKey("InternPosition.intern_position_id", ondelete="RESTRICT", onupdate="CASCADE"),
        primary_key=True,
    )
    skill_id = Column(
        Integer, ForeignKey("Skill.skill_id", ondelete="RESTRICT", onupdate="CASCADE"),
        primary_key=True,
    )
    created_at = Column(DateTime, default=func.now())
