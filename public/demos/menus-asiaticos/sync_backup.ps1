# Script de Sincronización a Respaldo Disco D
$source = "C:\Users\PC\.gemini\antigravity\scratch\asian_restaurant_menus"
$destination = "D:\Backups\asian_restaurant_menus"

if (-not (Test-Path $destination)) {
    New-Item -ItemType Directory -Force -Path $destination | Out-Null
}

Copy-Item -Path "$source\*" -Destination $destination -Recurse -Force
Write-Host "✅ Respaldo sincronizado correctamente hacia D:\Backups\asian_restaurant_menus"
