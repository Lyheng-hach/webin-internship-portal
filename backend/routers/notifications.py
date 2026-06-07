from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from core.deps import get_current_user
from database import get_db
from models.application import Application
from models.company import Company
from models.intern_position import InternPosition
from models.notification import Notification
from models.student import Student
from models.user import UserAccount
from schemas.notification import NotificationOut

router = APIRouter()


def _enrich(notifs: list, db: Session) -> List[dict]:
    if not notifs:
        return []

    # Batch-fetch related records
    student_ids = list({n.student_id for n in notifs})
    company_ids = list({n.company_id for n in notifs})
    app_ids     = list({n.application_id for n in notifs})

    students  = {s.student_id: s for s in db.query(Student).filter(Student.student_id.in_(student_ids)).all()}
    companies = {c.company_id: c for c in db.query(Company).filter(Company.company_id.in_(company_ids)).all()}
    apps      = {a.application_id: a for a in db.query(Application).filter(Application.application_id.in_(app_ids)).all()}

    pos_ids   = list({a.intern_position_id for a in apps.values() if a is not None})
    positions = {}
    if pos_ids:
        positions = {p.intern_position_id: p for p in db.query(InternPosition).filter(InternPosition.intern_position_id.in_(pos_ids)).all()}

    result = []
    for n in notifs:
        stu = students.get(n.student_id)
        co  = companies.get(n.company_id)
        app = apps.get(n.application_id)
        pos = positions.get(app.intern_position_id) if app else None
        result.append({
            "notification_id": n.notification_id,
            "application_id":  n.application_id,
            "student_id":      n.student_id,
            "company_id":      n.company_id,
            "type":            n.type,
            "message":         n.message,
            "is_read":         n.is_read,
            "created_at":      n.created_at,
            "student_name":    stu.name if stu else None,
            "company_name":    co.name  if co  else None,
            "position_title":  pos.title if pos else None,
        })
    return result


@router.get("/my", response_model=List[NotificationOut])
def my_notifications(
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(get_current_user),
):
    role = current_user.role
    # Notification types intended for each role
    STUDENT_TYPES = ["APPLICATION_ACCEPTED", "APPLICATION_REJECTED",
                     "APPLICATION_REVIEWED", "APPLICATION_WITHDRAW", "APPLICATION_DEADLINE"]
    COMPANY_TYPES = ["APPLICATION_SUBMITTED"]

    if role == "student":
        student = db.query(Student).filter(Student.user_id == current_user.user_id).first()
        if not student:
            return []
        notifs = (
            db.query(Notification)
            .filter(
                Notification.student_id == student.student_id,
                Notification.type.in_(STUDENT_TYPES),
            )
            .order_by(Notification.created_at.desc())
            .all()
        )
        return _enrich(notifs, db)

    elif role == "company":
        company = db.query(Company).filter(Company.user_id == current_user.user_id).first()
        if not company:
            return []
        notifs = (
            db.query(Notification)
            .filter(
                Notification.company_id == company.company_id,
                Notification.type.in_(COMPANY_TYPES),
            )
            .order_by(Notification.created_at.desc())
            .all()
        )
        return _enrich(notifs, db)

    return []


@router.patch("/{notification_id}/read")
def mark_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(get_current_user),
):
    notif = db.query(Notification).filter(
        Notification.notification_id == notification_id
    ).first()
    if notif:
        notif.is_read = True
        db.commit()
    return {"message": "Marked as read"}
