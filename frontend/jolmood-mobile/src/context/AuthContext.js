import React, { createContext, useEffect, useState, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "../config/api";
import api, { bindLogout, bindToast } from "../services/ApiService";
import { useToast } from "./ToastContext";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null); // { sub, email, role }
  const [loading, setLoading] = useState(true);

  // Note: useToast ne peut pas être utilisé ici car AuthProvider est plus haut dans l'arbre
  // que ToastProvider. On utilisera bindToast dans useEffect.

  useEffect(() => {
    (async () => {
      try {
        const t = await AsyncStorage.getItem("token");
        if (t) {
          setToken(t);
          await fetchMe(t);
        }
      } catch (e) {
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    bindLogout(logout);
    // bindToast sera configuré dans un composant enfant qui a accès au ToastContext
  }, []);

  const fetchMe = async (tkn) => {
    try {
      const res = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${tkn}` },
      });
      setUser(res.data.user);
    } catch (e) {
      setUser(null);
    }
  };

  const login = async (email, password) => {
    const res = await axios.post(`${API_URL}/auth/login`, { email, password });
    const tkn = res.data.access_token;
    await AsyncStorage.setItem("token", tkn);
    setToken(tkn);
    await fetchMe(tkn);
  };

  const register = async (payload) => {
    await axios.post(`${API_URL}/auth/register`, payload);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, user, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
