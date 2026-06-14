@echo off
chcp 65001 >nul
:: ==============================================
::   open-wsmud2 启动脚本 (Windows)
::   仅用于首次部署后的日常重启维护
::   首次部署请使用 首次部署/windows/ 下的脚本
:: ==============================================

set "SCRIPT_DIR=%~dp0"
set "PROJECT_ROOT=%~dp0..\..\.."

echo ============================================
echo   open-wsmud2 启动 (Windows)
echo ============================================
echo.

cd /d "%PROJECT_ROOT%"

:: 启动 Web 服务器 (后台窗口)
echo 启动 Web 服务器 (http://localhost:8088)...
start "open-wsmud Web" /B node web.js
echo.

:: 启动游戏服务器 (前台)
echo 启动游戏服务器...
node main.mjs

echo.
echo 服务已停止。
pause
