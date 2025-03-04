from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import tasks, users, projects, tags, activity_log
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = FastAPI()

# Настройка CORS
origins = [
    "http://localhost:3000",  # Разрешаем запросы с React-клиента
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Разрешаемые источники
    allow_credentials=True,  # Разрешить куки/токены
    allow_methods=["*"],     # Разрешить все методы (GET, POST, OPTIONS и т.д.)
    allow_headers=["*"],     # Разрешить все заголовки
)

# Создаем таблицы при старте приложения
Base.metadata.create_all(bind=engine)

@app.on_event("startup")
async def startup_event():
    from sqlalchemy.sql import text
    from app.database import get_db
    db = next(get_db())
    try:
        db.execute(text("SELECT 1"))
        logger.debug("Database connection successful")
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
        raise
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Welcome to Task Manager API! Visit /docs for API documentation."}

# Подключаем роутеры
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(tasks.router, prefix="/tasks", tags=["Tasks"])
app.include_router(projects.router, prefix="/projects", tags=["Projects"])
app.include_router(tags.router, prefix="/tags", tags=["Tags"])
app.include_router(activity_log.router, prefix="/activity_log", tags=["ActivityLog"])