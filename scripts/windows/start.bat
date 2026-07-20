@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion
:: ==============================================
::   open-wsmud2 启动脚本 (Windows)
::   从部署目录启动 Web + 游戏服务器
::   使用 PID 文件管理进程，输出重定向到 log/
:: ==============================================

:: --- 自动定位项目目录 ---
set "SCRIPT_DIR=%~dp0"
if exist "%~dp0..\..\web.js" (
    set "DEPLOY_DIR=%~dp0..\.."
) else (
    set "DEPLOY_DIR=%~dp0"
)
set "PID_DIR=%TEMP%\open-wsmud2"

echo ============================================
echo   open-wsmud2 启动 (Windows)
echo   部署目录: %DEPLOY_DIR%
echo ============================================
echo.

:: --- 检查 Node.js ---
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] 未找到 Node.js
    echo   请先安装 Node.js 24+: https://nodejs.org/
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
mkdir "%PID_DIR%" 2>nul
if not exist "log" mkdir "log"

:: --- 停止旧服务 ---
echo [INFO] 停止旧服务...
call :stop_old_services

:: --- 启动 Web 服务器 ---
echo [INFO] 启动 Web 服务器 (http://localhost:8088)...
for /f %%i in ('powershell -NoProfile -Command "(Start-Process -FilePath 'node' -ArgumentList 'web.js' -WorkingDirectory '%DEPLOY_DIR%' -RedirectStandardOutput 'log\web.log' -RedirectStandardError 'log\web.err' -WindowStyle Hidden -PassThru).Id"') do set "WEB_PID=%%i"
if defined WEB_PID (
    echo !WEB_PID!> "%PID_DIR%\web.pid"
    echo   Web PID: !WEB_PID!
) else (
    echo [WARN] Web 服务器 PID 获取失败
)

:: --- 启动游戏服务器 ---
echo [INFO] 启动游戏服务器...
for /f %%i in ('powershell -NoProfile -Command "(Start-Process -FilePath 'node' -ArgumentList 'main.mjs' -WorkingDirectory '%DEPLOY_DIR%' -RedirectStandardOutput 'log\game.log' -RedirectStandardError 'log\game.err' -WindowStyle Hidden -PassThru).Id"') do set "GAME_PID=%%i"
if defined GAME_PID (
    echo !GAME_PID!> "%PID_DIR%\game.pid"
    echo   Game PID: !GAME_PID!
) else (
    echo [WARN] 游戏服务器 PID 获取失败
)

:: --- 等待启动并检查进程是否存活 ---
echo [INFO] 等待服务初始化 (3秒)...
timeout /t 3 /nobreak >nul

set "STARTUP_FAILED=0"
if defined GAME_PID (
    tasklist /FI "PID eq %GAME_PID%" 2>nul | findstr %GAME_PID% >nul
    if errorlevel 1 (
        echo [ERROR] 游戏服务器启动失败！PID %GAME_PID% 已退出
        set "STARTUP_FAILED=1"
        if exist "log\game.err" (
            echo --- game.err 内容 ---
            type "log\game.err"
            echo --------------------
        )
        if exist "log\game.log" (
            echo --- game.log 最后 30 行 ---
            powershell -NoProfile -Command "Get-Content 'log\game.log' -Tail 30"
            echo ----------------------------
        )
    ) else (
        echo   [OK] 游戏服务器运行中 (PID %GAME_PID%)
    )
)
if defined WEB_PID (
    tasklist /FI "PID eq %WEB_PID%" 2>nul | findstr %WEB_PID% >nul
    if errorlevel 1 (
        echo [ERROR] Web 服务器启动失败！PID %WEB_PID% 已退出
        set "STARTUP_FAILED=1"
        if exist "log\web.err" (
            echo --- web.err 内容 ---
            type "log\web.err"
            echo --------------------
        )
        if exist "log\web.log" (
            echo --- web.log 最后 30 行 ---
            powershell -NoProfile -Command "Get-Content 'log\web.log' -Tail 30"
            echo ----------------------------
        )
    ) else (
        echo   [OK] Web 服务器运行中 (PID %WEB_PID%)
    )
)

if "%STARTUP_FAILED%"=="1" (
    echo.
    echo ============================================
    echo   [失败] 部分服务启动失败，请查看上方日志
    echo ============================================
    pause
    exit /b 1
)

echo.
echo ============================================
echo   [OK] 服务已启动
echo   Web 服务器: http://localhost:8088
echo   日志文件:   %DEPLOY_DIR%\log\
echo   PID 文件:   %PID_DIR%\
echo.
echo   查看日志: type log\web.log  /  type log\game.log
echo   停止服务: 运行 stop.bat
echo.
echo   如需前台运行 (查看实时输出), 请直接运行:
echo     node web.js   /   node main.mjs
echo ============================================
pause
exit /b 0

:: ============================================================
:: 子例程: 停止旧服务 (基于 PID 文件)
:: ============================================================
:stop_old_services
if exist "%PID_DIR%\web.pid" (
    for /f %%i in (%PID_DIR%\web.pid) do taskkill /PID %%i /F /T 2>nul
    del "%PID_DIR%\web.pid" 2>nul
)
if exist "%PID_DIR%\game.pid" (
    for /f %%i in (%PID_DIR%\game.pid) do taskkill /PID %%i /F /T 2>nul
    del "%PID_DIR%\game.pid" 2>nul
)
for /f "tokens=2" %%a in ('tasklist /v /fo csv ^| findstr "node.exe" ^| findstr "web.js" 2^>nul') do taskkill /PID %%a /F /T 2>nul
for /f "tokens=2" %%a in ('tasklist /v /fo csv ^| findstr "node.exe" ^| findstr "main.mjs" 2^>nul') do taskkill /PID %%a /F /T 2>nul
timeout /t 1 /nobreak >nul
goto :eof
