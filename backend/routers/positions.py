from datetime import date
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from core.deps import require_role
from database import get_db
from models.company import Company
from models.intern_position import InternPosition, PositionSkill
from models.skill import Skill
from models.user import UserAccount
from schemas.position import PositionCreate, PositionRichOut, PositionOut, PositionUpdate

router = APIRouter()


def _enrich(positions: list, db: Session) -> List[dict]:
    """Attach company_name and skills list to a batch of InternPosition rows."""
    if not positions:
        return []

    company_ids = list({p.company_id for p in positions})
    companies = {
        c.company_id: c.name
        for c in db.query(Company).filter(Company.company_id.in_(company_ids)).all()
    }

    pos_ids = [p.intern_position_id for p in positions]
    # Fetch skill names via join
    skill_rows = (
        db.query(PositionSkill.intern_position_id, Skill.name)
        .join(Skill, PositionSkill.skill_id == Skill.skill_id)
        .filter(PositionSkill.intern_position_id.in_(pos_ids))
        .all()
    )
    skills_map: dict[int, list] = {}
    for pid, sname in skill_rows:
        skills_map.setdefault(pid, []).append(sname)

    result = []
    for p in positions:
        base = PositionOut.model_validate(p).model_dump()
        base["company_name"] = companies.get(p.company_id)
        base["skills"] = skills_map.get(p.intern_position_id, [])
        result.append(base)
    return result


@router.post("/", response_model=PositionOut, status_code=201)
def create_position(
    payload: PositionCreate,
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(require_role("company")),
):
    company = db.query(Company).filter(Company.user_id == current_user.user_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company profile not found")

    skill_ids = payload.skill_ids
    data = payload.model_dump(exclude={"skill_ids"})
    position = InternPosition(company_id=company.company_id, posted_date=date.today(), **data)
    db.add(position)
    db.flush()

    for sid in skill_ids:
        db.add(PositionSkill(intern_position_id=position.intern_position_id, skill_id=sid))

    db.commit()
    db.refresh(position)
    return position


@router.get("/", response_model=List[PositionRichOut])
def list_positions(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
):
    positions = (
        db.query(InternPosition)
        .filter(InternPosition.status == "Active")
        .order_by(InternPosition.posted_date.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return _enrich(positions, db)


@router.get("/my", response_model=List[PositionRichOut])
def my_positions(
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(require_role("company")),
):
    company = db.query(Company).filter(Company.user_id == current_user.user_id).first()
    if not company:
        return []
    positions = db.query(InternPosition).filter(InternPosition.company_id == company.company_id).all()
    return _enrich(positions, db)


@router.get("/{position_id}", response_model=PositionRichOut)
def get_position(position_id: int, db: Session = Depends(get_db)):
    pos = db.query(InternPosition).filter(InternPosition.intern_position_id == position_id).first()
    if not pos:
        raise HTTPException(status_code=404, detail="Position not found")
    enriched = _enrich([pos], db)
    return enriched[0]


@router.put("/{position_id}", response_model=PositionOut)
def update_position(
    position_id: int,
    payload: PositionUpdate,
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(require_role("company")),
):
    company = db.query(Company).filter(Company.user_id == current_user.user_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company profile not found")
    pos = db.query(InternPosition).filter(
        InternPosition.intern_position_id == position_id,
        InternPosition.company_id == company.company_id,
    ).first()
    if not pos:
        raise HTTPException(status_code=404, detail="Position not found")

    update_data = payload.model_dump(exclude_none=True)
    skill_ids = update_data.pop("skill_ids", None)

    for field, value in update_data.items():
        setattr(pos, field, value)

    # Replace skills if provided
    if skill_ids is not None:
        db.query(PositionSkill).filter(
            PositionSkill.intern_position_id == position_id
        ).delete()
        for sid in skill_ids:
            db.add(PositionSkill(intern_position_id=position_id, skill_id=sid))

    db.commit()
    db.refresh(pos)
    return pos
