@echo off
REM Script para exportar datos del dataset local a archivos NDJSON
REM Este script exporta todos los tipos de documentos para importarlos luego en producción

setlocal enabledelayedexpansion

REM Nombre del dataset local (ajusta según tu configuración)
set LOCAL_DATASET=%1
if "%LOCAL_DATASET%"=="" set LOCAL_DATASET=development

REM Nombre del directorio de exportación
set EXPORT_DIR=exported-local

echo.
echo ╔════════════════════════════════════════════════════╗
echo ║   Exportar Datos de Sanity a Archivos NDJSON      ║
echo ╚════════════════════════════════════════════════════╝
echo.

REM Verificar que Sanity CLI esté instalado
where sanity >nul 2>nul
if errorlevel 1 (
    echo [ERROR] Sanity CLI no está instalado.
    echo Por favor instálalo con: npm install -g @sanity/cli
    exit /b 1
)

REM Crear directorio de exportación
if not exist "%EXPORT_DIR%" (
    mkdir "%EXPORT_DIR%"
    echo [INFO] Directorio creado: %EXPORT_DIR%
)

echo Dataset local: %LOCAL_DATASET%
echo Directorio de exportación: %EXPORT_DIR%
echo.

REM Confirmar antes de proceder
set /p CONFIRM="¿Continuar con la exportación? [s/N]: "
if /i not "%CONFIRM%"=="s" (
    echo Exportación cancelada.
    exit /b 0
)

echo.
echo Iniciando exportación...
echo.

REM Función para exportar un tipo específico usando GROQ
REM Nota: Sanity CLI no tiene un comando directo para exportar por tipo,
REM así que necesitarás usar la API o Vision tool manualmente.
REM Este script te guiará a través del proceso.

echo [INFO] El comando 'sanity dataset export' exporta TODO el dataset.
echo [INFO] Para exportar tipos específicos, usa la herramienta Vision en Studio.
echo.
echo Opciones:
echo 1. Exportar TODO el dataset local
echo 2. Exportar tipos específicos manualmente
echo.
set /p OPTION="Selecciona una opción (1 o 2): "

if "%OPTION%"=="1" (
    echo.
    echo [EXPORTANDO] Exportando todo el dataset '%LOCAL_DATASET%'...
    sanity dataset export %LOCAL_DATASET% --output-dir "%EXPORT_DIR%"
    if errorlevel 1 (
        echo [ERROR] Error al exportar el dataset
        exit /b 1
    )
    echo.
    echo [SUCCESS] Exportación completada en: %EXPORT_DIR%
) else if "%OPTION%"=="2" (
    echo.
    echo [INSTRUCCIONES] Para exportar tipos específicos:
    echo.
    echo 1. Inicia tu servidor: npm run dev
    echo 2. Ve a Sanity Studio: http://localhost:3000/studio
    echo 3. Abre la pestaña "Vision"
    echo 4. Ejecuta queries GROQ para cada tipo:
    echo.
    echo    *[_type == "skill"]
    echo    *[_type == "experience"]
    echo    *[_type == "project"]
    echo    *[_id == "singleton-profile"]
    echo    etc...
    echo.
    echo 5. Copia los resultados JSON y guárdalos como archivos .ndjson
    echo 6. Coloca los archivos en el directorio: %EXPORT_DIR%
    echo.
    echo Luego puedes importarlos con:
    echo   sanity dataset import %EXPORT_DIR%\nombre-archivo.ndjson production --replace
    echo.
) else (
    echo [ERROR] Opción inválida
    exit /b 1
)

echo.
echo ╔════════════════════════════════════════════════════╗
echo ║   ✓ Exportación Completada                         ║
echo ╚════════════════════════════════════════════════════╝
echo.
echo Próximos pasos:
echo   1. Si exportaste todo, el archivo está en: %EXPORT_DIR%\data.ndjson
echo   2. Para importar a producción:
echo      sanity dataset import %EXPORT_DIR%\data.ndjson production --replace
echo   3. O si exportaste tipos específicos, importa cada archivo:
echo      sanity dataset import %EXPORT_DIR%\skills.ndjson production --replace
echo      sanity dataset import %EXPORT_DIR%\profile.ndjson production --replace
echo      etc...
echo.
echo ¡Éxito! 🚀
