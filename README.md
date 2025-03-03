# Task_Manager
(DB + Server app + Web Client App)

cd path_to_task_manager

(for powershell: `Set-ExecutionPolicy Unrestricted -Scope Process` )

.\env\scripts\activate

uvicorn app.main:app --reload
