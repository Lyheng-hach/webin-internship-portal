from datetime import date
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from core.deps import require_role
from database import get_db
from models.application import Application
from models.application_document import ApplicationDocument
from models.company import Company
from models.document import Document
from models.intern_position import InternPosition
from models.notification import Notification
from models.student import Student
from models.user import UserAccount
from schemas.application import ApplicationCreate, ApplicationOut, ApplicationRichOut, ApplicationStatusUpdate

router = APIRouter()


def _notify(db: Session, application_id: int, student_id: int, company_id: int,
            notif_type: str, message: str):
    """Insert a Notification row — silently skips if anything is missing."""
    try:
        db.add(Notification(
            application_id=application_id,
            student_id=student_id,
            company_id=company_id,
            type=notif_type,
            message=message,
            is_read=False,
        ))
        db.commit()
    except Exception:
        db.rollback()


def _enrich_student_apps(apps: list, db: Session) -> List[dict]:
    """Attach position title, company name, and salary to a student's applications."""
    if not apps:
        return []

    pos_ids = list({a.intern_position_id for a in apps})
    positions = {
        p.intern_position_id: p
        for p in db.query(InternPosition).filter(InternPosition.intern_position_id.in_(pos_ids)).all()
    }

    company_ids = list({p.company_id for p in positions.values()})
    companies = {
        c.company_id: c
        for c in db.query(Company).filter(Company.company_id.in_(company_ids)).all()
    }

    result = []
    for a in apps:
        base = ApplicationOut.model_validate(a).model_dump()
        pos = positions.get(a.intern_position_id)
        if pos:
            co = companies.get(pos.company_id)
            base["position_title"] = pos.title
            base["company_name"]   = co.name if co else None
            base["company_id"]     = pos.company_id
            base["location"]       = pos.location
            base["position_type"]  = pos.position_type
            base["salary_min"]     = float(pos.salary_min) if pos.salary_min else None
            base["salary_max"]     = float(pos.salary_max) if pos.salary_max else None
        base["documents"] = []
        result.append(base)
    return result


def _enrich_company_apps(apps: list, db: Session) -> List[dict]:
    """Attach student name, university_id, position info, and all submitted documents."""
    if not apps:
        return []

    student_ids = list({a.student_id for a in apps})
    students = {
        s.student_id: s
        for s in db.query(Student).filter(Student.student_id.in_(student_ids)).all()
    }

    pos_ids = list({a.intern_position_id for a in apps})
    positions = {
        p.intern_position_id: p
        for p in db.query(InternPosition).filter(InternPosition.intern_position_id.in_(pos_ids)).all()
    }

    # Fetch all ApplicationDocument rows + their Document info in one query
    app_ids = [a.application_id for a in apps]
    app_doc_rows = (
        db.query(ApplicationDocument, Document)
        .join(Document, ApplicationDocument.document_id == Document.document_id)
        .filter(ApplicationDocument.application_id.in_(app_ids))
        .all()
    )
    docs_by_app: dict[int, list] = {}
    for ad, doc in app_doc_rows:
        docs_by_app.setdefault(ad.application_id, []).append({
            "doc_id":   doc.document_id,
            "doc_type": doc.document_type,
            "doc_name": doc.file_name,
            "doc_url":  doc.file_url,
        })

    result = []
    for a in apps:
        base = ApplicationOut.model_validate(a).model_dump()
        stu = students.get(a.student_id)
        pos = positions.get(a.intern_position_id)
        if stu:
            base["student_name"]  = stu.name
            base["university_id"] = stu.university_id
        if pos:
            base["position_title"] = pos.title
            base["location"]       = pos.location
            base["position_type"]  = pos.position_type
            base["salary_min"]     = float(pos.salary_min) if pos.salary_min else None
            base["salary_max"]     = float(pos.salary_max) if pos.salary_max else None
        base["documents"] = docs_by_app.get(a.application_id, [])
        result.append(base)
    return result


@router.post("/", response_model=ApplicationOut, status_code=201)
def apply(
    payload: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(require_role("student")),
):
    student = db.query(Student).filter(Student.user_id == current_user.user_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")

    existing = db.query(Application).filter(
        Application.student_id == student.student_id,
        Application.intern_position_id == payload.intern_position_id,
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already applied to this position")

    app = Application(
        student_id=student.student_id,
        intern_position_id=payload.intern_position_id,
        cover_letter=payload.cover_letter,
        apply_date=date.today(),
    )
    db.add(app)
    db.flush()  # get app.application_id before commit

    # Save each selected document to junction table
    for doc_id in (payload.document_ids or []):
        db.add(ApplicationDocument(
            application_id=app.application_id,
            document_id=doc_id,
        ))

    db.commit()
    db.refresh(app)

    # Notify the company that a new application was submitted
    pos = db.query(InternPosition).filter(InternPosition.intern_position_id == payload.intern_position_id).first()
    if pos:
        _notify(db, app.application_id, student.student_id, pos.company_id,
                "APPLICATION SUBMITTED",
                f"New application received for '{pos.title}' from student #{student.student_id}.")

    return app


@router.get("/my", response_model=List[ApplicationRichOut])
def my_applications(
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(require_role("student")),
):
    student = db.query(Student).filter(Student.user_id == current_user.user_id).first()
    if not student:
        return []
    apps = db.query(Application).filter(Application.student_id == student.student_id).all()
    return _enrich_student_apps(apps, db)


@router.get("/company", response_model=List[ApplicationRichOut])
def company_applications(
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(require_role("company")),
):
    company = db.query(Company).filter(Company.user_id == current_user.user_id).first()
    if not company:
        return []
    apps = (
        db.query(Application)
        .join(InternPosition, Application.intern_position_id == InternPosition.intern_position_id)
        .filter(InternPosition.company_id == company.company_id)
        .all()
    )
    return _enrich_company_apps(apps, db)


@router.patch("/{application_id}/status", response_model=ApplicationOut)
def update_status(
    application_id: int,
    payload: ApplicationStatusUpdate,
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(require_role("company")),
):
    app = db.query(Application).filter(Application.application_id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    old_status = app.status
    app.status = payload.status
    if payload.remarks:
        app.remarks = payload.remarks
    db.commit()
    db.refresh(app)

    # Notify the student when the company changes their application status
    if old_status != payload.status:
        company = db.query(Company).filter(Company.user_id == current_user.user_id).first()
        pos = db.query(InternPosition).filter(
            InternPosition.intern_position_id == app.intern_position_id
        ).first()
        pos_title = pos.title if pos else f"Position #{app.intern_position_id}"
        company_name = company.name if company else "The company"
        company_id = company.company_id if company else 0

        type_map = {
            "Accepted":  ("APPLICATION_ACCEPTED",  f"Congratulations! Your application for '{pos_title}' has been accepted by {company_name}."),
            "Rejected":  ("APPLICATION_REJECTED",  f"Your application for '{pos_title}' was not successful this time. Keep applying!"),
            "Reviewed":  ("APPLICATION_REVIEWED",  f"{company_name} has reviewed your application for '{pos_title}'."),
            "Withdraw":  ("APPLICATION_WITHDRAW",  f"Your application for '{pos_title}' has been withdrawn."),
        }
        if payload.status in type_map:
            notif_type, message = type_map[payload.status]
            _notify(db, app.application_id, app.student_id, company_id, notif_type, message)

    return app
