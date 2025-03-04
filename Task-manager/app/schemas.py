from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

#---------------------------------------------------
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True
#---------------------------------------------------
class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    due_date: Optional[datetime] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectResponse(ProjectBase):
    id: int

    class Config:
        from_attributes = True
#---------------------------------------------------
class TagBase(BaseModel):
    name: str

class TagCreate(TagBase):
    pass

class TagResponse(TagBase):
    id: int

    class Config:
        from_attributes = True
#---------------------------------------------------
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    project_id: Optional[int] = None

class TaskCreate(TaskBase):
    tag_ids: list[int] = []
    due_date: Optional[datetime] = None

class TaskResponse(TaskBase):
    id: int
    created_at: datetime
    completed: bool
    owner_id: Optional[int] = None  
    tags: List[TagResponse] = []
    project: Optional[ProjectResponse] = None 
    due_date: Optional[datetime] = None

    class Config:
        from_attributes = True
#---------------------------------------------------
class ActivityLogBase(BaseModel):
    action: str

class ActivityLogCreate(ActivityLogBase):
    task_id: int
    user_id: Optional[int] = None

class ActivityLogResponse(ActivityLogBase):
    id: int
    task_title: str
    timestamp: datetime
    task_id: int
    user_id: Optional[int] = None
    user_name: str

    class Config:
        from_attributes = True