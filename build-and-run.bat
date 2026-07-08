@echo off
echo ============================================
echo   Build TS -^> Deploy (core + res) -^> Start
echo ============================================

cd /d "%~dp0"

echo.
echo [1/3] Select build mode:
echo   1 - Normal compile
echo   2 - Binary pre-compile (send_room -^> send_room_b)
echo   * - Skip TS compilation
set /p BUILD_MODE="  choice: "

if "%BUILD_MODE%"=="1" (
    echo   Mode: normal
    node scripts/pack.mjs
) else if "%BUILD_MODE%"=="2" (
    echo   Mode: binary
    node scripts/pack.mjs --binary
) else (
    echo   Skipping TS compilation.
    goto :frontend
)

if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b %errorlevel%
)

:frontend
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
