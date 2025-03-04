# Task_Manager
(DB + Server app + Web Client App)

Установка зависимостей:
```
pip install -r requirements.txt
```

## Server start:
```
cd path_to_Task-manager\Task-manager

(for powershell: `Set-ExecutionPolicy Unrestricted -Scope Process` )

.\env\scripts\activate

uvicorn app.main:app --reload
```
## Client start:
```
cd path_to_client_directory
npm start
```
