@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion
:: ==============================================
::   打包首次部署资源包 (Windows)
::   编译 -> 部署 -> 打包 -> fast_start.tar
::
::   用法:
::     打包生成部署包.bat              普通编译
::     打包生成部署包.bat --binary     启用二进制协议 (send_room -> send_room_b)
::     打包生成部署包.bat --metrics    注入性能监控埋点 (调试用)
:: ==============================================

set "SCRIPT_DIR=%~dp0"
set "PROJECT_ROOT=%~dp0..\.."
set "OUTPUT_DIR=%SCRIPT_DIR%"
set "PACKAGE_NAME=fast_start.tar"
set "BUILD_FLAGS="

:: --- 解析参数 ---
:parse_args
if "%~1"=="" goto :args_done
if /i "%~1"=="--binary" (
    set "BUILD_FLAGS=--binary"
    shift
    goto :parse_args
)
if /i "%~1"=="--metrics" (
    set "BUILD_FLAGS=%BUILD_FLAGS% --metrics"
    shift
    goto :parse_args
)
if /i "%~1"=="-h" goto :show_help
if /i "%~1"=="--help" goto :show_help
shift
goto :parse_args
:args_done

echo ============================================
echo   打包首次部署资源包 (Windows)
echo   输出: %PACKAGE_NAME%
if defined BUILD_FLAGS echo   构建标志: %BUILD_FLAGS%
echo ============================================
echo.

:: --- 检查 Node.js ---
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] 未找到 Node.js，请先安装 Node.js 24+
    echo   下载: https://nodejs.org/
    pause
    exit /b 1
)
echo [INFO] Node.js
node -v
echo.

:: --- 切换到项目根 ---
cd /d "%PROJECT_ROOT%"
if not exist "package.json" (
    echo [ERROR] 未找到 package.json，请确认 PROJECT_ROOT 路径正确
    pause
    exit /b 1
)

:: --- 1. 安装依赖 ---
echo [1/4] 安装依赖...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] 依赖安装失败！
    pause
    exit /b %errorlevel%
)
echo.

:: --- 2. 运行 pack.mjs (编译 + 部署) ---
echo [2/4] 运行 pack.mjs (编译 + 部署)...
node scripts\pack.mjs %BUILD_FLAGS%
if %errorlevel% neq 0 (
    echo [ERROR] 编译失败！请检查 TypeScript 错误。
    pause
    exit /b %errorlevel%
)
echo.

:: --- 3. 构建前端 ---
echo [3/4] 构建前端...
call npx vite build
if %errorlevel% neq 0 (
    echo [ERROR] 前端构建失败！
    pause
    exit /b %errorlevel%
)
echo.

:: --- 4. 打包 ---
echo [4/4] 打包 %PACKAGE_NAME% ...
cd /d "%PROJECT_ROOT%"

:: 删除旧包
if exist "%OUTPUT_DIR%%PACKAGE_NAME%" del "%OUTPUT_DIR%%PACKAGE_NAME%"

:: 注意: 不打包 node_modules/ (better-sqlite3 是原生模块，需在目标机器编译)
::       不打包 data/ 下的运行时数据 (database.db, 玩家数据)
tar -cf "%OUTPUT_DIR%%PACKAGE_NAME%" ^
    web.js main.mjs config.js ^
    package.json package-lock.json ^
    core/ res/ www/ ^
    api/ web/ data/ ^
    --exclude="*.ts" ^
    --exclude="*.map" ^
    --exclude=".git" ^
    --exclude=".idea" ^
    --exclude=".vscode" ^
    --exclude=".trae" ^
    --exclude=".claude" ^
    --exclude="log" ^
    --exclude="auto_test" ^
    --exclude="bench" ^
    --exclude="tools" ^
    --exclude="old" ^
    --exclude="server" ^
    --exclude="scripts" ^
    --exclude="docs" ^
    --exclude="new_data" ^
    --exclude="web_preview" ^
    --exclude="node_modules" ^
    --exclude=".env" ^
    --exclude="*.tar" ^
    --exclude="data/database.db" ^
    --exclude="data/1" ^
    --exclude="data/100" ^
    --exclude="data/def" ^
    --exclude="backup-*" ^
    2>nul

if %errorlevel% neq 0 (
    echo [ERROR] 打包失败！
    pause
    exit /b %errorlevel%
)

echo.
echo ============================================
echo   [OK] 打包完成
echo   %OUTPUT_DIR%%PACKAGE_NAME%
echo.
echo   注意: 不含 node_modules/ (better-sqlite3 是原生模块)
echo   目标服务器需具备 Node.js 24+ 及编译工具
echo.
echo   部署方法：
echo   1. 将 fast_start.tar 与 windows\自动部署.bat
echo      一同复制到服务器目标目录
echo   2. 在服务器上运行: 自动部署.bat
echo ============================================
pause
exit /b 0

:show_help
echo 用法: 打包生成部署包.bat [--binary] [--metrics]
echo   --binary   启用二进制协议转换 (send_room -> send_room_b)
echo   --metrics  注入性能监控埋点 (调试用)
exit /b 0
