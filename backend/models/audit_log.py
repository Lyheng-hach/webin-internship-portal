from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text, func
from database import Base


class AdminAuditLog(Base):
    __tablename__ = "AdminAuditLog"

    log_id = Column(Integer, primary_key=True, autoincrement=True)
    admin_id = Column(Integer, ForeignKey("Admin.admin_id", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False)
    action = Column(String(100), nullable=False)
    target_table = Column(String(100), nullable=False)
    target_id = Column(Integer, nullable=True)
    old_value = Column(Text, nullable=True)
    new_value = Column(Text, nullable=True)
    performed_at = Column(DateTime, default=func.now())
