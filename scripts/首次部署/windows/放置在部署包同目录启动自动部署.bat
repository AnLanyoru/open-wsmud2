@echo off
chcp 65001 >nul
:: ==============================================
::   放置在部署包同目录 — 自动部署 (Windows)
::   解压 fast_start.tar 并启动服务
:: ==============================================

set "SCRIPT_DIR=%~dp0"
set "PACKAGE_NAME=fast_start.tar"

echo ============================================
echo   自动部署 open-wsmud2 (Windows)
echo ============================================
echo.

:: --- 检查部署包是否存在 ---
if not exist "%SCRIPT_DIR%%PACKAGE_NAME%" (
    echo ✗ 错误: 未找到 %PACKAGE_NAME%
    echo   请确保本脚本与 %PACKAGE_NAME% 在同一目录下。
    pause
    exit /b 1
)

:: --- 解压 ---
echo [1/3] 解压 %PACKAGE_NAME% ...
cd /d "%SCRIPT_DIR%"
tar -xf "%PACKAGE_NAME%"
echo   解压完成。
echo.

:: --- 安装依赖 (安全冗余) ---
echo [2/3] 检查依赖...
if exist "package.json" (
    call npm install --production 2>nul || call npm install
)
echo.

:: --- 启动服务 ---
echo [3/3] 启动服务...
echo.

:: 启动 Web 服务器 (后台窗口)
echo 启动 Web 服务器 (http://localhost:8088)...
start "open-wsmud Web" /B node web.js

:: 启动游戏服务器 (前台)
echo 启动游戏服务器...
node main.mjs

echo.
echo 服务已停止。
pause
