# 🔧 Dépannage - Jolmood MVP

## 📋 Problèmes Fréquents et Solutions

Ce guide couvre les problèmes les plus courants rencontrés avec Jolmood MVP et leurs solutions.

## 🚀 Problèmes de Démarrage

### ❌ Docker Compose Échoue au Démarrage

**Symptômes :**
```bash
ERROR: Couldn't connect to Docker daemon
```

**Solutions :**

<details>
<summary><strong>🪟 Windows</strong></summary>

```powershell
# Vérifier que Docker Desktop est démarré
Get-Process "Docker Desktop" -ErrorAction SilentlyContinue

# Si pas démarré, lancer Docker Desktop
Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"

# Vérifier WSL2 (requis sur Windows)
wsl --status
wsl --set-default-version 2
```

</details>

<details>
<summary><strong>🐧 Linux</strong></summary>

```bash
# Démarrer le service Docker
sudo systemctl start docker
sudo systemctl enable docker

# Ajouter l'utilisateur au groupe docker
sudo usermod -aG docker $USER
newgrp docker

# Tester
docker --version
```

</details>

<details>
<summary><strong>🍎 macOS</strong></summary>

```bash
# Vérifier que Docker Desktop est lancé
open -a Docker

# Attendre que Docker soit prêt
docker system info
```

</details>

### ❌ Ports Déjà Utilisés

**Symptômes :**
```
Error starting userland proxy: listen tcp4 0.0.0.0:8080: bind: address already in use
```

**Solutions :**

```bash
# Identifier le processus utilisant le port
netstat -tulpn | grep :8080  # Linux/macOS
netstat -ano | findstr :8080  # Windows

# Tuer le processus (remplacer PID)
kill -9 <PID>  # Linux/macOS
taskkill /F /PID <PID>  # Windows

# Alternative : changer les ports dans docker-compose.yml
ports:
  - "8090:80"  # Au lieu de 8080:80
```

### ❌ Fichier .env Introuvable ou Mal Formaté

**Symptômes :**
```
WARN[0000] The "JWT_SECRET" variable is not set. Defaulting to a blank string.
```

**Solutions :**

```bash
# Vérifier l'existence du fichier
ls -la backend/.env

# Vérifier l'encodage (Windows)
file backend/.env  # Doit être UTF-8

# Recréer le fichier avec l'encodage correct
cd backend
```

**PowerShell (Windows) :**
```powershell
# Créer .env avec encodage UTF-8 sans BOM
@'
JWT_SECRET=supersecret_jolmood_mvp
AUTH_DB_URL=postgresql://auth_user:auth_pass@db_auth:5432/auth_db
'@ | Set-Content -Encoding utf8 .env
```

## 🌐 Problèmes de Gateway/Nginx

### ❌ Gateway Retourne 404 pour /auth

**Symptômes :**
```json
{
  "detail": "Not Found"
}
```

**Cause :** Configuration Nginx incorrecte

**Solutions :**

1. **Vérifier la configuration Nginx :**
```bash
# Afficher la config nginx
docker compose exec gateway cat /etc/nginx/nginx.conf

# Vérifier les logs
docker compose logs gateway
```

2. **Configuration correcte attendue :**
```nginx
location /auth/ {
    proxy_pass http://auth-service:5001/;
    # IMPORTANT: slash à la fin de proxy_pass
}
```

3. **Redémarrer le gateway :**
```bash
docker compose restart gateway
```

### ❌ Erreurs CORS

**Symptômes :**
```
Access to fetch at 'http://localhost:8080/auth/login' from origin 'http://localhost:19006' has been blocked by CORS policy
```

**Solutions :**

1. **Vérifier la configuration CORS dans .env :**
```bash
CORS_ORIGINS=http://localhost:19006,http://localhost:8080,http://localhost:3000
```

2. **Redémarrer les services après modification :**
```bash
docker compose restart
```

3. **Test direct sans CORS :**
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

## 🗄️ Problèmes de Base de Données

### ❌ Connexion PostgreSQL Échoue

**Symptômes :**
```
sqlalchemy.exc.OperationalError: (psycopg2.OperationalError) could not connect to server
```

**Solutions :**

1. **Vérifier que les conteneurs DB sont démarrés :**
```bash
docker compose ps | grep db_
```

2. **Tester la connexion manuellement :**
```bash
docker compose exec db_auth pg_isready -U auth_user
```

3. **Vérifier les logs de la base :**
```bash
docker compose logs db_auth
```

4. **Recréer les volumes si corruption :**
```bash
docker compose down -v
docker compose up -d
```

### ❌ MongoDB GridFS Inaccessible

**Symptômes :**
```
pymongo.errors.ServerSelectionTimeoutError: No servers available
```

**Solutions :**

1. **Vérifier MongoDB :**
```bash
docker compose exec mongo mongosh --eval "db.adminCommand('ismaster')"
```

