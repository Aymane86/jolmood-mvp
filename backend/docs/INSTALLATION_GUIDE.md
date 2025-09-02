# 🛠️ Guide d'Installation - Jolmood MVP Backend

## 📋 Prérequis Système

### Obligatoires

✅ **Docker Desktop**
- **Windows** : Docker Desktop avec WSL2 activé
- **macOS** : Docker Desktop (Intel ou Apple Silicon)
- **Linux** : Docker Engine + Docker Compose

✅ **Git**
- Pour cloner le repository
- Configuration recommandée avec SSH

### Optionnels (pour le développement)

🔧 **Node.js 18+**
- Pour le frontend mobile (plus tard)
- Gestionnaire de paquets : npm ou yarn

🔧 **Postman**
- Tests API complets
- Import des collections pré-configurées

🔧 **DBeaver / pgAdmin**
- Interface graphique pour PostgreSQL
- Inspection et gestion des bases de données

## 🚀 Installation Rapide

### 1. Cloner le Repository

```bash
# HTTPS
git clone https://github.com/<VOTRE_USERNAME>/jolmood-mvp.git
cd jolmood-mvp

# SSH (recommandé)
git clone git@github.com:<VOTRE_USERNAME>/jolmood-mvp.git
cd jolmood-mvp
```

### 2. Configuration Environnement

```bash
cd backend

# Copier et éditer le fichier d'environnement
cp .env.example .env  # Si disponible
# OU créer manuellement (voir section suivante)
```

**Créer le fichier `.env` :**

<details>
<summary><strong>🐧 Linux/macOS (bash)</strong></summary>

```bash
cat > .env << 'EOF'
# JWT Configuration
JWT_SECRET=supersecret_jolmood_mvp_change_in_production
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# PostgreSQL Databases
AUTH_DB_URL=postgresql://auth_user:auth_pass@db_auth:5432/auth_db
USER_DB_URL=postgresql://user_user:user_pass@db_user:5432/user_db
POST_DB_URL=postgresql://post_user:post_pass@db_post:5432/post_db
APP_DB_URL=postgresql://app_user:app_pass@db_app:5432/appointment_db
ADMIN_DB_URL=postgresql://admin_user:admin_pass@db_admin:5432/admin_db

# MongoDB Configuration
MONGO_URL=mongodb://mongo:27017
MONGO_DB=jolmood_media

# CORS Configuration
CORS_ORIGINS=http://localhost:19006,http://localhost:8080,http://localhost:3000

# Media Service Configuration
MAX_FILE_SIZE=10485760
ALLOWED_EXTENSIONS=jpg,jpeg,png,gif,pdf,mp4,mov
UPLOAD_PATH=/app/uploads

# Admin Configuration
ADMIN_EMAIL=admin@jolmood.com
ADMIN_PASSWORD=admin123_change_in_production

# Development Settings
DEBUG=true
ENVIRONMENT=development
LOG_LEVEL=INFO
EOF
```

</details>

<details>
<summary><strong>🪟 Windows PowerShell</strong></summary>

```powershell
@'
# JWT Configuration
JWT_SECRET=supersecret_jolmood_mvp_change_in_production
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# PostgreSQL Databases
AUTH_DB_URL=postgresql://auth_user:auth_pass@db_auth:5432/auth_db
USER_DB_URL=postgresql://user_user:user_pass@db_user:5432/user_db
POST_DB_URL=postgresql://post_user:post_pass@db_post:5432/post_db
APP_DB_URL=postgresql://app_user:app_pass@db_app:5432/appointment_db
ADMIN_DB_URL=postgresql://admin_user:admin_pass@db_admin:5432/admin_db

# MongoDB Configuration
MONGO_URL=mongodb://mongo:27017
MONGO_DB=jolmood_media

# CORS Configuration
CORS_ORIGINS=http://localhost:19006,http://localhost:8080,http://localhost:3000

# Media Service Configuration
MAX_FILE_SIZE=10485760
ALLOWED_EXTENSIONS=jpg,jpeg,png,gif,pdf,mp4,mov
UPLOAD_PATH=/app/uploads

# Admin Configuration
ADMIN_EMAIL=admin@jolmood.com
ADMIN_PASSWORD=admin123_change_in_production

# Development Settings
DEBUG=true
ENVIRONMENT=development
LOG_LEVEL=INFO
'@ | Set-Content -Encoding utf8 .env
```

</details>

### 3. Vérification de la Configuration

```bash
# Vérifier que Docker Compose peut lire la configuration
docker compose --env-file .env config

# Si pas d'erreur, la configuration est valide ✅
```

### 4. Démarrage des Services

```bash
# Construction et démarrage de tous les services
docker compose up -d --build

# Vérifier que tous les services sont démarrés
docker compose ps
```

