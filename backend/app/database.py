from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from .config import settings

import urllib.parse
password = urllib.parse.quote_plus(settings.DB_PASSWORD)

engine = create_engine(
    f"mysql+pymysql://{settings.DB_USER}:{password}@{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}",
    pool_pre_ping=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
