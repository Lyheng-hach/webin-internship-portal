from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text, func
from database import Base


class SupervisorNotification(Base):
    __tablename__ = "SupervisorNotification"

    id            = Column(Integer, primary_key=True, autoincrement=True)
    supervisor_id = Column(Integer, ForeignKey("Supervisor.supervisor_id", ondelete="CASCADE"), nullable=False)
    title         = Column(String(200), nullable=False)
    message       = Column(Text, nullable=False)
    is_read       = Column(Boolean, nullable=False, default=False)
    created_at    = Column(DateTime, default=func.now())
