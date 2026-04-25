@echo off
setlocal

title Sergio's RealEstate CRM

cd /d "%~dp0"

echo.
echo ==========================================
echo   Sergio's RealEstate CRM Launcher
echo ==========================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js was not found.
  echo Install Node.js LTS from https://nodejs.org/ and run this file again.
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo npm was not found.
  echo Reinstall Node.js LTS from https://nodejs.org/ and run this file again.
  pause
  exit /b 1
)

if not exist ".env.local" (
  echo Creating .env.local...
  (
    echo CRAWL4AI_BASE_URL="http://localhost:11235"
    echo CRAWL4AI_API_TOKEN=
    echo NEXT_PUBLIC_SUPABASE_URL=
    echo NEXT_PUBLIC_SUPABASE_ANON_KEY=
    echo SUPABASE_SERVICE_ROLE_KEY=
    echo RESEND_API_KEY=
    echo EMAIL_FROM="Sergio's RealEstate ^<hello@example.com^>"
  ) > ".env.local"
)

if not exist "node_modules" (
  echo Installing CRM dependencies. This can take a few minutes the first time...
  call npm install
  if errorlevel 1 (
    echo.
    echo npm install failed. Check the error above, then run this file again.
    pause
    exit /b 1
  )
)

where docker >nul 2>nul
if errorlevel 1 (
  echo Docker was not found. The CRM will still run with the basic scraper.
  echo Double-click Install_Docker_For_Sergio_CRM.bat later if you want Crawl4AI advanced scraping.
) else (
  docker info >nul 2>nul
  if errorlevel 1 (
    echo Docker Desktop is not running. The CRM will still run with the basic scraper.
    echo Start Docker Desktop later, then run this launcher again for Crawl4AI.
  ) else (
    docker ps -a --format "{{.Names}}" | findstr /i /x "crawl4ai" >nul 2>nul
    if errorlevel 1 (
      echo Starting a new Crawl4AI container...
      docker run -d -p 11235:11235 --name crawl4ai --shm-size=3g unclecode/crawl4ai:latest
    ) else (
      echo Starting existing Crawl4AI container...
      docker start crawl4ai >nul 2>nul
    )
  )
)

echo.
echo CRM will open at http://localhost:3000
echo Leave this window open while you use Sergio's RealEstate.
echo Press Ctrl+C in this window to stop the CRM.
echo.

start "" "http://localhost:3000"
call npm run dev

pause
