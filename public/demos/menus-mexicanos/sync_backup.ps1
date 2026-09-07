# Script de Sincronización a Respaldo Disco D - Colección Mexicana
$source = "C:\Users\PC\.gemini\antigravity\scratch\mexican_restaurant_menus"
$destination = "D:\Backups\mexican_restaurant_menus"

if (-not (Test-Path $destination)) {
    New-Item -ItemType Directory -Force -Path $destination | Out-Null
}

Copy-Item -Path "$source\*" -Destination $destination -Recurse -Force
Write-Host "✅ Respaldo Mexicano sincronizado correctamente hacia D:\Backups\mexican_restaurant_menus"