2. **Vérifier les logs :**
```bash
docker compose logs mongo
```

3. **Tester la connexion depuis le service :**
```bash
docker compose exec media-service python -c "
import pymongo
client = pymongo.MongoClient('mongodb://mongo:27017')
print(client.admin.command('ismaster'))
"
```

### ❌ Tables/Collections Manquantes

**Symptômes :**
```
relation "users" does not exist
```

**Solutions :**

1. **Migrations automatiques manquées :**
```bash
# Redémarrer le service concerné
docker compose restart auth-service

# Vérifier les logs de création de tables
docker compose logs auth-service | grep -i "create"
```

2. **Migration manuelle si nécessaire :**
```bash
# Exemple pour auth-service
docker compose exec auth-service python -c "
from database import engine, Base
Base.metadata.create_all(bind=engine)
print('Tables créées')
"
```

## 🔐 Problèmes d'Authentification

### ❌ JWT Token Invalide

**Symptômes :**
```json
{
  "detail": "Could not validate credentials"
}
```

**Solutions :**

1. **Vérifier le secret JWT :**
```bash
# Le secret doit être identique dans tous les services
grep JWT_SECRET backend/.env
```

2. **Token expiré :**
```bash
# Se reconnecter pour obtenir un nouveau token
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

3. **Format du header incorrect :**
```bash
# Correct
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...

# Incorrect
Authorization: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

### ❌ Permissions Insuffisantes

**Symptômes :**
```json
{
  "detail": "Not enough permissions"
}
```

**Solutions :**

1. **Vérifier le rôle utilisateur :**
```bash
# Endpoint protégé admin uniquement
curl -H "Authorization: Bearer $TOKEN" http://localhost:8080/admin/stats
```

2. **Créer un utilisateur admin :**
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@jolmood.com","password":"admin123","role":"admin"}'
```

## 📁 Problèmes de Médias

### ❌ Upload de Fichier Échoue

**Symptômes :**
```json
{
  "detail": "File too large"
}
```

**Solutions :**

1. **Vérifier la taille du fichier :**
```bash
# Limite par défaut : 10MB
ls -lh votre_fichier.jpg
```

2. **Modifier la limite dans .env :**
```bash
MAX_FILE_SIZE=20971520  # 20MB
```

3. **Vérifier l'extension :**
```bash
ALLOWED_EXTENSIONS=jpg,jpeg,png,gif,pdf,mp4,mov
```

### ❌ Fichier Non Trouvé

**Symptômes :**
```json
{
  "detail": "File not found"
}
```

**Solutions :**

1. **Vérifier dans MongoDB :**
```bash
docker compose exec mongo mongosh jolmood_media --eval "
db.fs.files.find().forEach(printjson)
"
```

2. **Vérifier les permissions de dossier :**
```bash
docker compose exec media-service ls -la /app/uploads
```

## 📮 Problèmes Postman

### ❌ Variables Non Définies

**Symptômes :** `{{baseUrl}}` reste littéral dans l'URL

**Solutions :**

1. **Vérifier l'environnement sélectionné :**
   - Dropdown en haut à droite → "Jolmood MVP"

2. **Vérifier les variables :**
   - Clic sur l'œil 👁️ → Variables d'environnement
   - `baseUrl` = `http://localhost:8080`

3. **Réimporter l'environnement si nécessaire**

### ❌ Token Non Sauvegardé Automatiquement

**Symptômes :** `{{token}}` reste vide après login

**Solutions :**

1. **Vérifier le script Post-Response dans /auth/login :**
```javascript
let jsonData = pm.response.json();
if (jsonData.access_token) {
    pm.environment.set("token", jsonData.access_token);
}
```

2. **Exécuter manuellement :**
   - Copier le token de la réponse
   - Variables → `token` → Coller la valeur

### ❌ Erreur "ENOTFOUND {{baseUrl}}"

**Symptômes :**
```
Error: getaddrinfo ENOTFOUND {{baseUrl}}
```

**Solutions :**

1. **Environnement non sélectionné :**
   - Sélectionner "Jolmood MVP" dans le dropdown

2. **Services backend non démarrés :**
```bash
docker compose ps
curl http://localhost:8080/health
```

## 🔧 Problèmes de Performance

### ❌ Services Lents à Répondre

**Symptômes :** Timeouts ou réponses > 5 secondes

**Solutions :**

1. **Vérifier les ressources système :**
```bash
docker stats
```

2. **Optimiser Docker Desktop (Windows/macOS) :**
   - Settings → Resources
   - Allouer plus de RAM (4GB minimum)
   - Allouer plus de CPU (2 cores minimum)

3. **Nettoyer Docker :**
```bash
docker system prune -f
docker volume prune -f
```

### ❌ Logs Trop Volumineux

**Symptômes :** Espace disque plein, Docker lent

**Solutions :**

