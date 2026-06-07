from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from core.deps import require_role
from database import get_db
from models.company import Company
from models.intern_info import InternInfo
from models.intern_position import InternPosition
from models.student import Student
from models.supervisor import Supervisor
from models.supervisor_notification import SupervisorNotification
from models.user import UserAccount
from schemas.intern import InternCreate, InternOut, InternRichOut, InternStatusUpdate

router = APIRouter()


def _enrich(interns: list, db: Session) -> List[dict]:
    if not interns:
        return []

    student_ids  = list({i.student_id          for i in interns})
    pos_ids      = list({i.intern_position_id   for i in interns})
    sup_ids      = list({i.supervisor_id        for i in interns if i.supervisor_id})

    students    = {s.student_id:  s.name  for s in db.query(Student).filter(Student.student_id.in_(student_ids)).all()}
    positions   = {p.intern_position_id: p.title for p in db.query(InternPosition).filter(InternPosition.intern_position_id.in_(pos_ids)).all()}
    supervisors = {s.supervisor_id: s.name for s in db.query(Supervisor).filter(Supervisor.supervisor_id.in_(sup_ids)).all()} if sup_ids else {}

    result = []
    for i in interns:
        base = InternOut.model_validate(i).model_dump()
        base["student_name"]   = students.get(i.student_id)
        base["position_title"] = positions.get(i.intern_position_id)
        base["supervisor_name"] = supervisors.get(i.supervisor_id) if i.supervisor_id else None
        result.append(base)
    return result


@router.post("/", response_model=InternRichOut, status_code=201)
def start_internship(
    payload: InternCreate,
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(require_role("company")),
):
    company = db.query(Company).filter(Company.user_id == current_user.user_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company profile not found")

    # Prevent duplicate
    existing = db.query(InternInfo).filter(
        InternInfo.student_id == payload.student_id,
        InternInfo.intern_position_id == payload.intern_position_id,
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Intern record already exists for this student and position")

    intern = InternInfo(
        company_id=company.company_id,
        **payload.model_dump(),
    )
    db.add(intern)
    db.commit()
    db.refresh(intern)
    enriched = _enrich([intern], db)
    result = enriched[0]

    # Notify supervisor if one was assigned at creation
    if intern.supervisor_id:
        student_obj = db.query(Student).filter(Student.student_id == intern.student_id).first()
        company_obj = db.query(Company).filter(Company.company_id == intern.company_id).first()
        notif = SupervisorNotification(
            supervisor_id=intern.supervisor_id,
            title="New Intern Assigned",
            message=(
                f"{student_obj.name if student_obj else f'Student #{intern.student_id}'} "
                f"has started their internship at "
                f"{company_obj.name if company_obj else f'Company #{intern.company_id}'}. "
                f"Department: {intern.department}."
            ),
        )
        db.add(notif)
        db.commit()

    return result


@router.get("/my", response_model=List[InternRichOut])
def my_interns(
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(require_role("company")),
):
    company = db.query(Company).filter(Company.user_id == current_user.user_id).first()
    if not company:
        return []
    interns = db.query(InternInfo).filter(InternInfo.company_id == company.company_id).all()
    return _enrich(interns, db)


@router.get("/student-history", response_model=List[InternRichOut])
def student_intern_history(
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(require_role("student")),
):
    """Return all InternInfo records for the logged-in student."""
    student = db.query(Student).filter(Student.user_id == current_user.user_id).first()
    if not student:
        return []
    interns = db.query(InternInfo).filter(InternInfo.student_id == student.student_id).all()
    return _enrich(interns, db)


@router.get("/available", response_model=List[InternRichOut])
def available_interns(
    db: Session = Depends(get_db),
    _: UserAccount = Depends(require_role("supervisor")),
):
    """Return all InternInfo records that have no supervisor assigned yet."""
    interns = db.query(InternInfo).filter(InternInfo.supervisor_id == None).all()
    return _enrich(interns, db)


@router.get("/supervised", response_model=List[InternRichOut])
def my_supervised_interns(
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(require_role("supervisor")),
):
    """Return all InternInfo records supervised by the current supervisor."""
    supervisor = db.query(Supervisor).filter(Supervisor.user_id == current_user.user_id).first()
    if not supervisor:
        return []
    interns = db.query(InternInfo).filter(InternInfo.supervisor_id == supervisor.supervisor_id).all()
    return _enrich(interns, db)


@router.patch("/{intern_id}/claim", response_model=InternRichOut)
def claim_student(
    intern_id: int,
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(require_role("supervisor")),
):
    """Supervisor picks a student — assigns themselves as supervisor."""
    supervisor = db.query(Supervisor).filter(Supervisor.user_id == current_user.user_id).first()
    if not supervisor:
        raise HTTPException(status_code=404, detail="Supervisor profile not found")

    intern = db.query(InternInfo).filter(InternInfo.intern_id == intern_id).first()
    if not intern:
        raise HTTPException(status_code=404, detail="Intern record not found")
    if intern.supervisor_id is not None:
        raise HTTPException(status_code=400, detail="This intern already has a supervisor")

    intern.supervisor_id = supervisor.supervisor_id
    db.commit()
    db.refresh(intern)
    enriched = _enrich([intern], db)
    return enriched[0]


@router.patch("/{intern_id}/status", response_model=InternOut)
def update_intern_status(
    intern_id: int,
    payload: InternStatusUpdate,
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(require_role("company", "supervisor")),
):
    intern = db.query(InternInfo).filter(InternInfo.intern_id == intern_id).first()
    if not intern:
        raise HTTPException(status_code=404, detail="Intern record not found")
    intern.status = payload.status
    db.commit()
    db.refresh(intern)
    return intern
