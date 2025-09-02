import React, { useContext, useEffect, useState } from "react";
import { View, Text } from "react-native";
import { AuthContext } from "../src/context/AuthContext";
import api from "../src/services/ApiService";
import { COLORS } from "../src/theme/colors";
import StatsChart from "../src/components/StatsChart";
import LoadingSpinner from "../src/components/LoadingSpinner";

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const theme = COLORS.admin;
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/admin/stats");
        setStats(res.data);
      } catch (e) {
        setStats(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <View style={{ flex: 1, padding: 24, backgroundColor: theme.bg }}>
      <Text
        style={{
          fontSize: 22,
          fontWeight: "700",
          color: theme.text,
          marginBottom: 10,
        }}
      >
        Admin Dashboard
      </Text>
      <Text style={{ color: theme.muted, marginBottom: 16 }}>
        {user?.email}
      </Text>
      {loading ? (
        <LoadingSpinner message="Chargement des statistiques..." />
      ) : stats ? (
        <StatsChart data={stats} title="Statistiques globales" />
      ) : (
        <Text style={{ textAlign: "center", opacity: 0.6 }}>
          Impossible de charger les statistiques
        </Text>
      )}
    </View>
  );
}
