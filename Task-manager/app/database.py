from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from app.config import DATABASE_URL

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ��������� ������� get_db ��� dependency injection
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()