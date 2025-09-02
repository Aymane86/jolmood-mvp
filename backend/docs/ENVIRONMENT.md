# ⚙️ Configuration Environnement - Jolmood MVP

## 📋 Vue d'Ensemble

Le backend utilise des variables d'environnement pour configurer les connexions aux bases de données, les secrets JWT, et autres paramètres sensibles.

> ⚠️ **Important** : Le fichier `.env` contient des informations sensibles et **NE DOIT JAMAIS** être commité dans Git. Il est automatiquement ignoré par le `.gitignore`.

## 🔧 Création du Fichier .env

### Linux/macOS (bash)

```bash
cd backend

cat > .env << 'EOF'
# JWT Configuration
JWT_SECRET=supersecret_jolmood_mvp_change_in_production
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# PostgreSQL Databases (5 services séparés)
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

# Logging
LOG_LEVEL=INFO
LOG_FORMAT=json

# Development Settings
DEBUG=true
ENVIRONMENT=development
EOF
```

### Windows PowerShell

```powershell
cd backend

@'
# JWT Configuration
JWT_SECRET=supersecret_jolmood_mvp_change_in_production
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# PostgreSQL Databases (5 services séparés)
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

# Logging
LOG_LEVEL=INFO
LOG_FORMAT=json

# Development Settings
DEBUG=true
ENVIRONMENT=development
'@ | Set-Content -Encoding utf8 .env
```

## 📚 Description des Variables

### 🔐 JWT (Authentification)

| Variable | Description | Exemple |
|----------|-------------|---------|
| `JWT_SECRET` | Clé secrète pour signer les tokens JWT | `supersecret_jolmood_mvp` |
| `JWT_ALGORITHM` | Algorithme de chiffrement | `HS256` |
| `JWT_EXPIRATION_HOURS` | Durée de vie des tokens (heures) | `24` |

### 🗄️ Bases de Données PostgreSQL

Chaque service a sa propre base de données pour respecter l'isolation :

| Service | Variable | Port | Base |
|---------|----------|------|------|
| **Auth** | `AUTH_DB_URL` | 5432 | `auth_db` |
| **User** | `USER_DB_URL` | 5433 | `user_db` |
| **Post** | `POST_DB_URL` | 5434 | `post_db` |
| **Appointment** | `APP_DB_URL` | 5435 | `appointment_db` |
| **Admin** | `ADMIN_DB_URL` | 5436 | `admin_db` |

**Format de connexion :**
```
postgresql://[utilisateur]:[mot_de_passe]@[host]:[port]/[nom_base]
```

### 🍃 MongoDB

| Variable | Description | Exemple |
|----------|-------------|---------|
| `MONGO_URL` | URL de connexion MongoDB | `mongodb://mongo:27017` |
| `MONGO_DB` | Nom de la base de données | `jolmood_media` |

### 🌐 CORS

| Variable | Description |
|----------|-------------|
| `CORS_ORIGINS` | Origines autorisées (séparées par virgules) |

**Origines communes :**
- `http://localhost:19006` : Expo development
- `http://localhost:8080` : Gateway backend
- `http://localhost:3000` : Frontend web (futur)

### 📁 Service Média

| Variable | Description | Valeur |
|----------|-------------|--------|
| `MAX_FILE_SIZE` | Taille max des fichiers (bytes) | `10485760` (10MB) |
| `ALLOWED_EXTENSIONS` | Extensions autorisées | `jpg,jpeg,png,gif,pdf` |
| `UPLOAD_PATH` | Chemin de stockage | `/app/uploads` |

### 👨‍💼 Administration

| Variable | Description | Usage |
|----------|-------------|-------|
| `ADMIN_EMAIL` | Email admin par défaut | Premier compte admin |
| `ADMIN_PASSWORD` | Mot de passe admin | **À changer en production !** |

### 📝 Logging

| Variable | Description | Valeurs |
|----------|-------------|---------|
| `LOG_LEVEL` | Niveau de logs | `DEBUG`, `INFO`, `WARNING`, `ERROR` |
| `LOG_FORMAT` | Format des logs | `json`, `text` |

### 🔧 Développement

| Variable | Description | Valeurs |
|----------|-------------|---------|
| `DEBUG` | Mode debug | `true`, `false` |
| `ENVIRONMENT` | Environnement | `development`, `production`, `testing` |

## 🔒 Sécurité en Production

### Variables à Modifier Absolument

```bash
# ⚠️ À changer en production
JWT_SECRET=votre_secret_super_complexe_et_unique
ADMIN_PASSWORD=mot_de_passe_fort_et_unique

# Bases de données avec mots de passe forts
AUTH_DB_URL=postgresql://auth_user:mot_de_passe_fort@db_auth:5432/auth_db
# ... autres DB URLs avec mots de passe forts
```

### Bonnes Pratiques

1. **Secrets complexes** : Minimum 32 caractères, caractères spéciaux
2. **Rotation régulière** : Changer les secrets périodiquement
3. **Accès restreint** : Seuls les admins ont accès au `.env`
4. **Backup sécurisé** : Sauvegarder les secrets dans un gestionnaire de mots de passe
5. **Variables d'environnement** : En production, utiliser des variables d'environnement système plutôt qu'un fichier

## 🧪 Configuration de Test

Pour les tests automatisés, créer un `.env.test` :

```bash
# Configuration pour tests
JWT_SECRET=test_secret_not_for_production
DEBUG=true
ENVIRONMENT=testing

# Bases de données de test (en mémoire ou séparées)
AUTH_DB_URL=postgresql://test_user:test_pass@localhost:5432/test_auth_db
# ... autres configurations de test
```

## ✅ Validation de la Configuration

Vérifier que la configuration est correcte :

```bash
# Vérifier la configuration Docker Compose
docker compose --env-file .env config

# Tester les connexions (une fois les services démarrés)
docker compose exec auth-service python -c "
import os
print('JWT_SECRET:', os.getenv('JWT_SECRET')[:10] + '...')
print('AUTH_DB_URL:', os.getenv('AUTH_DB_URL'))
"
```

## 🔄 Migration entre Environnements

### Développement → Staging

```bash
cp .env .env.staging
# Modifier les URLs et secrets pour staging
sed -i 's/localhost/staging-server/g' .env.staging
```

### Staging → Production

```bash
cp .env.staging .env.production
# Remplacer tous les secrets et mots de passe
# Configurer les URLs de production
```

## 🚨 Dépannage

### Erreur "Encoding UTF-8"

**Windows :** Le fichier `.env` doit être encodé en UTF-8 sans BOM :

```powershell
# Vérifier l'encodage
Get-Content .env -Encoding utf8 | Out-File -Encoding utf8 .env.new
Move-Item .env.new .env
```

### Variables Non Reconnues

```bash
# Vérifier que le fichier existe
ls -la .env

# Vérifier le contenu
cat .env | grep -v "^#" | grep -v "^$"

# Tester le chargement
docker compose --env-file .env config | grep -i "environment"
```

### Connexions Base de Données

```bash
# Tester la connexion PostgreSQL
docker compose exec db_auth psql -U auth_user -d auth_db -c "\dt"

# Tester la connexion MongoDB
docker compose exec mongo mongosh --eval "db.adminCommand('ismaster')"
```

---

> 💡 **Rappel** : Le fichier `.env` est ignoré par Git pour des raisons de sécurité. Ne jamais commiter de secrets dans le code source !
