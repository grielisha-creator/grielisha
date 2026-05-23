@echo off
echo 🚀 Starting GRIELISHA Development Servers...

REM Skipping PostgreSQL check - using SQLite backend

REM Start Backend Server
echo 🔧 Starting Django Backend Server...
cd backend

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo 📦 Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install dependencies
echo 📦 Installing backend dependencies...
pip install -r requirements.txt

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo 📝 Creating backend .env file...
    copy .env.example .env
    echo ⚠️  Please update backend\.env with your database credentials
)

REM Run database migrations
echo 🗄️ Running database migrations...
python manage.py makemigrations
python manage.py migrate

REM Start Django server in background
echo 🌐 Starting Django server on http://localhost:8000...
start "Django Server" cmd /k "python manage.py runserver"

REM Start Frontend Server
echo ⚛️ Starting React Frontend Server...
cd ..\frontend

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing frontend dependencies...
    npm install
)

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo 📝 Creating frontend .env file...
    copy .env.example .env
)

REM Start React development server
echo 🎨 Starting React server on http://localhost:3000...
start "" cmd /k "npm run dev"

REM Wait for servers to start
timeout /t 5 >nul

echo.
echo ✅ GRIELISHA Development Servers Started!
echo.
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend API: http://localhost:8000
echo 📚 API Documentation: http://localhost:8000/api/docs/
echo 🔐 Admin Panel: http://localhost:8000/admin/
echo.
echo 🛑 Close this window to stop servers
rem pause
