@echo off
:: ==============================================
::   open-wsmud2 停止脚本 (Windows)
:: ==============================================

echo ============================================
echo   停止 open-wsmud2 服务
echo ============================================
echo.

echo 停止所有 node.exe 进程...
taskkill /f /im node.exe 2>nul

if %errorlevel% equ 0 (
    echo [INFO] 服务已停止。
) else (
    echo [INFO] 没有运行中的 node 进程。
)

echo.
pause
