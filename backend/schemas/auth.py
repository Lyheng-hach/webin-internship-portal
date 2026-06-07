from datetime import datetime
from pydantic import BaseModel, EmailStr
from typing import Literal


class RegisterRequest(BaseModel):
    user_email: EmailStr # The user's email address, validated as a proper email format.
    user_password: str # The user's password, stored as a string. In a real application, this should be hashed before storage.
    role: Literal["student", "supervisor", "company", "admin"] # The user's role, which must be one of the specified literals. This helps in role-based access control.


class LoginRequest(BaseModel):
    user_email: EmailStr
    user_password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user_id: int


class UserOut(BaseModel):
    """Safe user representation — never exposes the password hash."""
    user_id: int
    user_email: EmailStr
    role: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