**Résultat attendu :**
```
NAME                    IMAGE                     COMMAND                  SERVICE           CREATED          STATUS                    PORTS
backend-admin-service   backend-admin-service     "uvicorn main:app --…"   admin-service     30 seconds ago   Up 29 seconds             5005/tcp
backend-auth-service    backend-auth-service      "uvicorn main:app --…"   auth-service      30 seconds ago   Up 29 seconds             5001/tcp
backend-db-admin        postgres:15-alpine        "docker-entrypoint.s…"   db_admin          30 seconds ago   Up 29 seconds             5432/tcp
backend-db-app          postgres:15-alpine        "docker-entrypoint.s…"   db_app            30 seconds ago   Up 29 seconds             5432/tcp
backend-db-auth         postgres:15-alpine        "docker-entrypoint.s…"   db_auth           30 seconds ago   Up 29 seconds             5432/tcp
backend-db-post         postgres:15-alpine        "docker-entrypoint.s…"   db_post           30 seconds ago   Up 29 seconds             5432/tcp
backend-db-user         postgres:15-alpine        "docker-entrypoint.s…"   db_user           30 seconds ago   Up 29 seconds             5432/tcp
backend-gateway         nginx:alpine              "/docker-entrypoint.…"   gateway           30 seconds ago   Up 29 seconds             0.0.0.0:8080->80/tcp
backend-media-service   backend-media-service     "uvicorn main:app --…"   media-service     30 seconds ago   Up 29 seconds             8000/tcp
backend-mongo           mongo:latest              "docker-entrypoint.s…"   mongo             30 seconds ago   Up 29 seconds             27017/tcp
backend-mongo-express   mongo-express             "tini -- /docker-ent…"   mongo-express     30 seconds ago   Up 29 seconds             0.0.0.0:8081->8081/tcp
backend-post-service    backend-post-service      "uvicorn main:app --…"   post-service      30 seconds ago   Up 29 seconds             5003/tcp
backend-user-service    backend-user-service      "uvicorn main:app --…"   user-service      30 seconds ago   Up 29 seconds             5002/tcp
```

### 5. Test de Santé

```bash
# Test du gateway principal
curl http://localhost:8080/health

# OU avec PowerShell
Invoke-RestMethod -Uri "http://localhost:8080/health"
```

**Réponse attendue :**
```json
{
  "status": "healthy",
  "services": {
    "gateway": "running",
    "auth": "healthy",
    "user": "healthy",
    "post": "healthy",
    "appointment": "healthy",
    "admin": "healthy",
    "media": "healthy"
  },
  "timestamp": "2025-01-08T10:30:00Z"
}
```

## 📊 Vérification des Services

### Logs en Temps Réel

```bash
# Tous les services
docker compose logs -f

# Service spécifique
docker compose logs -f gateway
docker compose logs -f auth-service

# Dernières 50 lignes
docker compose logs --tail=50 gateway
```

### Santé Individuelle des Services

| Service | URL de test | Réponse attendue |
|---------|-------------|------------------|
| **Gateway** | `http://localhost:8080/health` | `{"status": "healthy"}` |
| **Auth** | `http://localhost:8080/auth/health` | `{"service": "auth-service"}` |
| **Users** | `http://localhost:8080/users/health` | `{"service": "user-service"}` |
| **Posts** | `http://localhost:8080/posts/health` | `{"service": "post-service"}` |
| **Appointments** | `http://localhost:8080/appointments/health` | `{"service": "appointment-service"}` |
| **Admin** | `http://localhost:8080/admin/health` | `{"service": "admin-service"}` |
| **Mongo Express** | `http://localhost:8081` | Interface web MongoDB |

## 🗄️ Gestion des Bases de Données

### Migrations Automatiques

Les bases de données sont créées automatiquement au premier démarrage. Si des migrations SQL spécifiques sont nécessaires :

```bash
# Exemple pour post-service (si migration media_id existe)
docker compose exec post-service python -c "
from database import engine
from sqlalchemy import text
with engine.connect() as conn:
    conn.execute(text('ALTER TABLE posts ADD COLUMN IF NOT EXISTS media_id VARCHAR;'))
    conn.commit()
"
```

### Accès Direct aux Bases

**PostgreSQL :**
```bash
# Auth DB
docker compose exec db_auth psql -U auth_user -d auth_db

# User DB
docker compose exec db_user psql -U user_user -d user_db

# Lister les tables
\dt

# Quitter
\q
```

**MongoDB :**
```bash
# Via mongo shell
docker compose exec mongo mongosh

# Utiliser la base jolmood_media
use jolmood_media

# Lister les collections
show collections

# Quitter
exit
```

**Interface Web MongoDB :**
- URL : http://localhost:8081
- Aucun login requis en développement

## 🔧 Commandes de Maintenance

### Redémarrage des Services

```bash
# Redémarrer un service spécifique
docker compose restart auth-service

# Redémarrer tous les services
docker compose restart

# Reconstruire et redémarrer
docker compose up -d --build --force-recreate
```

