from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel

from database import get_db
from models.university import University

router = APIRouter()


class UniversityOut(BaseModel):
    university_id: int
    name: str
    address: str

    class Config:
        from_attributes = True


@router.get("/", response_model=List[UniversityOut])
def list_universities(db: Session = Depends(get_db)):
    """Public endpoint — no auth required. Used by registration forms."""
    return db.query(University).order_by(University.name).all()
