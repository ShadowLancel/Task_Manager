from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import ActivityLog, Task, User
from app.schemas import ActivityLogResponse

router = APIRouter(tags=["ActivityLog"])

@router.get("/", response_model=list[ActivityLogResponse])
def read_activity_logs(db: Session = Depends(get_db)):
    logs = db.query(ActivityLog).all()
    for log in logs:
        task = db.query(Task).filter(Task.id == log.task_id).first()
        user = db.query(User).filter(User.id == log.user_id).first()
        log.task_title = task.title if task else "Task not found"
        log.user_name = user.username if user else "User not found"
    return logs