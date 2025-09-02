# 📱 Guide de Test sur Téléphone - Jolmood Mobile

## 🚀 **Démarrage rapide**

### ✅ Prérequis vérifiés

- **Backend** : Démarré sur http://192.168.1.136:8080
- **Frontend** : Expo démarré
- **Réseau** : PC et téléphone sur le même réseau Wi-Fi

## 📱 **Installation sur téléphone**

### Option 1 : Expo Go (Recommandé)

1. **Installer Expo Go** depuis l'App Store (iOS) ou Google Play (Android)
2. **Scanner le QR code** affiché dans le terminal Expo
3. **L'app se télécharge automatiquement**

### Option 2 : QR Code manuel

Si le QR code ne fonctionne pas :

1. **Ouvrir Expo Go**
2. **Taper l'URL** : `exp://192.168.1.136:8081`

## 🧪 **Tests à effectuer sur téléphone**

### 1. **Test de connectivité**

1. Ouvrir l'app sur votre téléphone
2. **Vérifier** : L'app se charge sans erreur
3. **Vérifier** : Pas d'erreur de connexion API

### 2. **Test d'inscription**

1. Cliquer sur "Créer un compte"
2. Remplir le formulaire :
   - **Nom** : "Test Mobile"
   - **Email** : "mobile@test.com"
   - **Téléphone** : "0123456789"
   - **Mot de passe** : "password123"
   - **Rôle** : "Particulier"
3. Cliquer sur "S'inscrire"
4. **Résultat attendu** : Toast vert "Compte créé avec succès !"

### 3. **Test de connexion**

1. Se déconnecter
2. Cliquer sur "Se connecter"
3. Remplir :
   - **Email** : "mobile@test.com"
   - **Mot de passe** : "password123"
4. Cliquer sur "Connexion"
5. **Résultat attendu** : Connexion réussie + onglets visibles

### 4. **Test du Feed Social**

1. Aller dans l'onglet "Feed"
2. Créer un post :
   - **Message** : "Test depuis mon téléphone ! 📱"
   - **Media URL** : "https://example.com/photo.jpg" (optionnel)
3. Cliquer sur "Publier"
4. **Résultat attendu** : Post créé + toast de succès

### 5. **Test des interactions**

1. **Like** : Cliquer sur "Like" sur un post
2. **Commentaire** : Écrire "Super post !" et cliquer "Envoyer"
3. **Résultat attendu** : Actions réussies + feedback visuel

### 6. **Test des Rendez-vous**

1. Aller dans l'onglet "Appointments"
2. Créer un RDV :
   - **Coach ID** : "550e8400-e29b-41d4-a716-446655440000" (UUID valide)
   - **Date** : "2025-09-01T15:00:00Z"
3. Cliquer sur "Créer"
4. **Résultat attendu** : RDV créé + toast de succès

### 7. **Test Coach (nouveau compte)**

1. Se déconnecter
2. Créer un nouveau compte avec rôle "Coach"
3. Se connecter
4. **Vérifier** : Navigation différente (Feed + CoachRDV + Coach)
5. Aller dans "CoachRDV"
6. **Tester les filtres** : ALL, PENDING, ACCEPTED, REJECTED
7. **Tester le tri** : Date ⬇︎/⬆︎

### 8. **Test de validation**

1. Essayer de créer un compte avec email invalide
2. **Résultat attendu** : Toast rouge d'erreur de validation

### 9. **Test de navigation**

1. **Vérifier** : Les onglets changent selon le rôle
2. **Vérifier** : Les couleurs changent selon le rôle
3. **Vérifier** : La déconnexion fonctionne

## 🎯 **Fonctionnalités à vérifier**

### ✅ Interface utilisateur

- [ ] L'app se charge correctement
- [ ] Les formulaires sont utilisables
- [ ] Les boutons répondent au toucher
- [ ] Les toasts s'affichent correctement
- [ ] La navigation est fluide

### ✅ Authentification

- [ ] Inscription fonctionne
- [ ] Connexion fonctionne
- [ ] Déconnexion fonctionne
- [ ] Validation des formulaires

### ✅ Fonctionnalités

- [ ] Création de posts
- [ ] Like de posts
- [ ] Commentaires
- [ ] Création de RDV
- [ ] Gestion des RDV (coach)

### ✅ Gestion d'erreurs

- [ ] Erreurs de validation
- [ ] Erreurs réseau
- [ ] Messages d'erreur clairs

## 🐛 **Problèmes courants**

### L'app ne se charge pas

- **Vérifier** : PC et téléphone sur le même réseau Wi-Fi
- **Vérifier** : Expo Go installé
- **Vérifier** : QR code scanné correctement

### Erreur de connexion API

- **Vérifier** : Backend démarré (`docker-compose ps`)
- **Vérifier** : IP correcte dans `src/config/api.js`
- **Vérifier** : Port 8080 accessible

### L'app plante

- **Redémarrer** : Expo Go
- **Redémarrer** : L'application
- **Vérifier** : Les logs dans le terminal Expo

## 📊 **Checklist de validation mobile**

- [ ] Installation réussie
- [ ] Chargement de l'app
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
- [ ] Performance fluide

## 🎉 **Succès !**

Si tous les tests passent sur votre téléphone, l'application est **prête pour la production mobile** !

### 📱 **URLs importantes**

- **Backend API** : http://192.168.1.136:8080
- **Frontend Expo** : exp://192.168.1.136:8081
- **Health Check** : http://192.168.1.136:8080/health

### 🔧 **Commandes utiles**

```bash
# Vérifier le backend
docker-compose ps

# Redémarrer le backend
docker-compose restart

# Vérifier les logs
docker-compose logs gateway
```







