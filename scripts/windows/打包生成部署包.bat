@echo off
setlocal enabledelayedexpansion
:: ==============================================
::   ����״β�����Դ�� (Windows)
::   ���� -> ���� -> ��� -> fast_start.tar
:: ==============================================

set "SCRIPT_DIR=%~dp0"
set "PROJECT_ROOT=%~dp0..\.."
set "OUTPUT_DIR=%SCRIPT_DIR%"
set "PACKAGE_NAME=fast_start.tar"

echo ============================================
echo   ����״β�����Դ�� (Windows)
echo   ���: %PACKAGE_NAME%
echo ============================================
echo.

:: --- ��� Node.js ---
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] δ�ҵ� Node.js�����Ȱ�װ Node.js 18+
    pause
    exit /b 1
)
echo [INFO] Node.js
node -v

:: --- 0. �л�����Ŀ�� ---
cd /d "%PROJECT_ROOT%"
if not exist "package.json" (
    echo [ERROR] δ�ҵ� package.json����ȷ�� PROJECT_ROOT ·����ȷ
    pause
    exit /b 1
)

:: --- 1. ��װ���� ---
echo.
echo [1/5] ��װ����...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] ������װʧ�ܣ�
    pause
    exit /b %errorlevel%
)
echo.

:: --- 2. ���� TypeScript ---
echo [2/5] ���� TypeScript...
cd /d "%PROJECT_ROOT%\server"
if exist dist rmdir /s /q dist
call npx tsc --outDir dist
if %errorlevel% neq 0 (
    echo [WARN] �������ʹ���JS �������������...
)
cd /d "%PROJECT_ROOT%"
echo.

:: --- 3. ���в��� ---
echo [3/5] ���в��� (core/ res/ 保持原名)...
node server\scripts\deploy.mjs
if %errorlevel% neq 0 (
    echo [ERROR] ����ʧ�ܣ�
    pause
    exit /b %errorlevel%
)
echo.

:: --- 4. ����ǰ�� ---
echo [4/5] ����ǰ��...
call npx vite build
if %errorlevel% neq 0 (
    echo [ERROR] ǰ�˹���ʧ�ܣ�
    pause
    exit /b %errorlevel%
)
echo.

:: --- 5. ��� ---
echo [5/5] ��� %PACKAGE_NAME% ...
cd /d "%PROJECT_ROOT%"

:: �����ɰ�
if exist "%OUTPUT_DIR%%PACKAGE_NAME%" del "%OUTPUT_DIR%%PACKAGE_NAME%"

:: ע��: ����� node_modules/ (better-sqlite3 ��ԭ��ģ�飬����Ŀ������ϱ���)
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
    --exclude="log" ^
    --exclude="auto_test" ^
    --exclude="tools" ^
    --exclude="old" ^
    --exclude="server" ^
    --exclude="scripts" ^
    --exclude="node_modules" ^
    --exclude=".env" ^
    --exclude="*.tar" ^
    2>nul

if %errorlevel% neq 0 (
    echo [ERROR] ���ʧ�ܣ�
    pause
    exit /b %errorlevel%
)

echo.
echo ============================================
echo   [OK] ������
echo   %OUTPUT_DIR%%PACKAGE_NAME%
echo.
echo   ע��: ���� node_modules/ (better-sqlite3 ��ԭ��ģ��)
echo   Ŀ���������߱� Node.js + ���빤��
echo.
echo   ���𷽷���
echo   1. �� fast_start.tar �� windows\�Զ�����.bat
echo      һͬ���Ƶ�������Ŀ��Ŀ¼
echo   2. �ڷ�����������: �Զ�����.bat
echo ============================================
pause
