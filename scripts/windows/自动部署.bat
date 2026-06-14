@echo off
setlocal enabledelayedexpansion
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

:: --- 检查/安装 Node.js ---
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [WARN] 未检测到 Node.js，尝试自动安装...

    :: 方法1: winget (Windows 10/11 自带)
    where winget >nul 2>nul
    if %errorlevel% equ 0 (
        echo [INFO] 通过 winget 安装 Node.js...
        winget install OpenJS.NodeJS.LTS --silent --accept-package-agreements
        if %errorlevel% equ 0 (
            echo [INFO] Node.js 安装完成，请重新运行本脚本
            pause
            exit /b 0
        )
    )

    :: 方法2: choco
    where choco >nul 2>nul
    if %errorlevel% equ 0 (
        echo [INFO] 通过 Chocolatey 安装 Node.js...
        choco install nodejs-lts -y
        if %errorlevel% equ 0 (
            echo [INFO] Node.js 安装完成，请重新运行本脚本
            pause
            exit /b 0
        )
    )

    :: 无法自动安装
    echo [ERROR] 无法自动安装 Node.js
    echo   请手动下载安装: https://nodejs.org/
    pause
    exit /b 1
)
echo [INFO] Node.js
node -v

:: --- 编译工具提醒 ---
echo [INFO] 注意: better-sqlite3 需要 C++ 编译工具
echo       如安装失败请运行: npm install -g windows-build-tools
echo.

:: --- 检查部署包 ---
if not exist "%SCRIPT_DIR%%PACKAGE_NAME%" (
    echo [ERROR] 未找到 %PACKAGE_NAME%
    echo   请确保本脚本与 %PACKAGE_NAME% 在同一目录下。
    pause
    exit /b 1
)

:: --- 备份现有文件 ---
if exist "%SCRIPT_DIR%web.js" (
    echo [INFO] 备份现有部署...
    for /f "tokens=1-4 delims=/-: " %%a in ('echo %date% %time%') do (
        set "TIMESTAMP=%%a%%b%%c-%%d"
    )
    set "BACKUP_DIR=%SCRIPT_DIR%backup-!TIMESTAMP!"
    mkdir "!BACKUP_DIR!" 2>nul
    for %%f in (web.js main.mjs config.js package.json package-lock.json) do (
        if exist "%SCRIPT_DIR%%%f" copy "%SCRIPT_DIR%%%f" "!BACKUP_DIR!\" >nul 2>nul
    )
    for %%d in (node_modules os world www api web data) do (
        if exist "%SCRIPT_DIR%%%d" xcopy "%SCRIPT_DIR%%%d" "!BACKUP_DIR!\%%d\" /E /I /Q >nul 2>nul
    )
    echo [INFO] 备份到: !BACKUP_DIR!
)

:: --- 解压 ---
echo.
echo [1/3] 解压 %PACKAGE_NAME% ...
cd /d "%SCRIPT_DIR%"
tar -xf "%PACKAGE_NAME%"
if %errorlevel% neq 0 (
    echo [ERROR] 解压失败，包可能已损坏！
    pause
    exit /b %errorlevel%
)
echo   解压完成。
echo.

:: --- 安装依赖 (始终执行，确保原生模块编译正确) ---
echo [2/3] 安装依赖 (目标平台原生编译)...
if exist "%SCRIPT_DIR%package-lock.json" (
    call npm ci --production 2>nul || call npm install --production
) else (
    call npm install --production
)
echo   依赖就绪。
echo.

:: --- 启动服务 ---
echo [3/3] 启动服务...
echo.

echo 启动 Web 服务器 (http://localhost:8088)...
start "open-wsmud Web" /B node "%SCRIPT_DIR%web.js"

echo 启动游戏服务器...
node "%SCRIPT_DIR%main.mjs"

echo.
echo 服务已停止。
pause
