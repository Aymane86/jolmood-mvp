import AsyncStorage from "@react-native-async-storage/async-storage";

// Service de cache simple avec expiration
export const CacheService = {
  // Cache en mémoire pour les données fréquemment accédées
  memoryCache: new Map(),

  // Générer une clé de cache
  generateKey: (prefix, identifier) => `${prefix}_${identifier}`,

  // Sauvegarder en cache (mémoire + AsyncStorage)
  set: async (key, data, ttl = 5 * 60 * 1000) => {
    // 5 minutes par défaut
    const cacheItem = {
      data,
      timestamp: Date.now(),
      ttl,
    };

    // Cache mémoire (plus rapide)
    CacheService.memoryCache.set(key, cacheItem);

    // Cache persistant
    try {
      await AsyncStorage.setItem(key, JSON.stringify(cacheItem));
    } catch (error) {
      console.log("Erreur cache AsyncStorage:", error);
    }
  },

  // Récupérer du cache
  get: async (key) => {
    // Vérifier d'abord le cache mémoire
    const memoryItem = CacheService.memoryCache.get(key);
    if (memoryItem && !CacheService.isExpired(memoryItem)) {
      return memoryItem.data;
    }

    // Vérifier le cache persistant
    try {
      const storedItem = await AsyncStorage.getItem(key);
      if (storedItem) {
        const cacheItem = JSON.parse(storedItem);
        if (!CacheService.isExpired(cacheItem)) {
          // Remettre en cache mémoire
          CacheService.memoryCache.set(key, cacheItem);
          return cacheItem.data;
        }
      }
    } catch (error) {
      console.log("Erreur lecture cache:", error);
    }

    return null;
  },

  // Vérifier si un item est expiré
  isExpired: (cacheItem) => {
    return Date.now() - cacheItem.timestamp > cacheItem.ttl;
  },

  // Supprimer du cache
  remove: async (key) => {
    CacheService.memoryCache.delete(key);
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.log("Erreur suppression cache:", error);
    }
  },

  // Vider tout le cache
  clear: async () => {
    CacheService.memoryCache.clear();
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter((key) => key.startsWith("cache_"));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.log("Erreur vidage cache:", error);
    }
  },

  // Cache spécifique pour les posts
  posts: {
    set: async (data) => {
      await CacheService.set("cache_posts", data, 2 * 60 * 1000); // 2 minutes
    },
    get: async () => {
      return await CacheService.get("cache_posts");
    },
    clear: async () => {
      await CacheService.remove("cache_posts");
    },
  },

  // Cache spécifique pour les rendez-vous
  appointments: {
    set: async (userId, data) => {
      const key = CacheService.generateKey("cache_appointments", userId);
      await CacheService.set(key, data, 1 * 60 * 1000); // 1 minute
    },
    get: async (userId) => {
      const key = CacheService.generateKey("cache_appointments", userId);
      return await CacheService.get(key);
    },
    clear: async (userId) => {
      const key = CacheService.generateKey("cache_appointments", userId);
      await CacheService.remove(key);
    },
  },

  // Cache spécifique pour les statistiques admin
  stats: {
    set: async (data) => {
      await CacheService.set("cache_stats", data, 5 * 60 * 1000); // 5 minutes
    },
    get: async () => {
      return await CacheService.get("cache_stats");
    },
    clear: async () => {
      await CacheService.remove("cache_stats");
    },
  },
};







