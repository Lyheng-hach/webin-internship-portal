from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from core.deps import require_role
from database import get_db
from models.company import Company
from models.user import UserAccount
from schemas.company import CompanyCreate, CompanyOut, CompanyUpdate

router = APIRouter()


@router.post("/profile", response_model=CompanyOut, status_code=201)
def create_company(
    payload: CompanyCreate,
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(require_role("company")),
):
    existing = db.query(Company).filter(Company.user_id == current_user.user_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Company profile already exists")

    company = Company(user_id=current_user.user_id, **payload.model_dump())
    db.add(company)
    db.commit()
    db.refresh(company)
    return company


@router.get("/profile", response_model=CompanyOut)
def get_my_company(
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(require_role("company")),
):
    company = db.query(Company).filter(Company.user_id == current_user.user_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company profile not found")
    return company


@router.put("/profile", response_model=CompanyOut)
def update_company(
    payload: CompanyUpdate,
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(require_role("company")),
):
    company = db.query(Company).filter(Company.user_id == current_user.user_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company profile not found")

    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(company, field, value)
    db.commit()
    db.refresh(company)
    return company


@router.get("/", response_model=List[CompanyOut])
def list_companies(
    db: Session = Depends(get_db),
    _: UserAccount = Depends(require_role("admin", "student")),
):
    return db.query(Company).filter(Company.status == "Active").all()


@router.get("/{company_id}", response_model=CompanyOut)
def get_company(company_id: int, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.company_id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company