```bash
# Limiter la taille des logs
docker compose down
# Ajouter dans docker-compose.yml :
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"

docker compose up -d
```

## 🖥️ Problèmes Spécifiques Windows

### ❌ WSL2 Non Configuré

**Symptômes :**
```
Docker Desktop requires WSL2
```

**Solutions :**

```powershell
# Activer WSL2
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

# Redémarrer Windows, puis :
wsl --set-default-version 2

# Installer une distribution Linux
wsl --install -d Ubuntu
```

### ❌ Problèmes de Permissions

**Symptômes :** Erreurs d'accès aux fichiers

**Solutions :**

```powershell
# Exécuter PowerShell en tant qu'administrateur
# Donner les permissions au dossier
icacls "C:\Users\<USERNAME>\jolmood-mvp" /grant Everyone:F /T
```

### ❌ Fins de Ligne CRLF/LF

**Symptômes :** Scripts shell ne fonctionnent pas

**Solutions :**

```bash
# Convertir les fins de ligne
git config core.autocrlf true
git add . && git reset --hard
```

## 🐧 Problèmes Spécifiques Linux

### ❌ Permissions Docker

**Symptômes :**
```
Got permission denied while trying to connect to the Docker daemon socket
```

**Solutions :**

```bash
# Ajouter l'utilisateur au groupe docker
sudo usermod -aG docker $USER
newgrp docker

# OU redémarrer la session
logout
# Se reconnecter
```

### ❌ Ports Protégés

**Symptômes :** Impossible de bind sur les ports < 1024

**Solutions :**

```bash
# Utiliser des ports > 1024 dans docker-compose.yml
ports:
  - "8080:80"  # OK
  - "8443:443" # OK
  # Éviter : "80:80", "443:443"
```

## 🍎 Problèmes Spécifiques macOS

### ❌ Docker Desktop Lent

**Solutions :**

1. **Optimiser les performances :**
   - Docker Desktop → Settings → Resources
   - Activer "Use gRPC FUSE for file sharing"

2. **Éviter le montage de volumes volumineux :**
```yaml
# Utiliser des volumes nommés plutôt que des bind mounts
volumes:
  - postgres_data:/var/lib/postgresql/data
  # Au lieu de : ./data:/var/lib/postgresql/data
```

## 📊 Outils de Diagnostic

### Vérification Complète du Système

```bash
#!/bin/bash
echo "=== Diagnostic Jolmood MVP ==="

echo "1. Docker version:"
docker --version

echo "2. Docker Compose version:"
docker compose version

echo "3. Services status:"
docker compose ps

echo "4. Health checks:"
curl -s http://localhost:8080/health | jq '.' || echo "Gateway not responding"

echo "5. Disk usage:"
docker system df

echo "6. Environment variables:"
grep -v "PASSWORD\|SECRET" backend/.env | head -10

echo "7. Network connectivity:"
docker compose exec gateway ping -c 1 auth-service || echo "Network issue"

echo "=== End Diagnostic ==="
```

### Script de Nettoyage Complet

```bash
#!/bin/bash
echo "⚠️  Nettoyage complet du projet (perte de données) ⚠️"
read -p "Continuer? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker compose down -v
    docker system prune -af --volumes
    echo "✅ Nettoyage terminé"
else
    echo "❌ Annulé"
fi
```

## 📞 Obtenir de l'Aide

### Informations à Fournir

Quand vous demandez de l'aide, incluez :

```bash
# 1. Version des outils
docker --version
docker compose version

# 2. OS et architecture
uname -a  # Linux/macOS
systeminfo  # Windows

# 3. Status des services
docker compose ps

# 4. Logs d'erreur
docker compose logs --tail=50 <service_name>

# 5. Configuration (sans secrets)
docker compose config
```

### Logs Utiles

```bash
# Logs avec timestamps
docker compose logs -t --tail=100

# Logs d'un service spécifique
docker compose logs -f auth-service

# Logs d'erreur uniquement
docker compose logs 2>&1 | grep -i error
```

---

## ✅ Checklist de Dépannage

Avant de demander de l'aide :

- [ ] Docker Desktop démarré et fonctionnel
- [ ] Fichier `.env` présent et bien formaté
- [ ] Ports 8080 et 8081 libres
- [ ] `docker compose config` sans erreur
- [ ] Services démarrés (`docker compose ps`)
- [ ] Logs vérifiés (`docker compose logs`)
- [ ] Health check OK (`curl http://localhost:8080/health`)
- [ ] Variables Postman configurées
- [ ] Environnement Postman sélectionné

Si le problème persiste après ces vérifications, consultez les [Issues GitHub](https://github.com/<VOTRE_USERNAME>/jolmood-mvp/issues) ou créez un nouveau ticket avec les informations de diagnostic.

---

💡 **Astuce :** La plupart des problèmes se résolvent avec `docker compose down && docker compose up -d --build`
