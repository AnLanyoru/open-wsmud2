@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion
:: ==============================================
::   放置在更新包同目录 — 自动更新资源 (Windows)
::   解压 release.tar 覆盖到当前目录并重启
::
::   本脚本为自包含版本，无需其他依赖，可直接随 tar 分发。
::   使用 PID 文件管理进程，避免误杀其他 node 进程。
:: ==============================================

set "SCRIPT_DIR=%~dp0"
set "PACKAGE_NAME=release.tar"
set "PID_DIR=%TEMP%\open-wsmud2"

echo ============================================
echo   自动更新资源 open-wsmud2 (Windows)
echo ============================================
echo.

:: --- 检测/安装 Node.js ---
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [WARN] 未检测到 Node.js，尝试自动安装...

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

:: --- 检查更新包 ---
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

:: --- 备份关键文件 (解压会覆盖) ---
echo [INFO] 备份即将覆盖的文件...
for /f "tokens=1-4 delims=/-: " %%a in ('echo %date% %time%') do (
    set "TIMESTAMP=%%a%%b%%c-%%d"
)
set "BACKUP_DIR=%SCRIPT_DIR%backup-!TIMESTAMP!"
mkdir "!BACKUP_DIR!" 2>nul

:: 备份 .env (重要!)
if exist "%SCRIPT_DIR%.env" (
    copy "%SCRIPT_DIR%.env" "!BACKUP_DIR!\" >nul
    echo   已备份 .env
)
:: 备份 config.js (可能有本地修改)
if exist "%SCRIPT_DIR%config.js" (
    copy "%SCRIPT_DIR%config.js" "!BACKUP_DIR!\" >nul
    echo   已备份 config.js
)
:: 备份 package.json (依赖版本可能不同)
if exist "%SCRIPT_DIR%package.json" (
    copy "%SCRIPT_DIR%package.json" "!BACKUP_DIR!\" >nul
)
:: 备份 data/ 运行时数据 (数据库绝对不能丢)
if exist "%SCRIPT_DIR%data" (
    xcopy "%SCRIPT_DIR%data" "!BACKUP_DIR!\data\" /E /I /Q >nul 2>nul
    echo   已备份 data/
)
echo.

:: --- 解压覆盖 ---
echo [1/3] 解压 %PACKAGE_NAME% (覆盖现有文件)...
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

:: --- 还原 data/ 运行时数据 (解压包不应覆盖数据库，但保险起见) ---
if exist "!BACKUP_DIR!\data" (
    if not exist "%SCRIPT_DIR%data" mkdir "%SCRIPT_DIR%data"
    if exist "!BACKUP_DIR!\data\database.db" (
        copy /Y "!BACKUP_DIR!\data\database.db" "%SCRIPT_DIR%data\" >nul 2>nul
    )
    for %%d in (1 100 def) do (
        if exist "!BACKUP_DIR!\data\%%d" (
            xcopy "!BACKUP_DIR!\data\%%d" "%SCRIPT_DIR%data\%%d\" /E /I /Q >nul 2>nul
        )
    )
    echo   data/ 运行时数据已从备份还原
)
echo.

:: --- 同步依赖 (更新可能引入新包，确保原生模块匹配平台) ---
echo [2/3] 同步依赖...
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

:: --- 重启服务 ---
echo [3/3] 重启服务...
echo.

mkdir "%PID_DIR%" 2>nul

:: 停止旧服务 (基于 PID 文件，避免误杀其他 node 进程)
call :stop_old_services

:: 启动 Web 服务器
echo [INFO] 启动 Web 服务器 (http://localhost:8088)...
if not exist "%SCRIPT_DIR%log" mkdir "%SCRIPT_DIR%log"
for /f %%i in ('powershell -NoProfile -Command "(Start-Process -FilePath 'node' -ArgumentList 'web.js' -WorkingDirectory '%SCRIPT_DIR%' -RedirectStandardOutput 'log\web.log' -RedirectStandardError 'log\web.err' -WindowStyle Hidden -PassThru).Id"') do set "WEB_PID=%%i"
if defined WEB_PID (
    echo !WEB_PID!> "%PID_DIR%\web.pid"
    echo   Web PID: !WEB_PID!
) else (
    echo [WARN] Web 服务器 PID 获取失败
)

:: 启动游戏服务器
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
echo   [OK] 更新完成，服务已重启
echo   Web 服务器: http://localhost:8088
echo   日志文件:   %SCRIPT_DIR%log\
echo   PID 文件:   %PID_DIR%\
echo.
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