### Arrêt Propre

```bash
# Arrêt de tous les services
docker compose down

# Arrêt avec suppression des volumes (⚠️ perte de données)
docker compose down -v

# Arrêt avec suppression des images
docker compose down --rmi all
```

### Nettoyage Complet

<details>
<summary><strong>🐧 Linux/macOS</strong></summary>

```bash
# Arrêter et supprimer tout
docker compose down -v

# Supprimer les volumes spécifiques du projet
docker volume ls | grep backend | awk '{print $2}' | xargs -I{} docker volume rm {}

# Nettoyer les images non utilisées
docker image prune -f

# Nettoyer complètement Docker (⚠️ affecte tous les projets)
docker system prune -af --volumes
```

</details>

<details>
<summary><strong>🪟 Windows PowerShell</strong></summary>

```powershell
# Arrêter et supprimer tout
docker compose down -v

# Supprimer les volumes spécifiques du projet
docker volume ls --filter "name=backend" --format "{{.Name}}" | ForEach-Object { docker volume rm $_ }

# Nettoyer les images non utilisées
docker image prune -f

# Nettoyer complètement Docker (⚠️ affecte tous les projets)
docker system prune -af --volumes
```

</details>

## 🧪 Tests d'Intégration

### Test Complet du Workflow

```bash
# 1. Démarrer les services
docker compose up -d

# 2. Attendre que tous les services soient prêts
sleep 30

# 3. Test d'authentification
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123","role":"user"}'

# 4. Test de login
TOKEN=$(curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123"}' \
  | jq -r '.access_token')

# 5. Test d'accès protégé
curl -H "Authorization: Bearer $TOKEN" http://localhost:8080/auth/me

# 6. Test de création de post
curl -X POST http://localhost:8080/posts/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content":"Mon premier post!","is_public":true}'
```

### PowerShell Equivalent

```powershell
# Test d'authentification
$registerResponse = Invoke-RestMethod -Uri "http://localhost:8080/auth/register" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"test@example.com","password":"testpass123","role":"user"}'

# Test de login
$loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"test@example.com","password":"testpass123"}'

$token = $loginResponse.access_token

# Test d'accès protégé
$headers = @{ "Authorization" = "Bearer $token" }
$userInfo = Invoke-RestMethod -Uri "http://localhost:8080/auth/me" -Headers $headers

Write-Output "User info: $userInfo"
```

## 🚨 Dépannage Courant

### Port Déjà Utilisé

```bash
# Vérifier les ports utilisés
netstat -tulpn | grep :8080  # Linux
netstat -ano | findstr :8080  # Windows

# Tuer le processus (remplacer PID)
kill -9 <PID>  # Linux
taskkill /F /PID <PID>  # Windows
```

### Services qui Ne Démarrent Pas

```bash
# Vérifier les logs d'erreur
docker compose logs auth-service

# Vérifier la configuration
docker compose config

# Reconstruire l'image
docker compose build --no-cache auth-service
docker compose up -d auth-service
```

### Problèmes de Permissions (Linux)

```bash
# Donner les permissions au dossier
sudo chown -R $USER:$USER .

# Permissions Docker
sudo usermod -aG docker $USER
# Redémarrer la session ou :
newgrp docker
```

### Base de Données Non Accessible

```bash
# Vérifier que les conteneurs DB sont démarrés
docker compose ps | grep db_

# Tester la connexion
docker compose exec db_auth pg_isready -U auth_user

# Recréer les volumes si corruption
docker compose down -v
docker compose up -d
```

## 📈 Optimisations Performance

### Développement Local

```yaml
# Ajouter dans docker-compose.override.yml
version: '3.8'
services:
  auth-service:
    volumes:
      - ./auth-service:/app
    environment:
      - RELOAD=true
```

### Monitoring des Ressources

```bash
# Utilisation des ressources
docker stats

# Espace disque utilisé
docker system df

# Logs de taille limitée
docker compose logs --tail=100 --since=1h
```

## ✅ Checklist de Validation

- [ ] Docker Desktop fonctionne
- [ ] Fichier `.env` créé et configuré
- [ ] `docker compose config` sans erreur
- [ ] Tous les services démarrent (`docker compose ps`)
- [ ] Health check OK (`curl http://localhost:8080/health`)
- [ ] Mongo Express accessible (`http://localhost:8081`)
- [ ] Tests Postman importés et fonctionnels
- [ ] Logs sans erreurs critiques

---

🎉 **Félicitations !** Votre environnement Jolmood MVP est maintenant opérationnel.

**Prochaines étapes :**
1. 📮 Configurer Postman avec le [POSTMAN_GUIDE.md](POSTMAN_GUIDE.md)
2. 🏗️ Comprendre l'architecture avec [ARCHITECTURE.md](ARCHITECTURE.md)
3. 🔧 Résoudre les problèmes avec [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
