# 🗄️ Guide de Configuration DBeaver pour Jolmood MVP

## 📋 Configuration des Bases de Données

Toutes les bases de données sont maintenant exposées sur des ports dédiés pour faciliter la visualisation avec DBeaver.

### 🔗 Ports des Bases de Données

| Service         | Base de Données  | Port     | Utilisateur  | Mot de passe | Base                 |
| --------------- | ---------------- | -------- | ------------ | ------------ | -------------------- |
| **Auth**        | `auth_db`        | **5433** | `auth_user`  | `auth_pass`  | Authentification     |
| **User**        | `user_db`        | **5434** | `user_user`  | `user_pass`  | Profils utilisateurs |
| **Post**        | `post_db`        | **5435** | `post_user`  | `post_pass`  | Publications         |
| **Appointment** | `appointment_db` | **5436** | `app_user`   | `app_pass`   | Rendez-vous          |
| **Admin**       | `admin_db`       | **5437** | `admin_user` | `admin_pass` | Administration       |

## 🚀 Étapes de Configuration DBeaver

### 1. Redémarrer les Conteneurs

```bash
# Arrêter les conteneurs actuels
docker-compose down

# Redémarrer avec les nouveaux ports
docker-compose up -d
```

### 2. Vérifier que les Ports sont Exposés

```bash
# Vérifier les conteneurs en cours d'exécution
docker ps

# Vérifier les ports exposés
docker port db_auth
docker port db_user
docker port db_post
docker port db_app
docker port db_admin
```

### 3. Configuration DBeaver

#### 3.1 Créer un Dossier de Projet

1. Ouvrir **DBeaver**
2. Clic droit sur **"Connexions"**
3. **"Nouveau dossier"**
4. Nommer : **"Jolmood MVP"**

#### 3.2 Créer les Connexions

##### Connexion Auth DB

1. **Nouvelle connexion** → **PostgreSQL**
2. **Paramètres** :
   - Nom : `Jolmood - Auth DB`
   - Hôte : `localhost`
   - Port : `5433`
   - Base de données : `auth_db`
   - Nom d'utilisateur : `auth_user`
   - Mot de passe : `auth_pass`
3. **Tester la connexion** → **Terminer**

##### Connexion User DB

1. **Nouvelle connexion** → **PostgreSQL**
2. **Paramètres** :
   - Nom : `Jolmood - User DB`
   - Hôte : `localhost`
   - Port : `5434`
   - Base de données : `user_db`
   - Nom d'utilisateur : `user_user`
   - Mot de passe : `user_pass`
3. **Tester la connexion** → **Terminer**

##### Connexion Post DB

1. **Nouvelle connexion** → **PostgreSQL**
2. **Paramètres** :
   - Nom : `Jolmood - Post DB`
   - Hôte : `localhost`
   - Port : `5435`
   - Base de données : `post_db`
   - Nom d'utilisateur : `post_user`
   - Mot de passe : `post_pass`
3. **Tester la connexion** → **Terminer**

##### Connexion Appointment DB

1. **Nouvelle connexion** → **PostgreSQL**
2. **Paramètres** :
   - Nom : `Jolmood - Appointment DB`
   - Hôte : `localhost`
   - Port : `5436`
   - Base de données : `appointment_db`
   - Nom d'utilisateur : `app_user`
   - Mot de passe : `app_pass`
3. **Tester la connexion** → **Terminer**

##### Connexion Admin DB

1. **Nouvelle connexion** → **PostgreSQL**
2. **Paramètres** :
   - Nom : `Jolmood - Admin DB`
   - Hôte : `localhost`
   - Port : `5437`
   - Base de données : `admin_db`
   - Nom d'utilisateur : `admin_user`
   - Mot de passe : `admin_pass`
3. **Tester la connexion** → **Terminer**

## 📊 Tables Attendues par Service

### Auth Service (auth_db)

- **Table** : `users`
  - `id` (UUID)
  - `name` (VARCHAR)
  - `email` (VARCHAR)
  - `phone` (VARCHAR, nullable)
  - `password_hash` (VARCHAR)
  - `role` (VARCHAR)
  - `created_at` (TIMESTAMP)

### User Service (user_db)

