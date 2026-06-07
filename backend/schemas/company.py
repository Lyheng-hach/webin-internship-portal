from datetime import datetime
from typing import Literal, Optional
from pydantic import BaseModel


class CompanyCreate(BaseModel):
    name: str
    industry: str
    phone: str
    address: str
    website: Optional[str] = None
    description_company: Optional[str] = None


class CompanyUpdate(BaseModel):
    industry: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    website: Optional[str] = None
    description_company: Optional[str] = None


class CompanyOut(CompanyCreate):
    company_id: int
    user_id: int
    status: str
    verified_status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
