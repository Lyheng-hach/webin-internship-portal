from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from core.config import settings

DATABASE_URL = (
    f"mysql+pymysql://{settings.DB_USER}:{settings.DB_PASSWORD}"
    f"@{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}"
)

engine = create_engine(
    DATABASE_URL,
    echo=False,
    pool_pre_ping=True,      # drops stale connections before using them
    pool_recycle=3600,       # recycle connections every 1 hour (avoids MySQL gone-away)
    pool_size=10,            # number of persistent connections
    max_overflow=20,         # extra connections allowed under load
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
