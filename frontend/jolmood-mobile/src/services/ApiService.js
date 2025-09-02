import axios from "axios";
import { API_URL } from "../config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({ baseURL: API_URL, timeout: 15000 });

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// NEW: gestion erreurs globale + 401 -> logout
let _logout = null;
let _showToast = null;

export const bindLogout = (fn) => {
  _logout = fn;
};

export const bindToast = (fn) => {
  _showToast = fn;
};

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error?.response?.status;
    const message =
      error?.response?.data?.detail || error?.message || "Erreur réseau";

    if (status === 401 && _logout) {
      try {
        await _logout();
        _showToast &&
          _showToast("Session expirée, veuillez vous reconnecter", "warning");
      } catch {}
    } else if (status >= 500) {
      _showToast && _showToast("Erreur serveur, veuillez réessayer", "error");
    } else if (status >= 400) {
      _showToast && _showToast(message, "error");
    } else if (error.code === "NETWORK_ERROR") {
      _showToast && _showToast("Pas de connexion internet", "error");
    } else if (error.code === "ECONNABORTED") {
      _showToast && _showToast("Délai d'attente dépassé", "warning");
    }

    return Promise.reject(error);
  }
);

export default api;
