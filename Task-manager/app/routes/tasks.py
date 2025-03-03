from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Task, Project, Tag, ActivityLog, User
from app.schemas import TaskCreate, TaskResponse
from app.services.auth import get_current_user
import logging
from datetime import datetime

router = APIRouter(tags=["Tasks"])
logger = logging.getLogger(__name__)

def log_task_activity(
    db: Session,
    user_id: int,
    task_id: int,
    action: str
):
    #¬спомогательна€ функци€ дл€ записи лога действий в activity_log
    entry = ActivityLog(
        task_id=task_id,
        user_id=user_id,
        action=action,
        timestamp=datetime.utcnow()
    )
    db.add(entry)
    db.commit()

@router.post("/", response_model=TaskResponse)
def create_task(
    task_data: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    logger.debug(f"Received task data: {task_data}")
    if task_data.project_id is not None:
        project = db.query(Project).filter(Project.id == task_data.project_id).first()
        if not project:
            raise HTTPException(status_code=400, detail="Project with given id does not exist")

    if task_data.tag_ids:
        tags = db.query(Tag).filter(Tag.id.in_(task_data.tag_ids)).all()
        if len(tags) != len(task_data.tag_ids):
            raise HTTPException(status_code=400, detail="Some of the provided tag IDs do not exist")
    else:
        tags = []

    try:
        db_task = Task(
            title=task_data.title,
            description=task_data.description,
            project_id=task_data.project_id,
            owner_id=current_user.id
        )
        # ѕрисваиваем теги до сохранени€ задачи
        if tags:
            db_task.tags = tags
        db.add(db_task)
        db.commit()
        db.refresh(db_task)
        db_task = db.query(Task).filter(Task.id == db_task.id).first()

        log_task_activity(db, current_user.id, db_task.id, "create")
        return db_task
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating task: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error creating task: {str(e)}")

@router.get("/", response_model=List[TaskResponse])
def get_tasks(db: Session = Depends(get_db)):
    logger.debug("Fetching all tasks")
    try:
        tasks = db.query(Task).all()
        logger.debug(f"Retrieved tasks: {tasks}")
        return tasks
    except Exception as e:
        logger.error(f"Error fetching tasks: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching tasks: {str(e)}"
        )

@router.get("/{task_id}", response_model=TaskResponse)
def get_task(task_id: int, db: Session = Depends(get_db)):
    logger.debug(f"Fetching task with id: {task_id}")
    task = db.query(Task).filter(Task.id == task_id).first()
    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    return task

@router.put("/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int,
    task_data: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    logger.debug(f"Updating task with id: {task_id}, data: {task_data}")
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task_data.project_id is not None:
        project = db.query(Project).filter(Project.id == task_data.project_id).first()
        if not project:
            raise HTTPException(status_code=400, detail="Project with given id does not exist")

    if task_data.tag_ids:
        tags = db.query(Tag).filter(Tag.id.in_(task_data.tag_ids)).all()
        if len(tags) != len(task_data.tag_ids):
            raise HTTPException(status_code=400, detail="Some of the provided tag IDs do not exist")
    else:
        tags = []

    try:
        db_task.title = task_data.title
        db_task.description = task_data.description
        db_task.project_id = task_data.project_id
        db_task.tags = tags
        db.add(db_task)  # явно добавл€ем задачу в сессию дл€ обновлени€ отношений
        db.commit()
        db.refresh(db_task)

        log_task_activity(db, current_user.id, db_task.id, "update")
        return db_task
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating task: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error updating task: {str(e)}")

@router.delete("/{task_id}")
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    logger.debug(f"Deleting task with id: {task_id}")
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")

    try:
        # —начала логируем удаление, пока задача существует
        log_task_activity(db, current_user.id, task_id, "delete")
        
        # «атем удал€ем задачу
        db.delete(db_task)
        db.commit()

        return {"message": "Task deleted successfully"}
    except Exception as e:
        db.rollback()
        logger.error(f"Error deleting task: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error deleting task: {str(e)}")