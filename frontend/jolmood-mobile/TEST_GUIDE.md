# 🧪 Guide de Test - Jolmood Mobile

## 📋 Prérequis

- ✅ Backend démarré (docker-compose up -d)
- ✅ Frontend démarré (npx expo start)
- ✅ API accessible sur http://localhost:8080

## 🎯 Tests à effectuer

### 1. **Authentification**

#### Test d'inscription

1. Ouvrir l'app sur http://localhost:8081 (Expo Web)
2. Cliquer sur "Créer un compte"
3. Remplir le formulaire :
   - Nom : "Test User"
   - Email : "test@example.com"
   - Téléphone : "0123456789"
   - Mot de passe : "password123"
   - Rôle : "Particulier"
4. Cliquer sur "S'inscrire"
5. **Résultat attendu** : Toast de succès + redirection vers l'app

#### Test de connexion

1. Se déconnecter
2. Cliquer sur "Se connecter"
3. Remplir :
   - Email : "test@example.com"
   - Mot de passe : "password123"
4. Cliquer sur "Connexion"
5. **Résultat attendu** : Connexion réussie + redirection

### 2. **Feed Social (Particulier)**

#### Test de création de post

1. Être connecté en tant que particulier
2. Aller dans l'onglet "Feed"
3. Remplir le formulaire :
   - Message : "Mon premier post de test !"
   - Media URL : "https://example.com/image.jpg" (optionnel)
4. Cliquer sur "Publier"
5. **Résultat attendu** : Post créé + toast de succès

#### Test de like

1. Cliquer sur "Like" sur un post
2. **Résultat attendu** : Toast d'info ou de succès

#### Test de commentaire

1. Écrire un commentaire dans la zone de texte
2. Cliquer sur "Envoyer"
3. **Résultat attendu** : Commentaire ajouté + liste mise à jour

### 3. **Rendez-vous (Particulier)**

#### Test de création de RDV

1. Aller dans l'onglet "Appointments"
2. Remplir le formulaire :
   - Coach ID : "test-coach-id" (UUID valide)
   - Date : "2025-09-01T15:00:00Z"
3. Cliquer sur "Créer"
4. **Résultat attendu** : RDV créé + toast de succès

### 4. **Coach Features**

#### Test de connexion coach

1. Créer un nouveau compte avec rôle "Coach"
2. Se connecter avec ce compte
3. **Résultat attendu** : Navigation différente (Feed + CoachRDV + Coach)

#### Test de gestion des RDV

1. Aller dans l'onglet "CoachRDV"
2. Vérifier les filtres :
   - ALL, PENDING, ACCEPTED, REJECTED
   - Tri par date (⬇︎/⬆︎)
   - Recherche par user_id
3. Cliquer sur "Accepter" ou "Rejeter" sur un RDV
4. **Résultat attendu** : Statut mis à jour + toast de succès

### 5. **Admin Features**

#### Test de connexion admin

1. Créer un compte avec rôle "Admin" (si possible)
2. Se connecter
3. **Résultat attendu** : Écran AdminDashboard avec statistiques

### 6. **Gestion d'erreurs**

#### Test de validation

1. Essayer de créer un compte avec email invalide
2. **Résultat attendu** : Toast d'erreur de validation

#### Test de réseau

1. Arrêter le backend (docker-compose down)
2. Essayer une action dans l'app
3. **Résultat attendu** : Toast d'erreur réseau
4. Redémarrer le backend (docker-compose up -d)

### 7. **Navigation et Thème**

#### Test de navigation

1. Vérifier que les onglets changent selon le rôle
2. Vérifier que les couleurs changent selon le rôle :
   - Particulier : Orange
   - Coach : Bleu
   - Admin : Vert

#### Test de déconnexion

1. Cliquer sur "Se déconnecter"
2. **Résultat attendu** : Retour à l'écran de connexion

## 🐛 Problèmes connus

### Si l'app ne se charge pas

- Vérifier que Expo est démarré : `npx expo start`
- Vérifier l'URL : http://localhost:8081

### Si l'API ne répond pas

- Vérifier le backend : `docker-compose ps`
- Redémarrer : `docker-compose restart`

### Si les toasts ne s'affichent pas

- Vérifier que ToastProvider est bien configuré
- Vérifier les logs de la console

## 📊 Checklist de validation

- [ ] Inscription utilisateur
- [ ] Connexion utilisateur
- [ ] Création de post
- [ ] Like de post
- [ ] Commentaire de post
- [ ] Création de RDV
- [ ] Gestion des RDV (coach)
- [ ] Filtres et tri
- [ ] Validation des formulaires
- [ ] Gestion d'erreurs
- [ ] Navigation par rôle
- [ ] Thème par rôle
- [ ] Toasts de notification
- [ ] Déconnexion

## 🎉 Succès !

Si tous les tests passent, l'application est fonctionnelle et prête pour la production !







