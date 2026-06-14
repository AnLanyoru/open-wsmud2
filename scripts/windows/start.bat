@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion
:: ==============================================
::   open-wsmud2 启动脚本 (Windows)
:: ==============================================

:: --- 自动定位部署目录 ---
set "SCRIPT_DIR=%~dp0"
if exist "%~dp0..\..\web.js" (
    set "DEPLOY_DIR=%~dp0..\.."
) else (
    set "DEPLOY_DIR=%~dp0"
)

echo ============================================
echo   open-wsmud2 启动 (Windows)
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

:: --- 检查文件 ---
if not exist "%DEPLOY_DIR%\web.js" (
    echo [ERROR] 未找到 web.js，请确认部署目录正确
    pause
    exit /b 1
)
if not exist "%DEPLOY_DIR%\main.mjs" (
    echo [ERROR] 未找到 main.mjs，请确认部署目录正确
    pause
    exit /b 1
)

cd /d "%DEPLOY_DIR%"

:: --- 启动服务 ---
echo 启动 Web 服务器 (http://localhost:8088)...
start "open-wsmud Web" /B node web.js

echo 启动游戏服务器...
node main.mjs

echo.
echo 服务已停止。
pause
