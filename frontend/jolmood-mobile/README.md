# Jolmood Mobile App

Application React Native/Expo pour la plateforme de coaching Jolmood.

## 🚀 Démarrage rapide

```bash
# Installer les dépendances
npx expo install

# Lancer l'application
npx expo start
```

## 📱 Fonctionnalités

### Authentification

- Inscription/Connexion avec sélection de rôle
- Gestion des tokens JWT
- Logout automatique sur erreur 401

### Rôles utilisateurs

- **Particulier** : Consultation du feed, prise de RDV
- **Coach** : Gestion des RDV, acceptation/rejet
- **Admin** : Tableau de bord avec statistiques

### Navigation

- Stack Navigator pour l'authentification
- Tab Navigator conditionnel selon le rôle
- Thème dynamique par rôle (orange/bleu/vert)

## 🧩 Composants réutilisables

### PostCard

Affiche un post avec fonctionnalités like et commentaires.

```jsx
import { PostCard } from "../src/components";

<PostCard item={postData} onChanged={refreshFunction} />;
```

### AppointmentCard

Carte de rendez-vous avec actions optionnelles.

```jsx
import { AppointmentCard } from "../src/components";

<AppointmentCard
  item={appointmentData}
  onAccept={() => handleAccept(id)}
  onReject={() => handleReject(id)}
  onRefresh={refreshFunction}
/>;
```

### CommentBox

Gestion des commentaires pour les posts.

```jsx
import { CommentBox } from "../src/components";

<CommentBox postId={postId} onCommentAdded={refreshFunction} />;
```

### StatsChart

Affichage de statistiques en format tableau.

```jsx
import { StatsChart } from "../src/components";

<StatsChart data={{ users: 150, posts: 300 }} title="Statistiques" />;
```

### LoadingSpinner

Indicateur de chargement personnalisable.

```jsx
import { LoadingSpinner } from "../src/components";

<LoadingSpinner
  loading={isLoading}
  message="Chargement des données..."
  size="large"
/>;
```

### Toast

Notifications temporaires avec animations.

```jsx
import { useToast } from "../src/context/ToastContext";

const toast = useToast();
toast.success("Opération réussie !");
toast.error("Une erreur est survenue");
toast.warning("Attention");
toast.info("Information");
```

## 🔧 Configuration API

L'URL de l'API s'adapte automatiquement selon la plateforme :

- **Web/iOS Simulator** : `http://localhost:8080`
- **Android Emulator** : `http://10.0.2.2:8080`
- **Device physique** : IP configurable dans `src/config/api.js`

## 🎨 Thème

Couleurs par rôle :

- **Particulier** : Orange (#FF7A00)
- **Coach** : Bleu (#2563EB)
- **Admin** : Vert (#10B981)

## 📁 Structure des fichiers

```
src/
├── components/          # Composants réutilisables
├── config/             # Configuration (API, etc.)
├── context/            # Contextes React (Auth)
├── services/           # Services API
└── theme/              # Thème et couleurs
```

## 🔌 Services API

- **AuthService** : Authentification
- **PostService** : Gestion des posts
- **AppointmentService** : Gestion des RDV
- **ApiService** : Configuration axios globale

## 🚨 Gestion d'erreurs

- Intercepteur axios pour les erreurs 401
- Logout automatique sur token expiré
- Timeout de 15 secondes sur les requêtes
- Messages d'erreur utilisateur-friendly
- Système de toasts pour les notifications
- Gestion des erreurs réseau (pas de connexion, timeout)

## 🧪 Validation

- Service de validation pour tous les formulaires
- Validation email, mot de passe, nom, téléphone
- Validation des dates de rendez-vous
- Validation des UUIDs
- Messages d'erreur personnalisés

## 💾 Cache & Performance

- Cache en mémoire et persistant
- Cache spécifique pour posts, rendez-vous, stats
- Expiration automatique des données
- Amélioration des performances de chargement
