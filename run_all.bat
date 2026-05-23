@echo off

:: Ensure backend directory
cd /d e:\GRIELISHA\backend

:: Create virtual environment if missing
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

:: Activate virtual environment
call venv\Scripts\activate.bat

:: Upgrade pip
python -m pip install --upgrade pip

:: Install backend dependencies
pip install -r requirements.txt

:: Apply migrations (SQLite will be used)
python manage.py migrate

:: Start Django server in a new window
start "Django Server" cmd /k "cd /d e:\GRIELISHA\backend && call venv\Scripts\activate.bat && python manage.py runserver"

:: Start React frontend in a new window
start "React Server" cmd /k "cd /d e:\GRIELISHA\frontend && if not exist node_modules (npm install) && npm run dev"

exit
