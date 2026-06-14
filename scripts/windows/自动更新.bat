@echo off
setlocal enabledelayedexpansion
:: ==============================================
::   放置在更新包同目录 — 自动更新资源 (Windows)
::   解压 release.tar 覆盖到当前目录并重启
:: ==============================================

set "SCRIPT_DIR=%~dp0"
set "PACKAGE_NAME=release.tar"

echo ============================================
echo   自动更新资源 open-wsmud2 (Windows)
echo ============================================
echo.

:: --- 检查/安装 Node.js ---
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [WARN] 未检测到 Node.js，尝试自动安装...

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

    echo [ERROR] 无法自动安装 Node.js
    echo   请手动下载安装: https://nodejs.org/
    pause
    exit /b 1
)

:: --- 检查更新包 ---
if not exist "%SCRIPT_DIR%%PACKAGE_NAME%" (
    echo [ERROR] 未找到 %PACKAGE_NAME%
    echo   请确保本脚本与 %PACKAGE_NAME% 在同一目录下。
    pause
    exit /b 1
)

:: --- 备份关键文件 ---
for /f "tokens=1-4 delims=/-: " %%a in ('echo %date% %time%') do (
    set "TIMESTAMP=%%a%%b%%c-%%d"
)
set "BACKUP_DIR=%SCRIPT_DIR%backup-!TIMESTAMP!"
mkdir "!BACKUP_DIR!" 2>nul

if exist "%SCRIPT_DIR%.env" (
    copy "%SCRIPT_DIR%.env" "!BACKUP_DIR!\" >nul
    echo [INFO] 已备份 .env
)
if exist "%SCRIPT_DIR%config.js" (
    copy "%SCRIPT_DIR%config.js" "!BACKUP_DIR!\" >nul
    echo [INFO] 已备份 config.js
)
if exist "%SCRIPT_DIR%package.json" (
    copy "%SCRIPT_DIR%package.json" "!BACKUP_DIR!\" >nul
)

:: --- 解压覆盖 ---
echo.
echo [1/2] 解压 %PACKAGE_NAME% (覆盖现有文件)...
cd /d "%SCRIPT_DIR%"
tar -xf "%PACKAGE_NAME%"
if %errorlevel% neq 0 (
    echo [ERROR] 解压失败！
    pause
    exit /b %errorlevel%
)
echo   更新完成。

:: --- 还原 .env ---
if exist "!BACKUP_DIR!\.env" (
    copy /Y "!BACKUP_DIR!\.env" "%SCRIPT_DIR%" >nul
    echo   .env 已从备份还原
)

:: --- 同步依赖 (更新可能引入新包，确保原生模块正确) ---
echo.
echo 同步依赖...
if exist "%SCRIPT_DIR%package-lock.json" (
    call npm ci --production 2>nul || call npm install --production
) else (
    call npm install --production
)
echo   依赖就绪。

:: --- 重启服务 ---
echo.
echo [2/2] 重启服务...

:: 停止旧进程
echo 停止旧服务...
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul
echo.

:: 启动服务
echo 启动 Web 服务器 (http://localhost:8088)...
start "open-wsmud Web" /B node "%SCRIPT_DIR%web.js"

echo 启动游戏服务器...
node "%SCRIPT_DIR%main.mjs"

echo.
echo 服务已停止。
pause
