from sqlalchemy import Column, DateTime, Enum, ForeignKey, Integer, String, Text, func
from database import Base


class Company(Base):
    __tablename__ = "Company"

    company_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("UserAccount.user_id", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False)
    name = Column(String(100), unique=True, nullable=False)
    industry = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    address = Column(String(100), nullable=False)
    website = Column(String(250), nullable=True)
    description_company = Column(Text, nullable=True)
    status = Column(Enum("Active", "Inactive", "Suspended"), nullable=False, default="Active")
    verified_status = Column(Enum("Pending", "Verified", "Rejected"), nullable=False, default="Pending")
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
