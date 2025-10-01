@echo off
echo Starting LT Innovations POS Frontend...
echo.

REM Check if react-app directory exists
if not exist "react-app" (
    echo ERROR: React app directory not found!
    echo Please make sure you're in the correct directory.
    pause
    exit /b 1
)

REM Change to react-app directory
cd react-app

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing frontend dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
)

echo Starting frontend development server...
echo Frontend will be available at: http://localhost:3000
echo.
npm start
