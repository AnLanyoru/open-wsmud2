@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion
:: ==============================================
::   open-wsmud2 停止脚本 (Windows)
::   优先使用 PID 文件，避免误杀其他 node 进程
:: ==============================================

set "PID_DIR=%TEMP%\open-wsmud2"

echo ============================================
echo   停止 open-wsmud2 服务 (Windows)
echo ============================================
echo.

set "KILLED=0"

:: 优先: 通过 PID 文件停止
if exist "%PID_DIR%\web.pid" (
    for /f %%i in (%PID_DIR%\web.pid) do (
        taskkill /PID %%i /F /T 2>nul
        if !errorlevel! equ 0 (
            echo [INFO] Web 服务器已停止 (PID: %%i)
            set "KILLED=1"
        )
    )
    del "%PID_DIR%\web.pid" 2>nul
)
if exist "%PID_DIR%\game.pid" (
    for /f %%i in (%PID_DIR%\game.pid) do (
        taskkill /PID %%i /F /T 2>nul
        if !errorlevel! equ 0 (
            echo [INFO] 游戏服务器已停止 (PID: %%i)
            set "KILLED=1"
        )
    )
    del "%PID_DIR%\game.pid" 2>nul
)

:: 兜底: 按命令行匹配清理残留 (仅匹配 web.js / main.mjs，不影响其他 node 进程)
for /f "tokens=2" %%a in ('tasklist /v /fo csv ^| findstr "node.exe" ^| findstr "web.js" 2^>nul') do (
    taskkill /PID %%a /F /T 2>nul
    echo [INFO] 已清理残留 Web 服务器进程 (PID: %%a)
    set "KILLED=1"
)
for /f "tokens=2" %%a in ('tasklist /v /fo csv ^| findstr "node.exe" ^| findstr "main.mjs" 2^>nul') do (
    taskkill /PID %%a /F /T 2>nul
    echo [INFO] 已清理残留游戏服务器进程 (PID: %%a)
    set "KILLED=1"
)

if "%KILLED%"=="0" (
    echo [INFO] 没有正在运行的服务
)

echo.
pause
