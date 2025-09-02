#!/bin/bash

# Script de vérification des ports des bases de données Jolmood MVP
# Usage: ./check-db-ports.sh

echo "🔍 Vérification des ports des bases de données Jolmood MVP"
echo "=================================================="

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour vérifier un port
check_port() {
    local port=$1
    local service=$2
    local db_name=$3
    
    if nc -z localhost $port 2>/dev/null; then
        echo -e "${GREEN}✅ Port $port ($service - $db_name) : OUVERT${NC}"
        return 0
    else
        echo -e "${RED}❌ Port $port ($service - $db_name) : FERMÉ${NC}"
        return 1
    fi
}

# Vérifier chaque port
echo ""
echo "📊 Vérification des ports :"
echo "---------------------------"

check_port 5433 "Auth Service" "auth_db"
check_port 5434 "User Service" "user_db"
check_port 5435 "Post Service" "post_db"
check_port 5436 "Appointment Service" "appointment_db"
check_port 5437 "Admin Service" "admin_db"

echo ""
echo "🐳 Vérification des conteneurs Docker :"
echo "---------------------------------------"

# Vérifier les conteneurs
containers=("db_auth" "db_user" "db_post" "db_app" "db_admin")

for container in "${containers[@]}"; do
    if docker ps --format "table {{.Names}}" | grep -q "$container"; then
        echo -e "${GREEN}✅ Conteneur $container : EN COURS D'EXÉCUTION${NC}"
    else
        echo -e "${RED}❌ Conteneur $container : ARRÊTÉ${NC}"
    fi
done

echo ""
echo "🔗 Informations de connexion DBeaver :"
echo "--------------------------------------"

echo -e "${YELLOW}Auth DB:${NC}"
echo "  Hôte: localhost"
echo "  Port: 5433"
echo "  Base: auth_db"
echo "  Utilisateur: auth_user"
echo "  Mot de passe: auth_pass"
echo ""

echo -e "${YELLOW}User DB:${NC}"
echo "  Hôte: localhost"
echo "  Port: 5434"
echo "  Base: user_db"
echo "  Utilisateur: user_user"
echo "  Mot de passe: user_pass"
echo ""

echo -e "${YELLOW}Post DB:${NC}"
echo "  Hôte: localhost"
echo "  Port: 5435"
echo "  Base: post_db"
echo "  Utilisateur: post_user"
echo "  Mot de passe: post_pass"
echo ""

echo -e "${YELLOW}Appointment DB:${NC}"
echo "  Hôte: localhost"
echo "  Port: 5436"
echo "  Base: appointment_db"
echo "  Utilisateur: app_user"
echo "  Mot de passe: app_pass"
echo ""

echo -e "${YELLOW}Admin DB:${NC}"
echo "  Hôte: localhost"
echo "  Port: 5437"
echo "  Base: admin_db"
echo "  Utilisateur: admin_user"
echo "  Mot de passe: admin_pass"
echo ""

echo "🚀 Prochaines étapes :"
echo "1. Ouvrir DBeaver"
echo "2. Créer les connexions selon les informations ci-dessus"
echo "3. Tester chaque connexion"
echo "4. Commencer à explorer vos données !"

echo ""
echo "📚 Documentation complète disponible dans : DBeaver-Setup-Guide.md"





