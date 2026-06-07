from sqlalchemy import Column, DateTime, Enum, ForeignKey, Integer, String, func
from database import Base


class Admin(Base):
    __tablename__ = "Admin"

    admin_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("UserAccount.user_id", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False)
    name = Column(String(50), nullable=False)
    phone = Column(String(20), nullable=False)
    status = Column(Enum("Active", "Inactive", "Suspended"), nullable=False, default="Active")
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
