@echo off
echo 🚀 PREPARANDO DESPLIEGUE LIMPIO (SIN ERRORES DE GIT)...
echo.

:: 1. Crear carpeta temporal
if exist ..\nomad_deploy_tmp rd /s /q ..\nomad_deploy_tmp
mkdir ..\nomad_deploy_tmp

:: 2. Copiar archivos necesarios (sin .git ni .vercel)
echo 📦 Copiando archivos...
xcopy /E /I /Y "app" "..\nomad_deploy_tmp\app" > nul
xcopy /E /I /Y "lib" "..\nomad_deploy_tmp\lib" > nul
xcopy /E /I /Y "public" "..\nomad_deploy_tmp\public" > nul
copy "package.json" "..\nomad_deploy_tmp\" > nul
copy "package-lock.json" "..\nomad_deploy_tmp\" > nul
copy "next.config.ts" "..\nomad_deploy_tmp\" > nul
copy "tsconfig.json" "..\nomad_deploy_tmp\" > nul
copy "postcss.config.mjs" "..\nomad_deploy_tmp\" > nul
copy "eslint.config.mjs" "..\nomad_deploy_tmp\" > nul

:: 3. Ir a la carpeta y desplegar
cd /d "..\nomad_deploy_tmp"
echo.
echo 🚀 LANZANDO VERCEL...
echo (Si te pregunta algo, selecciona tu cuenta personal jrfallas-6570)
echo.
call npx vercel --prod

echo.
echo ✅ Proceso terminado.
pause
