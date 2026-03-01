@echo off
echo ==========================================
echo   Desplegando Nomad Mats con Metricas
echo ==========================================
cd /d "d:\Antigravity Projects\nomad-mats-web"
cmd /c npx vercel --prod
pause
