from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from core.deps import require_role
from database import get_db
from models.evaluation import Evaluation
from models.supervisor import Supervisor
from models.user import UserAccount
from schemas.evaluation import EvaluationCreate, EvaluationOut

router = APIRouter()


@router.post("/", response_model=EvaluationOut, status_code=201)
def submit_evaluation(
    payload: EvaluationCreate,
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(require_role("supervisor")),
):
    supervisor = db.query(Supervisor).filter(Supervisor.user_id == current_user.user_id).first()
    if not supervisor:
        raise HTTPException(status_code=404, detail="Supervisor profile not found")

    evaluation = Evaluation(
        supervisor_id=supervisor.supervisor_id,
        status="Submitted",
        submitted_at=datetime.utcnow(),
        **payload.model_dump(),
    )
    db.add(evaluation)
    db.commit()
    db.refresh(evaluation)
    return evaluation


@router.get("/intern/{intern_id}", response_model=List[EvaluationOut])
def get_evaluations_for_intern(
    intern_id: int,
    db: Session = Depends(get_db),
    _: UserAccount = Depends(require_role("supervisor", "student", "admin")),
):
    return db.query(Evaluation).filter(Evaluation.intern_id == intern_id).all()
