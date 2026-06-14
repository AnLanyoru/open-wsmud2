@echo off
setlocal enabledelayedexpansion
:: ==============================================
::   打包更新资源包 (Windows)
::   编译 -> 部署 -> 打包 -> release.tar (不含 node_modules)
:: ==============================================

set "SCRIPT_DIR=%~dp0"
set "PROJECT_ROOT=%~dp0..\.."
set "OUTPUT_DIR=%SCRIPT_DIR%"
set "PACKAGE_NAME=release.tar"

echo ============================================
echo   打包更新资源包 (Windows)
echo   输出: %PACKAGE_NAME% (不含 node_modules)
echo ============================================
echo.

:: --- 检查 Node.js ---
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] 未找到 Node.js
    pause
    exit /b 1
)

cd /d "%PROJECT_ROOT%"

:: --- 1. 编译 TypeScript ---
echo [1/3] 编译 TypeScript...
cd /d "%PROJECT_ROOT%\server"
call npx tsc --outDir dist
if %errorlevel% neq 0 (
    echo [WARN] 存在类型错误，JS 输出正常，继续...
)
cd /d "%PROJECT_ROOT%"
echo.

:: --- 2. 运行部署 ---
echo [2/3] 运行部署 (core -> os/, res -> world/)...
node server\scripts\deploy.mjs
if %errorlevel% neq 0 (
    echo [ERROR] 部署失败！
    pause
    exit /b %errorlevel%
)
echo.

:: --- 3. 构建前端并打包 ---
echo [3/3] 构建前端并打包 %PACKAGE_NAME% ...
call npx vite build
if %errorlevel% neq 0 (
    echo [ERROR] 前端构建失败！
    pause
    exit /b %errorlevel%
)
echo.

:: 清理旧包
if exist "%OUTPUT_DIR%%PACKAGE_NAME%" del "%OUTPUT_DIR%%PACKAGE_NAME%"

cd /d "%PROJECT_ROOT%"
tar -cf "%OUTPUT_DIR%%PACKAGE_NAME%" ^
    web.js main.mjs config.js ^
    package.json ^
    os/ world/ www/ ^
    api/ web/ data/ ^
    --exclude="*.ts" ^
    --exclude="*.map" ^
    --exclude=".git" ^
    --exclude=".idea" ^
    --exclude=".vscode" ^
    --exclude="log" ^
    --exclude="auto_test" ^
    --exclude="tools" ^
    --exclude="old" ^
    --exclude="server" ^
    --exclude="scripts" ^
    --exclude=".env" ^
    --exclude="*.tar" ^
    2>nul

if %errorlevel% neq 0 (
    echo [ERROR] 打包失败！
    pause
    exit /b %errorlevel%
)

echo ============================================
echo   [OK] 打包完成
echo   %OUTPUT_DIR%%PACKAGE_NAME%
echo.
echo   更新方法：
echo   1. 将 release.tar 与 windows\自动更新.bat
echo      一同复制到服务器部署目录
echo   2. 在服务器上运行: 自动更新.bat
echo ============================================
pause
