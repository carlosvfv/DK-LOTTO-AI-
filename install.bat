@echo off
echo ================================================
echo   INSTALANDO DEPENDENCIAS - Lottery AI Backend
echo ================================================
echo.

REM Verificar si Node.js esta instalado
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js no esta instalado
    echo Por favor, descarga e instala Node.js desde: https://nodejs.org
    pause
    exit /b 1
)

echo Node.js encontrado: 
node --version
echo NPM version:
npm --version
echo.

echo Instalando dependencias...
call npm install express cors axios dotenv cheerio

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ================================================
    echo   INSTALACION COMPLETADA EXITOSAMENTE
    echo ================================================
    echo.
    echo Para iniciar el servidor, ejecuta: start-server.bat
    echo.
) else (
    echo.
    echo ================================================
    echo   ERROR EN LA INSTALACION
    echo ================================================
    echo.
    echo Intenta ejecutar manualmente:
    echo npm install
    echo.
)

pause
