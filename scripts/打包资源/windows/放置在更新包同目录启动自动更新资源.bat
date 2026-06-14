@echo off
chcp 65001 >nul
:: ==============================================
::   放置在更新包同目录 — 自动更新资源 (Windows)
::   解压 release.tar 覆盖到当前目录
:: ==============================================

set "SCRIPT_DIR=%~dp0"
set "PACKAGE_NAME=release.tar"

echo ============================================
echo   自动更新资源 open-wsmud2 (Windows)
echo ============================================
echo.

:: --- 检查更新包是否存在 ---
if not exist "%SCRIPT_DIR%%PACKAGE_NAME%" (
    echo ✗ 错误: 未找到 %PACKAGE_NAME%
    echo   请确保本脚本与 %PACKAGE_NAME% 在同一目录下。
    pause
    exit /b 1
)

:: --- 解压覆盖 ---
echo [1/2] 解压 %PACKAGE_NAME% (覆盖现有文件)...
cd /d "%SCRIPT_DIR%"
tar -xf "%PACKAGE_NAME%"
echo   更新完成。
echo.

:: --- 重启服务 ---
echo [2/2] 重启服务...

:: 停止旧进程
echo 停止旧服务...
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul
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
