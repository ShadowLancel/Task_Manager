from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import ActivityLog
from app.schemas import ActivityLogResponse

router = APIRouter(tags=["ActivityLog"])

@router.get("/", response_model=list[ActivityLogResponse])
def read_activity_logs(db: Session = Depends(get_db)):
    logs = db.query(ActivityLog).all()
    return logs