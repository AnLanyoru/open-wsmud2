@echo off
setlocal enabledelayedexpansion
:: ==============================================
::   ���������Դ�� (Windows)
::   ���� -> ���� -> ��� -> release.tar (���� node_modules)
:: ==============================================

set "SCRIPT_DIR=%~dp0"
set "PROJECT_ROOT=%~dp0..\.."
set "OUTPUT_DIR=%SCRIPT_DIR%"
set "PACKAGE_NAME=release.tar"

echo ============================================
echo   ���������Դ�� (Windows)
echo   ���: %PACKAGE_NAME% (���� node_modules)
echo ============================================
echo.

:: --- ��� Node.js ---
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] δ�ҵ� Node.js
    pause
    exit /b 1
)

cd /d "%PROJECT_ROOT%"

:: --- 1. ���� TypeScript ---
echo [1/3] ���� TypeScript...
cd /d "%PROJECT_ROOT%\server"
if exist dist rmdir /s /q dist
call npx tsc --outDir dist
if %errorlevel% neq 0 (
    echo [WARN] �������ʹ���JS �������������...
)
cd /d "%PROJECT_ROOT%"
echo.

:: --- 2. ���в��� ---
echo [2/3] ���в��� (core/ res/ 保持原名)...
node server\scripts\deploy.mjs
if %errorlevel% neq 0 (
    echo [ERROR] ����ʧ�ܣ�
    pause
    exit /b %errorlevel%
)
echo.

:: --- 3. ����ǰ�˲���� ---
echo [3/3] ����ǰ�˲���� %PACKAGE_NAME% ...
call npx vite build
if %errorlevel% neq 0 (
    echo [ERROR] ǰ�˹���ʧ�ܣ�
    pause
    exit /b %errorlevel%
)
echo.

:: �����ɰ�
if exist "%OUTPUT_DIR%%PACKAGE_NAME%" del "%OUTPUT_DIR%%PACKAGE_NAME%"

cd /d "%PROJECT_ROOT%"
tar -cf "%OUTPUT_DIR%%PACKAGE_NAME%" ^
    web.js main.mjs config.js ^
    package.json ^
    core/ res/ www/ ^
    api/ web/ data/ ^
    --exclude="*.ts" ^
    --exclude="*.map" ^
    --exclude=".git" ^
    --exclude=".idea" ^
    --exclude=".vscode" ^
    --exclude="log" ^
    --exclude="auto_test" ^
    --exclude="tools" ^
    --exclude="old" ^
    --exclude="server" ^
    --exclude="scripts" ^
    --exclude=".env" ^
    --exclude="*.tar" ^
    2>nul

if %errorlevel% neq 0 (
    echo [ERROR] ���ʧ�ܣ�
    pause
    exit /b %errorlevel%
)

echo ============================================
echo   [OK] ������
echo   %OUTPUT_DIR%%PACKAGE_NAME%
echo.
echo   ���·�����
echo   1. �� release.tar �� windows\�Զ�����.bat
echo      һͬ���Ƶ�����������Ŀ¼
echo   2. �ڷ�����������: �Զ�����.bat
echo ============================================
pause
