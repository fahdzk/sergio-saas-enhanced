@echo off
setlocal

title Sergio's RealEstate - Twenty CRM

cd /d "%~dp0"

echo.
echo ==========================================
echo   Sergio's RealEstate on Twenty CRM
echo ==========================================
echo.

where docker >nul 2>nul
if errorlevel 1 (
  echo Docker was not found.
  echo Run ..\Install_Docker_For_Sergio_CRM.bat first, then open Docker Desktop.
  pause
  exit /b 1
)

docker info >nul 2>nul
if errorlevel 1 (
  echo Docker Desktop is installed but not running.
  echo Open Docker Desktop, wait until it says it is running, then run this file again.
  pause
  exit /b 1
)

if not exist ".env" (
  echo Creating Twenty .env...
  copy ".env.example" ".env" >nul
  powershell -NoProfile -ExecutionPolicy Bypass -Command "$secret=[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 })); (Get-Content '.env') -replace '^APP_SECRET=.*', ('APP_SECRET=' + $secret) | Set-Content '.env'"
)

powershell -NoProfile -ExecutionPolicy Bypass -Command "$envPath='.env'; $envText=Get-Content $envPath -Raw; if ($envText -notmatch '(?m)^STORAGE_TYPE=') { Add-Content $envPath 'STORAGE_TYPE=local' }; if ($envText -notmatch '(?m)^STORAGE_S3_REGION=') { Add-Content $envPath 'STORAGE_S3_REGION=' }; if ($envText -notmatch '(?m)^STORAGE_S3_NAME=') { Add-Content $envPath 'STORAGE_S3_NAME=' }; if ($envText -notmatch '(?m)^STORAGE_S3_ENDPOINT=') { Add-Content $envPath 'STORAGE_S3_ENDPOINT=' }; if ($envText -notmatch '(?m)^DISABLE_DB_MIGRATIONS=') { Add-Content $envPath 'DISABLE_DB_MIGRATIONS=false' }; if ($envText -notmatch '(?m)^DISABLE_CRON_JOBS_REGISTRATION=') { Add-Content $envPath 'DISABLE_CRON_JOBS_REGISTRATION=false' }"

if not exist "docker-compose.yml" (
  echo Downloading official Twenty Docker Compose file...
  powershell -NoProfile -ExecutionPolicy Bypass -Command "Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/twentyhq/twenty/refs/heads/main/packages/twenty-docker/docker-compose.yml' -OutFile 'docker-compose.yml'"
  if errorlevel 1 (
    echo Could not download the official Twenty docker-compose.yml.
    pause
    exit /b 1
  )
)

powershell -NoProfile -ExecutionPolicy Bypass -Command "$compose='docker-compose.yml'; $text=Get-Content $compose -Raw; $text=$text -replace '""3000:3000""','""${TWENTY_PORT:-3005}:3000""'; Set-Content $compose $text"

echo Starting Crawl4AI for public profile extraction...
docker inspect crawl4ai >nul 2>nul
if errorlevel 1 (
  docker run -d -p 11235:11235 --name crawl4ai --shm-size=3g unclecode/crawl4ai:latest
) else (
  docker start crawl4ai >nul 2>nul
)

echo.
echo Starting Twenty CRM...
docker compose up -d
if errorlevel 1 (
  echo Docker Compose could not start Twenty. Check the error above.
  pause
  exit /b 1
)

echo.
echo Twenty CRM is starting at http://localhost:3005
echo It can take a minute the first time while the database initializes.
echo.
start "" "http://localhost:3005"
docker compose ps
echo.
pause
