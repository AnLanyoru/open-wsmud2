@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion
:: ==============================================
::   放置在部署包同目录 — 自动部署 (Windows)
::   解压 fast_start.tar 并启动服务
::
::   本脚本为自包含版本，无需其他依赖，可直接随 tar 分发。
::   使用 PID 文件管理进程，避免误杀其他 node 进程。
:: ==============================================

set "SCRIPT_DIR=%~dp0"
set "PACKAGE_NAME=fast_start.tar"
set "PID_DIR=%TEMP%\open-wsmud2"

echo ============================================
echo   自动部署 open-wsmud2 (Windows)
echo ============================================
echo.

:: --- 检测/安装 Node.js ---
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [WARN] 未检测到 Node.js，尝试自动安装...

    :: 方法1: winget (Windows 10/11 自带)
    where winget >nul 2>nul
    if !errorlevel! equ 0 (
        echo [INFO] 通过 winget 安装 Node.js...
        winget install OpenJS.NodeJS.LTS --silent --accept-package-agreements
        if !errorlevel! equ 0 (
            echo [INFO] Node.js 安装完成，请重新打开命令行运行本脚本
            pause
            exit /b 0
        )
    )

    :: 方法2: choco
    where choco >nul 2>nul
    if !errorlevel! equ 0 (
        echo [INFO] 通过 Chocolatey 安装 Node.js...
        choco install nodejs-lts -y
        if !errorlevel! equ 0 (
            echo [INFO] Node.js 安装完成，请重新打开命令行运行本脚本
            pause
            exit /b 0
        )
    )

    echo [ERROR] 无法自动安装 Node.js
    echo   请手动下载安装: https://nodejs.org/ (需要 24+)
    pause
    exit /b 1
)
echo [INFO] Node.js
node -v
echo.

:: --- 编译工具提示 (better-sqlite3 需要 C++ 编译工具) ---
where cl >nul 2>nul
if %errorlevel% neq 0 (
    echo [INFO] 注意: better-sqlite3 需要 C++ 编译工具
    echo       若 npm install 失败，请安装 Visual Studio Build Tools
    echo       或运行: npm install -g windows-build-tools
    echo.
)

:: --- 检查部署包 ---
if not exist "%SCRIPT_DIR%%PACKAGE_NAME%" (
    echo [ERROR] 未找到 %PACKAGE_NAME%
    echo   请确保本脚本与 %PACKAGE_NAME% 在同一目录下。
    pause
    exit /b 1
)

:: --- 校验包完整性 ---
echo [INFO] 校验包完整性...
tar -tf "%SCRIPT_DIR%%PACKAGE_NAME%" >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] 包文件损坏或无效: %PACKAGE_NAME%
    pause
    exit /b 1
)
echo   校验通过。
echo.

:: --- 备份现有部署 ---
if exist "%SCRIPT_DIR%web.js" (
    echo [INFO] 备份现有部署...
    for /f "tokens=1-4 delims=/-: " %%a in ('echo %date% %time%') do (
        set "TIMESTAMP=%%a%%b%%c-%%d"
    )
    set "BACKUP_DIR=%SCRIPT_DIR%backup-!TIMESTAMP!"
    mkdir "!BACKUP_DIR!" 2>nul
    for %%f in (web.js main.mjs config.js package.json package-lock.json .env) do (
        if exist "%SCRIPT_DIR%%%f" copy "%SCRIPT_DIR%%%f" "!BACKUP_DIR!\" >nul 2>nul
    )
    :: 编译产物目录为 core/ res/ (而非旧版 os/ world/)
    for %%d in (node_modules core res www api web data) do (
        if exist "%SCRIPT_DIR%%%d" xcopy "%SCRIPT_DIR%%%d" "!BACKUP_DIR!\%%d\" /E /I /Q >nul 2>nul
    )
    echo   备份到: !BACKUP_DIR!
)
echo.

