@echo off
chcp 65001 >nul
title Library Management System

echo.
echo ==============================================
echo       Library Management System - Start
echo ==============================================
echo.

set "NODE_DIR=C:\Users\20475\.workbuddy\binaries\node\versions\22.22.2"
set "PROJECT_DIR=%~dp0"
set "PATH=%NODE_DIR%;%PATH%"

echo [1/3] Starting Backend (Flask)...
cd /d "%PROJECT_DIR%backend"
start "Backend" cmd /k "set PATH=%NODE_DIR%;%%PATH%% && python app.py"

timeout /t 3 /nobreak >nul

echo [2/3] Starting Frontend (Next.js)...
cd /d "%PROJECT_DIR%frontend"
start "Frontend" cmd /k "set PATH=%NODE_DIR%;%%PATH%% && npm run dev"

timeout /t 8 /nobreak >nul

echo [3/3] Opening Browser...
start http://localhost:3000

echo.
echo ==============================================
echo       All Services Started!
echo ==============================================
echo.
echo Backend: http://127.0.0.1:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to close this window...
pause >nul