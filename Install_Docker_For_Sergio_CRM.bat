@echo off
setlocal

title Install Docker Desktop for Sergio's RealEstate CRM

cd /d "%~dp0"

set "TOOLS_DIR=%~dp0tools"
set "INSTALLER=%TOOLS_DIR%\Docker Desktop Installer.exe"

echo.
echo ==========================================
echo   Docker Desktop Installer Helper
echo   Windows 11 Pro / Intel AMD64 Version
echo ==========================================
echo.

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$os = Get-CimInstance Win32_OperatingSystem; " ^
  "$cpu = Get-CimInstance Win32_Processor | Select-Object -First 1; " ^
  "$ramGb = [math]::Round($os.TotalVisibleMemorySize / 1MB, 1); " ^
  "Write-Host ('Windows: ' + $os.Caption + ' build ' + $os.BuildNumber); " ^
  "Write-Host ('CPU: ' + $cpu.Name); " ^
  "Write-Host ('RAM: ' + $ramGb + ' GB'); " ^
  "Write-Host ('64-bit OS: ' + [Environment]::Is64BitOperatingSystem); " ^
  "if (-not [Environment]::Is64BitOperatingSystem) { exit 20 }; " ^
  "if ($env:PROCESSOR_ARCHITECTURE -match 'ARM') { exit 21 }; " ^
  "if ($ramGb -lt 7.5) { exit 22 }"

if errorlevel 22 (
  echo.
  echo Docker Desktop needs about 8GB RAM minimum. This laptop reports less than that.
  pause
  exit /b 1
)

if errorlevel 21 (
  echo.
  echo This helper is for Intel/AMD Windows laptops only.
  echo Your machine looks like ARM, so do not use the AMD64 installer.
  pause
  exit /b 1
)

if errorlevel 20 (
  echo.
  echo Docker Desktop requires 64-bit Windows.
  pause
  exit /b 1
)

echo.
echo This will download Docker Desktop for Windows - x86_64 / AMD64.
echo This is the right installer for Windows 11 Pro on an Intel i5 laptop.
echo.
echo The installer will be saved here:
echo %INSTALLER%
echo.
echo Docker Desktop itself installs as a Windows app.
echo It may ask for Administrator permission and may ask you to restart.
echo.

if not exist "%TOOLS_DIR%" mkdir "%TOOLS_DIR%"

if exist "%INSTALLER%" (
  echo Installer already exists. Skipping download.
) else (
  echo Downloading official Docker Desktop AMD64 installer...
  powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "$url = 'https://desktop.docker.com/win/main/amd64/Docker%%20Desktop%%20Installer.exe'; " ^
    "$out = '%INSTALLER%'; " ^
    "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; " ^
    "Invoke-WebRequest -Uri $url -OutFile $out; " ^
    "$file = Get-Item $out; " ^
    "if ($file.Length -lt 100MB) { throw 'Downloaded file is too small. The download may be broken.' }; " ^
    "Write-Host ('Downloaded: ' + [math]::Round($file.Length / 1MB, 1) + ' MB')"

  if errorlevel 1 (
    echo.
    echo Download failed or the installer looked incomplete.
    echo Manual official download page:
    echo https://docs.docker.com/desktop/setup/install/windows-install/
    pause
    exit /b 1
  )
)

echo.
echo Launching Docker Desktop Installer...
echo When asked, use the WSL 2 backend.
echo.

start "" "%INSTALLER%"

echo After installation:
echo 1. Restart Windows if Docker asks.
echo 2. Open Docker Desktop from the Start menu.
echo 3. Accept Docker's terms.
echo 4. Wait until Docker says it is running.
echo 5. Double-click twenty-sergio\Start_Twenty_Sergio_CRM.bat.
echo.
pause
