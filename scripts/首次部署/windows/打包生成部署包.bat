@echo off
chcp 65001 >nul
:: ==============================================
::   打包首次部署资源包 (Windows)
::   编译 → 部署 → 打包 → fast_start.tar
:: ==============================================

set "SCRIPT_DIR=%~dp0"
set "PROJECT_ROOT=%~dp0..\..\.."
set "OUTPUT_DIR=%SCRIPT_DIR%"
set "PACKAGE_NAME=fast_start.tar"

echo ============================================
echo   打包首次部署资源包 (Windows)
echo   输出: %PACKAGE_NAME%
echo ============================================
echo.

cd /d "%PROJECT_ROOT%"

:: --- 1. 安装依赖 ---
echo [1/5] 安装依赖...
call npm install
if %errorlevel% neq 0 (
    echo 依赖安装失败！
    pause
    exit /b %errorlevel%
)
echo.

:: --- 2. 编译 TypeScript ---
echo [2/5] 编译 TypeScript...
cd /d "%PROJECT_ROOT%\server"
call npx tsc --outDir dist
if %errorlevel% neq 0 (
    echo 存在类型错误，JS 输出正常，继续...
)
cd /d "%PROJECT_ROOT%"
echo.

:: --- 3. 运行部署 ---
echo [3/5] 运行部署 (core → os/, res → world/)...
node server\scripts\deploy.mjs
if %errorlevel% neq 0 (
    echo 部署失败！
    pause
    exit /b %errorlevel%
)
echo.

:: --- 4. 构建前端 ---
echo [4/5] 构建前端...
call npx vite build
if %errorlevel% neq 0 (
    echo 前端构建失败！
    pause
    exit /b %errorlevel%
)
echo.

:: --- 5. 打包 ---
echo [5/5] 打包 %PACKAGE_NAME% ...
cd /d "%PROJECT_ROOT%"
tar -cf "%OUTPUT_DIR%%PACKAGE_NAME%" ^
    web.js main.mjs config.js ^
    package.json package-lock.json ^
    node_modules/ ^
    os/ world/ www/ ^
    api/ web/ data/ ^
    --exclude="node_modules/.cache" ^
    --exclude="*.ts" ^
    --exclude="*.map" ^
    2>nul

echo.
echo ============================================
echo   ✓ 打包完成
echo   %OUTPUT_DIR%%PACKAGE_NAME%
echo.
echo   部署方法：
echo   1. 将 fast_start.tar 与 放置在部署包同目录启动自动部署.bat
echo      一同复制到服务器目标目录
echo   2. 在服务器上运行: 放置在部署包同目录启动自动部署.bat
echo ============================================
pause
