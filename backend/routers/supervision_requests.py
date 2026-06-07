from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from core.deps import require_role
from database import get_db
from models.student import Student
from models.supervisor import Supervisor
from models.supervisor_notification import SupervisorNotification
from models.supervision_request import SupervisionRequest
from models.user import UserAccount
from schemas.supervision_request import (
    SupervisionRequestCreate,
    SupervisionRequestOut,
    SupervisionRequestRespond,
    SupervisorNotifOut,
)

# ── Two routers, mounted at different prefixes in main.py ──────────────────────
request_router = APIRouter()
notif_router   = APIRouter()


def _enrich_requests(reqs, db: Session) -> List[dict]:
    if not reqs:
        return []
    stu_ids = list({r.student_id    for r in reqs})
    sup_ids = list({r.supervisor_id for r in reqs})
    students    = {s.student_id:    s.name for s in db.query(Student).filter(Student.student_id.in_(stu_ids)).all()}
    supervisors = {s.supervisor_id: s.name for s in db.query(Supervisor).filter(Supervisor.supervisor_id.in_(sup_ids)).all()}
    result = []
    for r in reqs:
        d = SupervisionRequestOut.model_validate(r).model_dump()
        d["student_name"]    = students.get(r.student_id)
        d["supervisor_name"] = supervisors.get(r.supervisor_id)
        result.append(d)
    return result


# ── Student: send a supervision request ───────────────────────────────────────
@request_router.post("/", response_model=SupervisionRequestOut, status_code=201)
def create_request(
    payload: SupervisionRequestCreate,
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(require_role("student")),
):
    student = db.query(Student).filter(Student.user_id == current_user.user_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")

    supervisor = db.query(Supervisor).filter(Supervisor.supervisor_id == payload.supervisor_id).first()
    if not supervisor:
        raise HTTPException(status_code=404, detail="Supervisor not found")

    # Only one pending/approved request allowed at a time
    existing = db.query(SupervisionRequest).filter(
        SupervisionRequest.student_id == student.student_id,
        SupervisionRequest.status.in_(["Pending", "Approved"]),
    ).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail="You already have an active supervision request. Cancel it before sending a new one.",
        )

    req = SupervisionRequest(
        student_id=student.student_id,
        supervisor_id=payload.supervisor_id,
        message=payload.message,
    )
    db.add(req)
    db.commit()
    db.refresh(req)
    enriched = _enrich_requests([req], db)
    return enriched[0]


# ── Student: view own requests ─────────────────────────────────────────────────
@request_router.get("/my", response_model=List[SupervisionRequestOut])
def my_requests(
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(require_role("student")),
):
    student = db.query(Student).filter(Student.user_id == current_user.user_id).first()
    if not student:
        return []
    reqs = (
        db.query(SupervisionRequest)
        .filter(SupervisionRequest.student_id == student.student_id)
        .order_by(SupervisionRequest.created_at.desc())
        .all()
    )
    return _enrich_requests(reqs, db)


# ── Student: cancel a pending request ─────────────────────────────────────────
@request_router.delete("/{request_id}", status_code=204)
def cancel_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(require_role("student")),
):
    student = db.query(Student).filter(Student.user_id == current_user.user_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")
    req = db.query(SupervisionRequest).filter(
        SupervisionRequest.request_id == request_id,
        SupervisionRequest.student_id == student.student_id,
    ).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    if req.status == "Approved":
        raise HTTPException(status_code=400, detail="Cannot cancel an already-approved request")
    db.delete(req)
    db.commit()
    return None


# ── Supervisor: view incoming requests ────────────────────────────────────────
@request_router.get("/incoming", response_model=List[SupervisionRequestOut])
def incoming_requests(
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(require_role("supervisor")),
):
    supervisor = db.query(Supervisor).filter(Supervisor.user_id == current_user.user_id).first()
    if not supervisor:
        return []
    reqs = (
        db.query(SupervisionRequest)
        .filter(SupervisionRequest.supervisor_id == supervisor.supervisor_id)
        .order_by(SupervisionRequest.created_at.desc())
        .all()
    )
    return _enrich_requests(reqs, db)


# ── Supervisor: approve or reject ─────────────────────────────────────────────
@request_router.patch("/{request_id}/respond", response_model=SupervisionRequestOut)
def respond_to_request(
    request_id: int,
    payload: SupervisionRequestRespond,
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(require_role("supervisor")),
):
    supervisor = db.query(Supervisor).filter(Supervisor.user_id == current_user.user_id).first()
    if not supervisor:
        raise HTTPException(status_code=404, detail="Supervisor profile not found")

    req = db.query(SupervisionRequest).filter(
        SupervisionRequest.request_id == request_id,
        SupervisionRequest.supervisor_id == supervisor.supervisor_id,
    ).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    if req.status != "Pending":
        raise HTTPException(status_code=400, detail="Request has already been responded to")

    req.status = payload.status
    db.commit()
    db.refresh(req)
    enriched = _enrich_requests([req], db)
    return enriched[0]


# ── Supervisor notifications ───────────────────────────────────────────────────
@notif_router.get("/my", response_model=List[SupervisorNotifOut])
def my_supervisor_notifications(
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(require_role("supervisor")),
):
    supervisor = db.query(Supervisor).filter(Supervisor.user_id == current_user.user_id).first()
    if not supervisor:
        return []
    return (
        db.query(SupervisorNotification)
        .filter(SupervisorNotification.supervisor_id == supervisor.supervisor_id)
        .order_by(SupervisorNotification.created_at.desc())
        .all()
    )


@notif_router.patch("/{notif_id}/read", response_model=SupervisorNotifOut)
def mark_supervisor_notif_read(
    notif_id: int,
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(require_role("supervisor")),
):
    supervisor = db.query(Supervisor).filter(Supervisor.user_id == current_user.user_id).first()
    notif = db.query(SupervisorNotification).filter(
        SupervisorNotification.id == notif_id,
        SupervisorNotification.supervisor_id == (supervisor.supervisor_id if supervisor else -1),
    ).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    notif.is_read = True
    db.commit()
    db.refresh(notif)
    return notif
