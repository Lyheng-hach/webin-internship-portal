from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel

from database import get_db
from models.skill import Skill

router = APIRouter()


class SkillOut(BaseModel):
    skill_id: int
    name: str
    category: str

    class Config:
        from_attributes = True


@router.get("/", response_model=List[SkillOut])
def list_skills(db: Session = Depends(get_db)):
    """Public endpoint — no auth required. Returns all skills grouped by name."""
    return db.query(Skill).order_by(Skill.category, Skill.name).all()
