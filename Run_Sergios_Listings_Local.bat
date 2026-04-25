@echo off
setlocal

cd /d "%~dp0"

echo Starting Sergio's Listings locally...
echo.
echo Current local setup:
echo - Google Maps key loaded from .env.local
echo - Supabase publishable key loaded from .env.local
echo - BillionMail still needs BILLIONMAIL_API_URL and BILLIONMAIL_API_KEY
echo - Supabase still needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
echo.

if not exist node_modules (
  echo Installing npm dependencies...
  call npm install
  if errorlevel 1 (
    echo Dependency install failed.
    pause
    exit /b 1
  )
)

echo.
echo Open http://localhost:3000 after the server starts.
echo.

call npm run dev