- **Table** : `user_profiles`
  - `id` (UUID)
  - `user_id` (VARCHAR)
  - `name` (VARCHAR)
  - `email` (VARCHAR)
  - `role` (VARCHAR)
  - `bio` (TEXT, nullable)
  - `avatar_url` (VARCHAR, nullable)
  - `created_at` (TIMESTAMP)

### Post Service (post_db)

- **Table** : `posts`

  - `id` (UUID)
  - `user_id` (VARCHAR)
  - `content` (TEXT)
  - `media_url` (VARCHAR, nullable)
  - `created_at` (TIMESTAMP)

- **Table** : `comments`

  - `id` (UUID)
  - `post_id` (VARCHAR)
  - `user_id` (VARCHAR)
  - `content` (TEXT)
  - `created_at` (TIMESTAMP)

- **Table** : `likes`
  - `id` (UUID)
  - `post_id` (VARCHAR)
  - `user_id` (VARCHAR)
  - `created_at` (TIMESTAMP)

### Appointment Service (appointment_db)

- **Table** : `appointments`
  - `id` (UUID)
  - `user_id` (VARCHAR)
  - `coach_id` (VARCHAR)
  - `date` (TIMESTAMP)
  - `status` (VARCHAR)
  - `created_at` (TIMESTAMP)

### Admin Service (admin_db)

- **Table** : `admin_logs`
  - `id` (UUID)
  - `action` (VARCHAR)
  - `created_at` (TIMESTAMP)

## 🔍 Requêtes SQL Utiles

### Vérifier les Utilisateurs Inscrits

```sql
-- Dans auth_db
SELECT id, name, email, role, created_at
FROM users
ORDER BY created_at DESC;
```

### Voir les Profils Utilisateurs

```sql
-- Dans user_db
SELECT * FROM user_profiles;
```

### Consulter les Posts avec Auteurs

```sql
-- Dans post_db
SELECT p.*, u.name as author_name
FROM posts p
LEFT JOIN user_profiles u ON p.user_id = u.user_id
ORDER BY p.created_at DESC;
```

### Voir les Rendez-vous

```sql
-- Dans appointment_db
SELECT a.*,
       u1.name as user_name,
       u2.name as coach_name
FROM appointments a
LEFT JOIN user_profiles u1 ON a.user_id = u1.user_id
LEFT JOIN user_profiles u2 ON a.coach_id = u2.user_id
ORDER BY a.date;
```

### Consulter les Logs Admin

```sql
-- Dans admin_db
SELECT * FROM admin_logs ORDER BY created_at DESC;
```

## 🎨 Organisation DBeaver

### Couleurs Recommandées

- **Auth DB** : 🔴 Rouge (sécurité)
- **User DB** : 🔵 Bleu (utilisateurs)
- **Post DB** : 🟢 Vert (contenu)
- **Appointment DB** : 🟡 Jaune (planning)
- **Admin DB** : 🟣 Violet (administration)

### Favoris à Créer

1. **Requête de monitoring** : Nombre d'utilisateurs par rôle
2. **Requête de contenu** : Posts récents avec commentaires
3. **Requête de planning** : Rendez-vous du jour
4. **Requête de sécurité** : Logs d'administration récents

## ⚠️ Notes Importantes

### Sécurité

- ✅ **Développement uniquement** : Ces ports ne doivent être exposés qu'en local
- ❌ **Production** : Ne jamais exposer ces ports en production
- 🔒 **Mots de passe** : Utiliser des mots de passe forts en production

### Performance

- 📊 **Monitoring** : Surveiller la taille des tables
- 🔍 **Index** : Vérifier l'utilisation des index
- 🧹 **Nettoyage** : Nettoyer régulièrement les données de test

### Maintenance

- 💾 **Sauvegarde** : Sauvegarder régulièrement les configurations DBeaver
- 📝 **Documentation** : Documenter les requêtes complexes
- 🔄 **Mise à jour** : Maintenir DBeaver à jour

## 🚀 Prochaines Étapes

1. **Redémarrer les conteneurs** avec `docker-compose up -d`
2. **Configurer DBeaver** selon ce guide
3. **Tester les connexions** une par une
4. **Créer des requêtes favorites** pour le monitoring
5. **Intégrer dans votre workflow** de développement

Maintenant vous pouvez visualiser et gérer toutes vos bases de données Jolmood avec DBeaver ! 🎉
