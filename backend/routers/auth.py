from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.deps import get_current_user
from core.security import hash_password, verify_password, create_access_token
from database import get_db
from models.user import UserAccount
from schemas.auth import LoginRequest, RegisterRequest, TokenResponse, UserOut

router = APIRouter()



@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(UserAccount).filter(UserAccount.user_email == payload.user_email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = UserAccount(
        user_email=payload.user_email,
        user_password=hash_password(payload.user_password),
        role=payload.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.user_id), "role": user.role})
    return TokenResponse(access_token=token, role=user.role, user_id=user.user_id)


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(UserAccount).filter(UserAccount.user_email == payload.user_email).first()
    if not user or not verify_password(payload.user_password, user.user_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": str(user.user_id), "role": user.role})
    return TokenResponse(access_token=token, role=user.role, user_id=user.user_id)


@router.get("/me", response_model=UserOut)
def me(current_user: UserAccount = Depends(get_current_user)):
    return current_user
