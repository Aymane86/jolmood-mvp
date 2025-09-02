import { Platform } from "react-native";

const LOCALHOST_WEB = "http://localhost:8080"; // Expo Web / iOS Sim
const ANDROID_EMULATOR = "http://10.0.2.2:8080"; // Android émulateur
// Si tu testes sur téléphone réel, remplace ci‑dessous par l'IP locale de ton PC:
const LAN_DEVICE = "http://192.168.1.136:8080"; // ← IP de votre PC

let base = LOCALHOST_WEB;
if (Platform.OS === "android") base = ANDROID_EMULATOR;
// Pour forcer l'usage de ton LAN en device réel, décommente la ligne suivante:
base = LAN_DEVICE;

export const API_URL = base;
