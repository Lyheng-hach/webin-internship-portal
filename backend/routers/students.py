from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from core.deps import get_current_user, require_role
from database import get_db
from models.student import Student
from models.user import UserAccount
from schemas.student import StudentCreate, StudentOut, StudentUpdate

router = APIRouter()


@router.post("/profile", response_model=StudentOut, status_code=201)
def create_profile(
    payload: StudentCreate,
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(require_role("student")),
):
    existing = db.query(Student).filter(Student.user_id == current_user.user_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Profile already exists")

    student = Student(user_id=current_user.user_id, **payload.model_dump())
    db.add(student)
    db.commit()
    db.refresh(student)
    return student


@router.get("/profile", response_model=StudentOut)
def get_my_profile(
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(require_role("student")),
):
    student = db.query(Student).filter(Student.user_id == current_user.user_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Profile not found")
    return student


@router.put("/profile", response_model=StudentOut)
def update_profile(
    payload: StudentUpdate,
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(require_role("student")),
):
    student = db.query(Student).filter(Student.user_id == current_user.user_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Profile not found")

    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(student, field, value)
    db.commit()
    db.refresh(student)
    return student


@router.get("/", response_model=List[StudentOut])
def list_students(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    _: UserAccount = Depends(require_role("admin", "supervisor")),
):
    return db.query(Student).offset(skip).limit(limit).all()


@router.get("/{student_id}", response_model=StudentOut)
def get_student(
    student_id: int,
    db: Session = Depends(get_db),
    _: UserAccount = Depends(require_role("admin", "supervisor", "company")),
):
    student = db.query(Student).filter(Student.student_id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student
