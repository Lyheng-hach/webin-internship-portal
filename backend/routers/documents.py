from datetime import date
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from core.deps import require_role
from database import get_db
from models.document import Document
from models.student import Student
from models.user import UserAccount
from schemas.document import DocumentCreate, DocumentOut, DocumentUpdate

router = APIRouter()


def _get_student(db: Session, user: UserAccount) -> Student:
    student = db.query(Student).filter(Student.user_id == user.user_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")
    return student


@router.get("/my", response_model=List[DocumentOut])
def my_documents(
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(require_role("student")),
):
    student = db.query(Student).filter(Student.user_id == current_user.user_id).first()
    if not student:
        return []
    return (
        db.query(Document)
        .filter(Document.student_id == student.student_id)
        .order_by(Document.created_at.desc())
        .all()
    )


@router.post("/", response_model=DocumentOut, status_code=201)
def add_document(
    payload: DocumentCreate,
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(require_role("student")),
):
    student = _get_student(db, current_user)

    # One document per type per student
    existing = db.query(Document).filter(
        Document.student_id == student.student_id,
        Document.document_type == payload.document_type,
    ).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail=f"You already have a '{payload.document_type}' document. Update or delete it first.",
        )

    doc = Document(
        student_id=student.student_id,
        document_type=payload.document_type,
        file_name=payload.file_name,
        file_url=payload.file_url,
        upload_date=date.today(),
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc


@router.put("/{document_id}", response_model=DocumentOut)
def update_document(
    document_id: int,
    payload: DocumentUpdate,
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(require_role("student")),
):
    # student = _get_student(db, current_user)
    doc = db.query(Document).filter(
        Document.document_id == document_id,
        Document.student_id == student.student_id,
    ).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    if payload.file_name: doc.file_name = payload.file_name
    if payload.file_url:  doc.file_url  = payload.file_url
    doc.upload_date = date.today()
    db.commit()
    db.refresh(doc)
    return doc


@router.delete("/{document_id}", status_code=204)
def delete_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(require_role("student")),
):
    student = _get_student(db, current_user)
    doc = db.query(Document).filter(
        Document.document_id == document_id,
        Document.student_id == student.student_id,
    ).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    db.delete(doc)
    db.commit()
    return None
