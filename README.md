# 🏥 Jolmood MVP

## 📋 Description

Jolmood est une plateforme MVP de bien-être mental qui connecte les utilisateurs avec des coachs professionnels. Le projet est développé avec **Python** et utilise une architecture microservices moderne.

## 🛠️ Stack Technique

### Backend
- **Framework** : FastAPI (Python 3.9+)
- **Gateway** : Nginx (reverse proxy et load balancer)
- **Base de données** : 
  - PostgreSQL 15 (5 instances séparées par service)
  - MongoDB avec GridFS (stockage des médias)
- **Authentification** : JWT (JSON Web Tokens)
- **ORM** : SQLAlchemy
- **Validation** : Pydantic
- **Containerisation** : Docker & Docker Compose
- **Interface Admin DB** : mongo-express

## 🏗️ Architecture Rapide

```
┌──────────────────────────────────────────────────────────────┐
│                      Jolmood MVP Backend                     │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              Nginx Gateway (Port: 8080)                 │ │
│  │         • Reverse Proxy • Load Balancer • CORS         │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                │                            │
│  ┌─────────────────────────────▼──────────────────────────┐ │
│  │                 FastAPI Microservices                  │ │
│  │  • auth-service    (5001) - JWT & Sessions             │ │
│  │  • user-service    (5002) - Profils & Coachs           │ │
│  │  • post-service    (5003) - Posts & Interactions       │ │
│  │  • appointment-service (5004) - Rendez-vous            │ │
│  │  • admin-service   (5005) - Administration & Stats     │ │
│  │  • media-service   (GridFS) - Upload & Storage         │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                │                            │
│  ┌─────────────────────────────▼──────────────────────────┐ │
│  │                    Databases                           │ │
│  │  • PostgreSQL 15 (5 instances séparées)               │ │
│  │    - auth_db, user_db, post_db, appointment_db,       │ │
│  │      admin_db                                          │ │
│  │  • MongoDB + GridFS (médias & fichiers)               │ │
│  │  • mongo-express (8081) - Interface web MongoDB       │ │
│  └─────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

## 🚀 Démarrage Rapide

### Prérequis

- **Docker Desktop** (avec WSL2 sur Windows)
- **Python 3.9+** (si développement local)
- **Postman** (pour les tests API)
- **Git** (pour cloner le repository)

### Lancer le Backend

```bash
# Cloner et naviguer
git clone https://github.com/<VOTRE_USERNAME>/jolmood-mvp.git
cd jolmood-mvp/backend

# Créer le fichier .env (voir backend/docs/ENVIRONMENT.md)
# Démarrer tous les services
docker compose up -d --build

# Vérifier que tout fonctionne
curl http://localhost:8080/health
```

**PowerShell (Windows) :**

```powershell
# Vérifier la santé
Invoke-RestMethod -Uri "http://localhost:8080/health"
```

### Arrêter les Services

```bash
cd backend
docker compose down

# Nettoyer complètement (supprime les volumes)
docker volume ls | grep backend | awk '{print $2}' | xargs -I{} docker volume rm {}
```

**PowerShell (Windows) :**

```powershell
cd backend
docker compose down

# Nettoyer les volumes
docker volume ls --filter "name=backend" --format "{{.Name}}" | ForEach-Object { docker volume rm $_ }
```

## 📚 Documentation Détaillée

| Guide                                                          | Description                                 |
| -------------------------------------------------------------- | ------------------------------------------- |
| [📐 ARCHITECTURE.md](backend/docs/ARCHITECTURE.md)             | Vue d'ensemble technique complète           |
| [⚙️ ENVIRONMENT.md](backend/docs/ENVIRONMENT.md)               | Configuration des variables d'environnement |
| [🛠️ INSTALLATION_GUIDE.md](backend/docs/INSTALLATION_GUIDE.md) | Instructions d'installation détaillées      |
| [📮 POSTMAN_GUIDE.md](backend/docs/POSTMAN_GUIDE.md)           | Guide complet pour tester l'API             |
| [🔧 TROUBLESHOOTING.md](backend/docs/TROUBLESHOOTING.md)       | Solutions aux problèmes courants            |

## 🧪 Tests Postman (Rapide)

1. **Importer dans Postman :**

   - Environnement : `backend/docs/postman/Jolmood.postman_environment.json`
   - Collection : `backend/docs/postman/Jolmood.postman_collection.json`

2. **Configurer les variables :**

   - `baseUrl` : `http://localhost:8080`
   - `token` : (sera rempli automatiquement après login)

3. **Scénario de test complet :**
   ```
   Auth → Users → Posts → Appointments → Admin → Media
   ```

📖 **Guide détaillé :** [POSTMAN_GUIDE.md](backend/docs/POSTMAN_GUIDE.md)

## 🛡️ Sécurité & Fonctionnalités

### Sécurité
- ✅ **JWT** pour l'authentification avec expiration
- ✅ **Séparation des bases de données** par service
- ✅ **Gestion des rôles** (user/coach/admin)
- ✅ **CORS** configuré pour les origines autorisées
- ✅ **Limites d'upload** pour les médias (10MB max)
- ✅ **Endpoints publics/privés** pour les médias
- ✅ **Validation des données** avec Pydantic
- ✅ **Hash des mots de passe** sécurisé

### Fonctionnalités
- 🔐 **Authentification complète** (register, login, profils)
- 👥 **Gestion des utilisateurs** (users, coachs, admins)
- 📝 **Posts sociaux** (création, likes, commentaires)
- 📅 **Système de rendez-vous** (booking, planning)
- 📁 **Gestion des médias** (upload, storage, GridFS)
- 📊 **Administration** (stats, logs, monitoring)
- 🔍 **API REST complète** avec documentation Swagger
- 📈 **Monitoring** et health checks

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Distribué sous licence MIT. Voir `LICENSE` pour plus d'informations.

## 👨‍💻 Développeur

**Aymane Laamimi**
- 📧 Email : [aymanelaamimi86@gmail.com](mailto:aymanelaamimi86@gmail.com)
- 🐛 Issues : [GitHub Issues](https://github.com/<VOTRE_USERNAME>/jolmood-mvp/issues)
- 📖 Documentation : [Wiki](https://github.com/<VOTRE_USERNAME>/jolmood-mvp/wiki)

## 🛠️ Technologies Utilisées en Détail

### Core Backend
- **Python 3.9+** - Langage principal
- **FastAPI** - Framework web moderne et performant
- **Uvicorn** - Serveur ASGI pour FastAPI
- **Pydantic** - Validation et sérialisation des données
- **SQLAlchemy** - ORM pour PostgreSQL
- **PyMongo** - Driver MongoDB pour Python
- **GridFS** - Système de fichiers MongoDB
- **python-jose[cryptography]** - Gestion JWT
- **passlib[bcrypt]** - Hash des mots de passe
- **python-multipart** - Support upload de fichiers

### Infrastructure
- **Docker** - Containerisation des services
- **Docker Compose** - Orchestration multi-conteneurs
- **Nginx** - Reverse proxy et load balancer
- **PostgreSQL 15** - Base de données relationnelle
- **MongoDB** - Base de données NoSQL pour médias
- **mongo-express** - Interface web MongoDB

### Développement & Tests
- **Postman** - Tests API et collections
- **Swagger/OpenAPI** - Documentation API automatique
- **pytest** - Framework de tests (recommandé)
- **black** - Formatage de code (recommandé)
- **flake8** - Linting Python (recommandé)

---

**⭐ N'hésitez pas à donner une étoile si ce projet vous aide !**
