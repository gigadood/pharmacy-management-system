@echo off
cd /d "%~dp0web"
if not exist .env (
    copy .env.example .env >nul
    echo Open web\.env and enter your standalone MySQL port and password.
    echo Then run this launcher again.
    notepad .env
    pause
    exit /b
)
where py >nul 2>nul
if errorlevel 1 (
    set "PHARMACY_PYTHON=python"
) else (
    set "PHARMACY_PYTHON=py -3"
)
if not exist .venv\Scripts\python.exe (
    %PHARMACY_PYTHON% -m venv .venv
    if errorlevel 1 goto failed
)
.venv\Scripts\python.exe -m pip install -r requirements.txt
if errorlevel 1 goto failed
.venv\Scripts\python.exe check_database.py
if errorlevel 1 goto failed
.venv\Scripts\python.exe app.py
pause
exit /b
:failed
echo See the error above. No database records have been changed by setup.
pause
exit /b 1
