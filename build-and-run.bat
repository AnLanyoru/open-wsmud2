@echo off
echo ============================================
echo   Build TS -^> Deploy -^> Build Frontend -^> Start
echo ============================================

cd /d "%~dp0server"

echo.
echo [1/4] Compiling TypeScript...
call npx tsc --outDir dist
if %errorlevel% neq 0 (
    echo Type errors found, but JS output is OK, continuing...
)
echo.

echo [2/4] Deploying to os/...
node scripts/deploy.mjs
if %errorlevel% neq 0 (
    echo Deploy failed!
    pause
    exit /b %errorlevel%
)
echo.

cd /d "%~dp0"

set /p BUILD_FRONTEND="Build frontend? (y/n, default n): "
if /i "%BUILD_FRONTEND%"=="y" (
    echo [3/4] Building frontend...
    call npx vite build
    if %errorlevel% neq 0 (
        echo Frontend build failed!
        pause
        exit /b %errorlevel%
    )
) else (
    echo [3/4] Skipping frontend build.
)
echo.

echo [4/4] Starting servers...
start "open-wsmud Web" /B node web.js
echo   Web server started (http://localhost:8088)
echo   Game server starting...
node main.mjs

pause
