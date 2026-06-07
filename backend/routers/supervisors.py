from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from core.deps import require_role
from database import get_db
from models.supervisor import Supervisor
from models.user import UserAccount
from schemas.supervisor import SupervisorCreate, SupervisorOut, SupervisorUpdate

router = APIRouter()


@router.post("/profile", response_model=SupervisorOut, status_code=201)
def create_profile(
    payload: SupervisorCreate,
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(require_role("supervisor")),
):
    existing = db.query(Supervisor).filter(Supervisor.user_id == current_user.user_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Profile already exists")

    supervisor = Supervisor(user_id=current_user.user_id, **payload.model_dump())
    db.add(supervisor)
    db.commit()
    db.refresh(supervisor)
    return supervisor


@router.get("/profile", response_model=SupervisorOut)
def get_my_profile(
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(require_role("supervisor")),
):
    supervisor = db.query(Supervisor).filter(Supervisor.user_id == current_user.user_id).first()
    if not supervisor:
        raise HTTPException(status_code=404, detail="Profile not found")
    return supervisor


@router.put("/profile", response_model=SupervisorOut)
def update_profile(
    payload: SupervisorUpdate,
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(require_role("supervisor")),
):
    supervisor = db.query(Supervisor).filter(Supervisor.user_id == current_user.user_id).first()
    if not supervisor:
        raise HTTPException(status_code=404, detail="Profile not found")

    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(supervisor, field, value)
    db.commit()
    db.refresh(supervisor)
    return supervisor


@router.get("/", response_model=List[SupervisorOut])
def list_supervisors(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    _: UserAccount = Depends(require_role("admin", "company", "student")),
):
    return db.query(Supervisor).offset(skip).limit(limit).all()


@router.get("/{supervisor_id}", response_model=SupervisorOut)
def get_supervisor(
    supervisor_id: int,
    db: Session = Depends(get_db),
    _: UserAccount = Depends(require_role("admin", "student")),
):
    supervisor = db.query(Supervisor).filter(Supervisor.supervisor_id == supervisor_id).first()
    if not supervisor:
        raise HTTPException(status_code=404, detail="Supervisor not found")
    return supervisor
