@echo off
echo Starting LT Innovations POS Backend...
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

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing backend dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install dependencies
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

echo Starting backend server...
echo Backend will be available at: http://localhost:5000
echo.
npm start
