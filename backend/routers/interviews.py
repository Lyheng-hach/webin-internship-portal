from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from core.deps import require_role
from database import get_db
from models.company import Company
from models.interview import Interview
from models.student import Student
from models.user import UserAccount
from schemas.interview import InterviewCreate, InterviewOut, InterviewStatusUpdate

router = APIRouter()


@router.post("/", response_model=InterviewOut, status_code=201)
def schedule_interview(
    payload: InterviewCreate,
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(require_role("company")),
):
    company = db.query(Company).filter(Company.user_id == current_user.user_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company profile not found")

    interview = Interview(
        application_id=payload.application_id,
        company_id=company.company_id,
        student_id=payload.student_id,
        scheduled_at=payload.scheduled_at,
        location=payload.location,
        interview_type=payload.interview_type,
    )
    db.add(interview)
    db.commit()
    db.refresh(interview)
    return interview


@router.get("/my", response_model=List[InterviewOut])
def my_interviews(
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(require_role("student", "company")),
):
    if current_user.role == "student":
        student = db.query(Student).filter(Student.user_id == current_user.user_id).first()
        if not student:
            return []
        return db.query(Interview).filter(Interview.student_id == student.student_id).all()
    else:
        company = db.query(Company).filter(Company.user_id == current_user.user_id).first()
        if not company:
            return []
        return db.query(Interview).filter(Interview.company_id == company.company_id).all()


@router.patch("/{interview_id}/status", response_model=InterviewOut)
def update_interview_status(
    interview_id: int,
    payload: InterviewStatusUpdate,
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(require_role("company")),
):
    company = db.query(Company).filter(Company.user_id == current_user.user_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company profile not found")
    interview = db.query(Interview).filter(
        Interview.interview_id == interview_id,
        Interview.company_id == company.company_id,
    ).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")

    interview.status = payload.status
    db.commit()
    db.refresh(interview)
    return interview
