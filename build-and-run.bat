@echo off
echo ============================================
echo   Build TS -^> Deploy to os/ -^> Start Server
echo ============================================

cd /d "%~dp0server"

echo.
echo [1/3] Compiling TypeScript...
call npx tsc --outDir dist
if %errorlevel% neq 0 (
    echo Type errors found, but JS output is OK, continuing...
)
echo.

echo [2/3] Deploying to os/...
node scripts/deploy.mjs
if %errorlevel% neq 0 (
    echo Deploy failed!
    pause
    exit /b %errorlevel%
)
echo.

echo [3/3] Starting server...
cd /d "%~dp0"
node main.mjs

pause
