from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
from database import Base


class ApplicationDocument(Base):
    __tablename__ = "ApplicationDocument"

    id             = Column(Integer, primary_key=True, autoincrement=True)
    application_id = Column(Integer, ForeignKey("Application.application_id", ondelete="CASCADE"), nullable=False)
    document_id    = Column(Integer, ForeignKey("Document.document_id",    ondelete="CASCADE"), nullable=False)

    __table_args__ = (
        UniqueConstraint("application_id", "document_id", name="uq_appdoc"),
    )
