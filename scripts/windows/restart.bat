@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion
:: ==============================================
::   open-wsmud2 重启脚本 (Windows)
:: ==============================================

:: --- 自动定位部署目录 ---
set "SCRIPT_DIR=%~dp0"
if exist "%~dp0..\..\web.js" (
    set "DEPLOY_DIR=%~dp0..\.."
) else (
    set "DEPLOY_DIR=%~dp0"
)

echo ============================================
echo   重启 open-wsmud2 服务 (Windows)
echo   部署目录: %DEPLOY_DIR%
echo ============================================
echo.

:: --- 检查 Node.js ---
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] 未找到 Node.js
    pause
    exit /b 1
)

cd /d "%DEPLOY_DIR%"

:: --- 停止 ---
echo 停止旧服务...
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul
echo.

:: --- 启动 ---
echo 启动 Web 服务器 (http://localhost:8088)...
start "open-wsmud Web" /B node web.js

echo 启动游戏服务器...
node main.mjs

echo.
echo 服务已停止。
pause
