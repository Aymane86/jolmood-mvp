# Script de verification des ports des bases de donnees Jolmood MVP (PowerShell)
# Usage: .\check-db-ports.ps1

Write-Host "Verification des ports des bases de donnees Jolmood MVP" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# Fonction pour vérifier un port
function Test-Port {
    param(
        [int]$Port,
        [string]$Service,
        [string]$Database
    )
    
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("localhost", $Port)
        $connection.Close()
        Write-Host "OK Port $Port ($Service - $Database) : OUVERT" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "ERREUR Port $Port ($Service - $Database) : FERME" -ForegroundColor Red
        return $false
    }
}

# Vérifier chaque port
Write-Host ""
Write-Host "Verification des ports :" -ForegroundColor Yellow
Write-Host "---------------------------" -ForegroundColor Yellow

Test-Port -Port 5433 -Service "Auth Service" -Database "auth_db"
Test-Port -Port 5434 -Service "User Service" -Database "user_db"
Test-Port -Port 5435 -Service "Post Service" -Database "post_db"
Test-Port -Port 5436 -Service "Appointment Service" -Database "appointment_db"
Test-Port -Port 5437 -Service "Admin Service" -Database "admin_db"

Write-Host ""
Write-Host "Verification des conteneurs Docker :" -ForegroundColor Yellow
Write-Host "---------------------------------------" -ForegroundColor Yellow

# Vérifier les conteneurs
$containers = @("db_auth", "db_user", "db_post", "db_app", "db_admin")

foreach ($container in $containers) {
    $running = docker ps --format "table {{.Names}}" | Select-String $container
    if ($running) {
        Write-Host "OK Conteneur $container : EN COURS D'EXECUTION" -ForegroundColor Green
    } else {
        Write-Host "ERREUR Conteneur $container : ARRETE" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Informations de connexion DBeaver :" -ForegroundColor Yellow
Write-Host "--------------------------------------" -ForegroundColor Yellow

Write-Host "Auth DB:" -ForegroundColor Magenta
Write-Host "  Hôte: localhost"
Write-Host "  Port: 5433"
Write-Host "  Base: auth_db"
Write-Host "  Utilisateur: auth_user"
Write-Host "  Mot de passe: auth_pass"
Write-Host ""

Write-Host "User DB:" -ForegroundColor Magenta
Write-Host "  Hôte: localhost"
Write-Host "  Port: 5434"
Write-Host "  Base: user_db"
Write-Host "  Utilisateur: user_user"
Write-Host "  Mot de passe: user_pass"
Write-Host ""

Write-Host "Post DB:" -ForegroundColor Magenta
Write-Host "  Hôte: localhost"
Write-Host "  Port: 5435"
Write-Host "  Base: post_db"
Write-Host "  Utilisateur: post_user"
Write-Host "  Mot de passe: post_pass"
Write-Host ""

Write-Host "Appointment DB:" -ForegroundColor Magenta
Write-Host "  Hôte: localhost"
Write-Host "  Port: 5436"
Write-Host "  Base: appointment_db"
Write-Host "  Utilisateur: app_user"
Write-Host "  Mot de passe: app_pass"
Write-Host ""

Write-Host "Admin DB:" -ForegroundColor Magenta
Write-Host "  Hôte: localhost"
Write-Host "  Port: 5437"
Write-Host "  Base: admin_db"
Write-Host "  Utilisateur: admin_user"
Write-Host "  Mot de passe: admin_pass"
Write-Host ""

Write-Host "Prochaines etapes :" -ForegroundColor Cyan
Write-Host "1. Ouvrir DBeaver"
Write-Host "2. Creer les connexions selon les informations ci-dessus"
Write-Host "3. Tester chaque connexion"
Write-Host "4. Commencer a explorer vos donnees !"

Write-Host ""
Write-Host "Documentation complete disponible dans : DBeaver-Setup-Guide.md" -ForegroundColor Yellow





