@echo off
chcp 65001 >nul
echo ============================================
echo   编译 TypeScript → 部署到 os/ → 启动服务器
echo ============================================

cd /d "%~dp0server"

echo.
echo [1/3] 编译 TypeScript...
call npx tsc --outDir dist
if %errorlevel% neq 0 (
    echo 编译有类型错误，但不影响 JS 输出，继续...
)
echo.

echo [2/3] 部署到 os/...
node scripts/deploy.mjs
if %errorlevel% neq 0 (
    echo 部署失败！
    pause
    exit /b %errorlevel%
)
echo.

echo [3/3] 启动服务器...
cd /d "%~dp0"
node main.mjs

pause
