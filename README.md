# 🏥 Jolmood MVP

## 📋 Description

Jolmood est une plateforme MVP de bien-être mental qui connecte les utilisateurs avec des coachs professionnels. Le projet comprend :

- **Backend microservices** : Architecture FastAPI avec gateway Nginx, base de données PostgreSQL multi-services et MongoDB pour les médias
- **Frontend mobile** : Application Expo/React Native (en développement)

## 🏗️ Architecture Rapide

```
┌─────────────────┐    ┌──────────────────────────────────────┐
│   Mobile App    │    │              Backend                 │
│  (Expo/RN)      │◄──►│  ┌─────────────────────────────────┐ │
│  Port: 19006    │    │  │        Nginx Gateway            │ │
└─────────────────┘    │  │        Port: 8080               │ │
                       │  └─────────────────────────────────┘ │
                       │                 │                    │
                       │  ┌──────────────▼──────────────────┐ │
                       │  │         Microservices           │ │
                       │  │  • auth-service    (5001)       │ │
                       │  │  • user-service    (5002)       │ │
                       │  │  • post-service    (5003)       │ │
                       │  │  • appointment-service (5004)   │ │
                       │  │  • admin-service   (5005)       │ │
                       │  │  • media-service   (GridFS)     │ │
                       │  └─────────────────────────────────┘ │
                       │                 │                    │
                       │  ┌──────────────▼──────────────────┐ │
                       │  │          Databases              │ │
                       │  │  • PostgreSQL (5 DBs séparées) │ │
                       │  │  • MongoDB + GridFS (médias)   │ │
                       │  │  • mongo-express (8081)         │ │
                       │  └─────────────────────────────────┘ │
                       └──────────────────────────────────────┘
```

## 🚀 Démarrage Rapide

### Prérequis
- Docker Desktop (avec WSL2 sur Windows)
- Node.js 18+ (pour le frontend plus tard)
- Postman (pour les tests API)

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

| Guide | Description |
|-------|-------------|
| [📐 ARCHITECTURE.md](backend/docs/ARCHITECTURE.md) | Vue d'ensemble technique complète |
| [⚙️ ENVIRONMENT.md](backend/docs/ENVIRONMENT.md) | Configuration des variables d'environnement |
| [🛠️ INSTALLATION_GUIDE.md](backend/docs/INSTALLATION_GUIDE.md) | Instructions d'installation détaillées |
| [📮 POSTMAN_GUIDE.md](backend/docs/POSTMAN_GUIDE.md) | Guide complet pour tester l'API |
| [🔧 TROUBLESHOOTING.md](backend/docs/TROUBLESHOOTING.md) | Solutions aux problèmes courants |

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

## 🛡️ Sécurité

- ✅ JWT pour l'authentification
- ✅ Séparation des bases de données par service
- ✅ Gestion des rôles (user/coach/admin)
- ✅ CORS configuré
- ✅ Limites d'upload pour les médias
- ✅ Endpoints publics/privés pour les médias

## 📱 Frontend Mobile

Le frontend Expo/React Native est disponible dans `frontend/jolmood-mobile/` mais nécessite une refonte complète (MVP à reprendre).

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Distribué sous licence MIT. Voir `LICENSE` pour plus d'informations.

## 📞 Support

- 📧 Email : [votre-email@example.com]
- 🐛 Issues : [GitHub Issues](https://github.com/<VOTRE_USERNAME>/jolmood-mvp/issues)
- 📖 Documentation : [Wiki](https://github.com/<VOTRE_USERNAME>/jolmood-mvp/wiki)

---

**⭐ N'hésitez pas à donner une étoile si ce projet vous aide !**
