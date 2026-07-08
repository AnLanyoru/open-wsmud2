@echo off
echo ============================================
echo   Build TS -^> Deploy (core + res) -^> Start
echo ============================================

cd /d "%~dp0"

echo.
set /p BINARY="Pre-compile binary messages? (y/n, default n): "

echo.
echo [1/3] Building and deploying...
if /i "%BINARY%"=="y" (
    echo   Mode: binary (send_room -^> send_room_b)
    node scripts/pack.mjs --binary
) else (
    echo   Mode: normal
    node scripts/pack.mjs
)
if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b %errorlevel%
)
echo.

set /p BUILD_FRONTEND="[2/3] Build frontend? (y/n, default n): "
if /i "%BUILD_FRONTEND%"=="y" (
    echo Building frontend...
    call npx vite build
    if %errorlevel% neq 0 (
        echo Frontend build failed!
        pause
        exit /b %errorlevel%
    )
) else (
    echo [2/3] Skipping frontend build.
)
echo.

echo Starting servers...
start "open-wsmud Web" /B node web.js
echo   Web server started (http://localhost:8088)
echo   Game server starting...
node main.mjs

pause
