@echo off
echo Starting LT Innovations POS System...
echo.

REM Check if MongoDB is running
echo Checking MongoDB connection...
mongosh --eval "db.adminCommand('ping')" >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: MongoDB is not running!
    echo Please start MongoDB and try again.
    echo.
    echo On Windows, run: net start MongoDB
    echo On macOS: brew services start mongodb/brew/mongodb-community
    echo On Linux: sudo systemctl start mongod
    pause
    exit /b 1
)

echo MongoDB is running!
echo.

REM Check if backend dependencies are installed
if not exist "node_modules" (
    echo Installing backend dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install backend dependencies
        pause
        exit /b 1
    )
)

REM Check if database is set up
echo Checking database setup...
node -e "const mongoose = require('mongoose'); mongoose.connect('mongodb://localhost:27017/lt_innovations_pos').then(() => { mongoose.connection.db.listCollections().toArray().then(cols => { if(cols.length === 0) { console.log('Database is empty, running setup...'); process.exit(1); } else { console.log('Database is ready'); process.exit(0); } }); })" 2>nul
if %errorlevel% neq 0 (
    echo Database is empty, setting up...
    npm run setup-db
    if %errorlevel% neq 0 (
        echo ERROR: Failed to setup database
        pause
        exit /b 1
    )
)

REM Check if frontend dependencies are installed
if not exist "react-app\node_modules" (
    echo Installing frontend dependencies...
    cd react-app
    npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install frontend dependencies
        pause
        exit /b 1
    )
    cd ..
)

echo.
echo Starting both backend and frontend servers...
echo.
echo Backend will be available at: http://localhost:5000
echo Frontend will be available at: http://localhost:3000
echo.
echo Demo Credentials:
echo Super Admin: admin@ltinnovations.com / admin123
echo Shop Admin: admin@goldpalace.com / admin123
echo.

REM Start backend in background
start "LT POS Backend" cmd /k "npm start"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend
cd react-app
start "LT POS Frontend" cmd /k "npm start"

echo.
echo Both servers are starting...
echo Check the opened command windows for server status.
echo.
echo Press any key to close this window...
pause >nul
