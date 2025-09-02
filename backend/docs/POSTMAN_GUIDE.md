# 📮 Guide Postman - Tests API Jolmood MVP

## 📋 Vue d'Ensemble

Ce guide vous accompagne dans l'utilisation de Postman pour tester complètement l'API Jolmood MVP, de l'authentification aux fonctionnalités avancées.

## 🚀 Configuration Initiale

### 1. Import des Fichiers Postman

**Étapes :**

1. **Ouvrir Postman**
2. **Importer l'Environnement :**
   - Clic sur l'icône ⚙️ en haut à droite
   - `Import` → Sélectionner `backend/docs/postman/Jolmood.postman_environment.json`
   - Vérifier que l'environnement "Jolmood MVP" est sélectionné

3. **Importer la Collection :**
   - `Import` → Sélectionner `backend/docs/postman/Jolmood.postman_collection.json`
   - La collection "Jolmood API" apparaît dans la sidebar

### 2. Configuration des Variables d'Environnement

**Variables principales :**

| Variable | Valeur Initiale | Description |
|----------|-----------------|-------------|
| `baseUrl` | `http://localhost:8080` | URL du gateway |
| `token` | *(vide)* | JWT token (rempli automatiquement) |
| `user_id` | *(vide)* | ID utilisateur connecté |
| `media_id` | *(vide)* | ID du dernier fichier uploadé |
| `post_id` | *(vide)* | ID du dernier post créé |
| `appointment_id` | *(vide)* | ID du dernier RDV créé |

**Vérification :**
```
✅ baseUrl = http://localhost:8080
✅ token = (vide au départ)
✅ Environnement "Jolmood MVP" sélectionné
```

## 🔐 Scénario 1 : Authentification

### 1.1 Inscription d'un Utilisateur

**Requête :** `POST /auth/register`

```json
{
  "email": "john.doe@example.com",
  "password": "motdepasse123",
  "role": "user",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Réponse attendue :**
```json
{
  "id": 1,
  "email": "john.doe@example.com",
  "role": "user",
  "is_active": true,
  "created_at": "2025-01-08T10:30:00Z"
}
```

### 1.2 Connexion (Login)

**Requête :** `POST /auth/login`

```json
{
  "email": "john.doe@example.com",
  "password": "motdepasse123"
}
```

**Script Post-Response (onglet Tests) :**
```javascript
// Auto-remplir le token pour les requêtes suivantes
let jsonData = pm.response.json();
if (jsonData.access_token) {
    pm.environment.set("token", jsonData.access_token);
    console.log("✅ Token sauvegardé:", jsonData.access_token.substring(0, 20) + "...");
}

// Sauvegarder l'ID utilisateur
if (jsonData.user_id) {
    pm.environment.set("user_id", jsonData.user_id);
}

// Tests automatiques
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has access_token", function () {
    pm.expect(jsonData).to.have.property('access_token');
});
```

**Réponse attendue :**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "user_id": 1,
  "role": "user"
}
```

### 1.3 Vérification du Profil

**Requête :** `GET /auth/me`

**Headers automatiques :**
- `Authorization: Bearer {{token}}`

**Tests automatiques :**
```javascript
pm.test("User profile retrieved", function () {
    let jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('id');
    pm.expect(jsonData).to.have.property('email');
    pm.expect(jsonData.email).to.eql("john.doe@example.com");
});
```

## 👤 Scénario 2 : Gestion des Utilisateurs

### 2.1 Consulter Mon Profil

**Requête :** `GET /users/me`

**Réponse attendue :**
```json
{
  "id": 1,
  "email": "john.doe@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "role": "user",
  "profile": {
    "bio": null,
    "phone": null,
    "location": null
  }
}
```

### 2.2 Mettre à Jour Mon Profil

**Requête :** `PUT /users/me`

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "profile": {
    "bio": "Passionné de bien-être mental",
    "phone": "+33123456789",
    "location": "Paris, France"
  }
}
```

## 📝 Scénario 3 : Posts Sociaux

### 3.1 Créer un Post Public

**Requête :** `POST /posts/`

```json
{
  "content": "Mon premier post sur Jolmood ! 🌟",
  "is_public": true
}
```

**Script Post-Response :**
```javascript
let jsonData = pm.response.json();
if (jsonData.id) {
    pm.environment.set("post_id", jsonData.id);
    console.log("✅ Post ID sauvegardé:", jsonData.id);
}

