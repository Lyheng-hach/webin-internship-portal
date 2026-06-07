from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from core.deps import require_role
from database import get_db
from models.admin import Admin
from models.audit_log import AdminAuditLog
from models.company import Company
from models.user import UserAccount
from schemas.auth import UserOut

router = APIRouter()


def _get_admin(db: Session, user_id: int):
    return db.query(Admin).filter(Admin.user_id == user_id).first()


def _write_log(db: Session, admin_id: int, action: str, table: str, target_id: int,
               old_val=None, new_val=None):
    db.add(AdminAuditLog(
        admin_id=admin_id,
        action=action,
        target_table=table,
        target_id=target_id,
        old_value=old_val,
        new_value=new_val,
    ))
    db.commit()


@router.get("/users", response_model=List[UserOut])
def list_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    _: UserAccount = Depends(require_role("admin")),
):
    return db.query(UserAccount).offset(skip).limit(limit).all()


@router.patch("/companies/{company_id}/verify")
def verify_company(
    company_id: int,
    verified_status: str,
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(require_role("admin")),
):
    company = db.query(Company).filter(Company.company_id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    old_val = company.verified_status
    company.verified_status = verified_status
    db.commit()

    admin = _get_admin(db, current_user.user_id)
    if admin:
        _write_log(db, admin.admin_id, "UPDATE_VERIFY_STATUS", "Company",
                   company_id, old_val, verified_status)

    return {"message": f"Company {company_id} verification status updated to {verified_status}"}


@router.get("/audit-logs")
def get_audit_logs(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    _: UserAccount = Depends(require_role("admin")),
):
    return (
        db.query(AdminAuditLog)
        .order_by(AdminAuditLog.performed_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(require_role("admin")),
):
    if user_id == current_user.user_id:
        raise HTTPException(status_code=400, detail="Admins cannot delete their own account")

    user = db.query(UserAccount).filter(UserAccount.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    role = user.role
    db.delete(user)
    db.commit()

    admin = _get_admin(db, current_user.user_id)
    if admin:
        _write_log(db, admin.admin_id, "DELETE_USER", "UserAccount",
                   user_id, f"{role}:{user_id}", None)

    return {"message": f"User {user_id} removed"}