:: --- 解压 ---
echo [1/3] 解压 %PACKAGE_NAME% ...
cd /d "%SCRIPT_DIR%"
tar -xf "%PACKAGE_NAME%"
if %errorlevel% neq 0 (
    echo [ERROR] 解压失败，包可能损坏！
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
if %errorlevel% neq 0 (
    echo [ERROR] 依赖安装失败！
    echo   better-sqlite3 需要编译工具，请安装 Visual Studio Build Tools
    pause
    exit /b %errorlevel%
)
echo   依赖就绪。
echo.

:: --- 启动服务 ---
echo [3/3] 启动服务...
echo.

mkdir "%PID_DIR%" 2>nul

:: 停止旧服务 (基于 PID 文件，避免误杀其他 node 进程)
call :stop_old_services

:: 启动 Web 服务器 (后台运行，记录 PID，输出重定向到日志)
echo [INFO] 启动 Web 服务器 (http://localhost:8088)...
if not exist "%SCRIPT_DIR%log" mkdir "%SCRIPT_DIR%log"
for /f %%i in ('powershell -NoProfile -Command "(Start-Process -FilePath 'node' -ArgumentList 'web.js' -WorkingDirectory '%SCRIPT_DIR%' -RedirectStandardOutput 'log\web.log' -RedirectStandardError 'log\web.err' -WindowStyle Hidden -PassThru).Id"') do set "WEB_PID=%%i"
if defined WEB_PID (
    echo !WEB_PID!> "%PID_DIR%\web.pid"
    echo   Web PID: !WEB_PID!
) else (
    echo [WARN] Web 服务器 PID 获取失败
)

:: 启动游戏服务器 (后台运行，记录 PID)
echo [INFO] 启动游戏服务器...
for /f %%i in ('powershell -NoProfile -Command "(Start-Process -FilePath 'node' -ArgumentList 'main.mjs' -WorkingDirectory '%SCRIPT_DIR%' -RedirectStandardOutput 'log\game.log' -RedirectStandardError 'log\game.err' -WindowStyle Hidden -PassThru).Id"') do set "GAME_PID=%%i"
if defined GAME_PID (
    echo !GAME_PID!> "%PID_DIR%\game.pid"
    echo   Game PID: !GAME_PID!
) else (
    echo [WARN] 游戏服务器 PID 获取失败
)

echo.
echo ============================================
echo   [OK] 部署完成，服务已启动
echo   Web 服务器: http://localhost:8088
echo   日志文件:   %SCRIPT_DIR%log\
echo   PID 文件:   %PID_DIR%\
echo.
echo   停止服务: 运行 stop.bat 或 自动更新.bat
echo   查看日志: type log\web.log  /  type log\game.log
echo ============================================
pause
exit /b 0

:: ============================================================
:: 子例程: 停止旧服务 (基于 PID 文件)
:: ============================================================
:stop_old_services
if exist "%PID_DIR%\web.pid" (
    for /f %%i in (%PID_DIR%\web.pid) do (
        taskkill /PID %%i /F /T 2>nul
    )
    del "%PID_DIR%\web.pid" 2>nul
)
if exist "%PID_DIR%\game.pid" (
    for /f %%i in (%PID_DIR%\game.pid) do (
        taskkill /PID %%i /F /T 2>nul
    )
    del "%PID_DIR%\game.pid" 2>nul
)
:: 兜底: 仅清理可能残留的本项目进程 (按命令行匹配，不影响其他 node 进程)
for /f "tokens=2" %%a in ('tasklist /v /fo csv ^| findstr "node.exe" ^| findstr "web.js" 2^>nul') do taskkill /PID %%a /F /T 2>nul
for /f "tokens=2" %%a in ('tasklist /v /fo csv ^| findstr "node.exe" ^| findstr "main.mjs" 2^>nul') do taskkill /PID %%a /F /T 2>nul
timeout /t 1 /nobreak >nul
goto :eof
