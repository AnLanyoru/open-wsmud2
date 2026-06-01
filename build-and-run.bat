@echo off
echo ============================================
echo   Build TS -^> Deploy (os + world) -^> Start
echo ============================================

cd /d "%~dp0server"

echo.
echo [1/3] Compiling TypeScript (core + res)...
call npx tsc --outDir dist
if %errorlevel% neq 0 (
    echo Type errors found, but JS output is OK, continuing...
)
echo.

echo [2/3] Deploying...
echo   - core -^> os/
echo   - res  -^> world/ (路径重写: core/ -^> os/)
node scripts/deploy.mjs
if %errorlevel% neq 0 (
    echo Deploy failed!
    pause
    exit /b %errorlevel%
)
echo.

cd /d "%~dp0"

set /p BUILD_FRONTEND="[3/3] Build frontend? (y/n, default n): "
if /i "%BUILD_FRONTEND%"=="y" (
    echo Building frontend...
    call npx vite build
    if %errorlevel% neq 0 (
        echo Frontend build failed!
        pause
        exit /b %errorlevel%
    )
) else (
    echo [3/3] Skipping frontend build.
)
echo.

echo Starting servers...
start "open-wsmud Web" /B node web.js
echo   Web server started (http://localhost:8088)
echo   Game server starting...
node main.mjs

pause
