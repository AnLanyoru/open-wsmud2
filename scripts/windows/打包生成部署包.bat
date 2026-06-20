@echo off
setlocal enabledelayedexpansion
:: ==============================================
::   打包首次部署资源包 (Windows)
::   编译 -> 部署 -> 打包 -> fast_start.tar
:: ==============================================

set "SCRIPT_DIR=%~dp0"
set "PROJECT_ROOT=%~dp0..\.."
set "OUTPUT_DIR=%SCRIPT_DIR%"
set "PACKAGE_NAME=fast_start.tar"

echo ============================================
echo   打包首次部署资源包 (Windows)
echo   输出: %PACKAGE_NAME%
echo ============================================
echo.

:: --- 检查 Node.js ---
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] 未找到 Node.js，请先安装 Node.js 18+
    pause
    exit /b 1
)
echo [INFO] Node.js
node -v

:: --- 0. 切换到项目根 ---
cd /d "%PROJECT_ROOT%"
if not exist "package.json" (
    echo [ERROR] 未找到 package.json，请确认 PROJECT_ROOT 路径正确
    pause
    exit /b 1
)

:: --- 1. 安装依赖 ---
echo.
echo [1/5] 安装依赖...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] 依赖安装失败！
    pause
    exit /b %errorlevel%
)
echo.

:: --- 2. 编译 TypeScript ---
echo [2/5] 编译 TypeScript...
cd /d "%PROJECT_ROOT%\server"
if exist dist rmdir /s /q dist
call npx tsc --outDir dist
if %errorlevel% neq 0 (
    echo [WARN] 存在类型错误，JS 输出正常，继续...
)
cd /d "%PROJECT_ROOT%"
echo.

:: --- 3. 运行部署 ---
echo [3/5] 运行部署 (core -> os/, res -> world/)...
node server\scripts\deploy.mjs
if %errorlevel% neq 0 (
    echo [ERROR] 部署失败！
    pause
    exit /b %errorlevel%
)
echo.

:: --- 4. 构建前端 ---
echo [4/5] 构建前端...
call npx vite build
if %errorlevel% neq 0 (
    echo [ERROR] 前端构建失败！
    pause
    exit /b %errorlevel%
)
echo.

:: --- 5. 打包 ---
echo [5/5] 打包 %PACKAGE_NAME% ...
cd /d "%PROJECT_ROOT%"

:: 清理旧包
if exist "%OUTPUT_DIR%%PACKAGE_NAME%" del "%OUTPUT_DIR%%PACKAGE_NAME%"

:: 注意: 不打包 node_modules/ (better-sqlite3 是原生模块，需在目标机器上编译)
tar -cf "%OUTPUT_DIR%%PACKAGE_NAME%" ^
    web.js main.mjs config.js ^
    package.json package-lock.json ^
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
    --exclude="node_modules" ^
    --exclude=".env" ^
    --exclude="*.tar" ^
    2>nul

if %errorlevel% neq 0 (
    echo [ERROR] 打包失败！
    pause
    exit /b %errorlevel%
)

echo.
echo ============================================
echo   [OK] 打包完成
echo   %OUTPUT_DIR%%PACKAGE_NAME%
echo.
echo   注意: 不含 node_modules/ (better-sqlite3 是原生模块)
echo   目标服务器需具备 Node.js + 编译工具
echo.
echo   部署方法：
echo   1. 将 fast_start.tar 与 windows\自动部署.bat
echo      一同复制到服务器目标目录
echo   2. 在服务器上运行: 自动部署.bat
echo ============================================
pause