pm.test("Post created successfully", function () {
    pm.response.to.have.status(201);
    pm.expect(jsonData).to.have.property('id');
});
```

### 3.2 Créer un Post avec Média

**Prérequis :** Avoir uploadé un fichier (voir section Média)

```json
{
  "content": "Voici ma photo de profil ! 📸",
  "media_id": "{{media_id}}",
  "is_public": true
}
```

### 3.3 Lister les Posts

**Requête :** `GET /posts/?skip=0&limit=10`

**Tests automatiques :**
```javascript
pm.test("Posts list retrieved", function () {
    let jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an('array');
    if (jsonData.length > 0) {
        pm.expect(jsonData[0]).to.have.property('id');
        pm.expect(jsonData[0]).to.have.property('content');
    }
});
```

### 3.4 Liker un Post

**Requête :** `POST /posts/{{post_id}}/like`

*Corps vide*

### 3.5 Commenter un Post

**Requête :** `POST /posts/{{post_id}}/comment`

```json
{
  "content": "Super post ! 👍"
}
```

## 📅 Scénario 4 : Rendez-vous

### 4.1 Créer un Rendez-vous

**Requête :** `POST /appointments/`

```json
{
  "coach_id": 2,
  "appointment_date": "2025-01-15T14:00:00Z",
  "duration_minutes": 60,
  "notes": "Première consultation - gestion du stress"
}
```

**Script Post-Response :**
```javascript
let jsonData = pm.response.json();
if (jsonData.id) {
    pm.environment.set("appointment_id", jsonData.id);
}
```

### 4.2 Lister Mes Rendez-vous

**Requête :** `GET /appointments/user/{{user_id}}`

### 4.3 Mettre à Jour le Statut (Coach uniquement)

**Requête :** `PUT /appointments/{{appointment_id}}/status`

```json
{
  "status": "confirmed",
  "coach_notes": "RDV confirmé pour le 15/01"
}
```

## 👨‍💼 Scénario 5 : Administration

### 5.1 Se Connecter en Admin

**Requête :** `POST /auth/login`

```json
{
  "email": "admin@jolmood.com",
  "password": "admin123_change_in_production"
}
```

### 5.2 Consulter les Statistiques

**Requête :** `GET /admin/stats`

**Réponse attendue :**
```json
{
  "total_users": 15,
  "total_posts": 42,
  "total_appointments": 8,
  "active_sessions": 3,
  "system_health": "healthy"
}
```

### 5.3 Consulter les Logs

**Requête :** `GET /admin/logs?level=INFO&limit=50`

### 5.4 Créer un Log Personnalisé

**Requête :** `POST /admin/logs`

```json
{
  "level": "INFO",
  "message": "Test depuis Postman",
  "source": "postman_test"
}
```

## 📁 Scénario 6 : Gestion des Médias

### 6.1 Upload d'un Fichier

**Requête :** `POST /media/upload`

**Type :** `form-data`

| Key | Type | Value |
|-----|------|-------|
| `file` | File | *Sélectionner un fichier image* |
| `is_public` | Text | `true` ou `false` |

**Script Post-Response :**
```javascript
let jsonData = pm.response.json();
if (jsonData.media_id) {
    pm.environment.set("media_id", jsonData.media_id);
    console.log("✅ Media ID sauvegardé:", jsonData.media_id);
}

pm.test("File uploaded successfully", function () {
    pm.response.to.have.status(201);
    pm.expect(jsonData).to.have.property('media_id');
    pm.expect(jsonData).to.have.property('filename');
});
```

### 6.2 Accéder à un Média Privé

**Requête :** `GET /media/{{media_id}}`

**Headers automatiques :**
- `Authorization: Bearer {{token}}`

**Response :** Données binaires du fichier

**Pour sauvegarder :**
1. Clic droit sur la réponse
2. `Save Response` → `Save to file`

### 6.3 Accéder à un Média Public

**Requête :** `GET /media/public/{{media_id}}`

*Aucune authentification requise*

## 🧪 Tests Automatiques Avancés

### Suite de Tests Complète

```javascript
// Dans l'onglet Tests de chaque requête

pm.test("Response time is less than 2000ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});

pm.test("Response has correct Content-Type", function () {
    pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
});

pm.test("No error in response", function () {
    let jsonData = pm.response.json();
    pm.expect(jsonData).to.not.have.property('error');
});

// Test spécifique pour les endpoints protégés
pm.test("Authentication required", function () {
    if (pm.response.code === 401) {
        pm.expect(pm.response.json().detail).to.include("token");
    }
});
```

### Collection Runner

1. **Sélectionner la collection** "Jolmood API"
2. **Runner** → Configurer :
   - Environment : "Jolmood MVP"
   - Iterations : 1
   - Delay : 1000ms entre requêtes
3. **Run Jolmood API**

**Ordre d'exécution recommandé :**
```
1. Auth/Register
2. Auth/Login
3. Auth/Me
4. Users/Me
5. Media/Upload
6. Posts/Create (with media)
7. Posts/List
8. Posts/Like
9. Appointments/Create
10. Admin/Stats (si admin)
```

## 🔧 Dépannage Postman

### Variables Non Définies

**Symptôme :** `{{baseUrl}}` reste littéral dans l'URL

**Solution :**
1. Vérifier que l'environnement "Jolmood MVP" est sélectionné
2. Variables → Vérifier que `baseUrl` = `http://localhost:8080`
3. Redémarrer Postman si nécessaire

### Token Expiré

**Symptôme :** Erreur 401 "Token expired"

**Solution :**
1. Relancer `POST /auth/login`
2. Le token sera automatiquement mis à jour
3. Relancer la requête qui a échoué

### Erreur CORS

**Symptôme :** "CORS policy error" dans Postman

**Solution :**
- Vérifier que les services backend sont démarrés
- Dans Postman : Settings → Disable SSL certificate verification
- Vérifier la configuration CORS dans le `.env`

### Fichier Upload Échoue

**Symptôme :** Erreur lors de l'upload de fichier

**Solution :**
1. Vérifier que le fichier fait moins de 10MB
2. Extension autorisée : jpg, jpeg, png, gif, pdf
3. Type de requête : `form-data`, pas `raw`

## 📊 Monitoring et Métriques

### Tests de Performance

```javascript
// Dans l'onglet Tests
pm.test("Response time acceptable", function () {
    pm.expect(pm.response.responseTime).to.be.below(1000);
});

// Enregistrer les temps de réponse
pm.globals.set("response_time_" + pm.info.requestName, pm.response.responseTime);
```

### Collecte de Métriques

```javascript
// Script Pre-request global
pm.globals.set("start_time", new Date().getTime());

// Script Tests global
let endTime = new Date().getTime();
let startTime = pm.globals.get("start_time");
let totalTime = endTime - startTime;

console.log("⏱️ Total request time:", totalTime + "ms");
```

## ✅ Checklist de Validation

**Configuration :**
- [ ] Environnement Postman importé et sélectionné
- [ ] Collection importée avec tous les endpoints
- [ ] Variables `baseUrl` configurée
- [ ] Backend services démarrés (`docker compose ps`)

**Tests d'Authentification :**
- [ ] Registration réussie
- [ ] Login réussi avec token automatiquement sauvé
- [ ] Accès au profil avec JWT

**Tests CRUD :**
- [ ] Création de post
- [ ] Liste des posts
- [ ] Like et commentaire
- [ ] Upload de média
- [ ] Création de rendez-vous

**Tests Administration :**
- [ ] Login admin
- [ ] Consultation des stats
- [ ] Gestion des logs

**Tests Automatiques :**
- [ ] Collection Runner exécutée sans erreur
- [ ] Tous les tests passent (status 200/201)
- [ ] Variables automatiquement mises à jour

---

🎉 **Bravo !** Vous maîtrisez maintenant l'API Jolmood MVP avec Postman.

**Ressources supplémentaires :**
- 📐 [ARCHITECTURE.md](ARCHITECTURE.md) - Comprendre l'architecture
- 🛠️ [INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md) - Installation détaillée  
- 🔧 [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Résoudre les problèmes
