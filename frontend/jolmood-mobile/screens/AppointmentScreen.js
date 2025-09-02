import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { AppointmentService } from "../src/services/AppointmentService";
import { AuthContext } from "../src/context/AuthContext";
import AppointmentCard from "../src/components/AppointmentCard";

export default function AppointmentScreen() {
  const { user } = useContext(AuthContext);
  const [coachId, setCoachId] = useState("");
  const [date, setDate] = useState("2025-09-01T15:00:00Z");
  const [items, setItems] = useState([]);

  const loadMine = async () => {
    if (!user?.sub) return;
    const res = await AppointmentService.mine(user.sub);
    setItems(res.data || []);
  };

  const onCreate = async () => {
    try {
      await AppointmentService.create({ coach_id: coachId, date });
      Alert.alert("OK", "RDV créé");
      setCoachId("");
      await loadMine();
    } catch (e) {
      Alert.alert("Erreur", "Impossible de créer le RDV");
    }
  };

  useEffect(() => {
    loadMine();
  }, [user?.sub]);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {user?.role === "particulier" ? (
        <View
          style={{
            backgroundColor: "#fff",
            padding: 12,
            borderRadius: 12,
            marginBottom: 16,
          }}
        >
          <Text style={{ fontWeight: "700", marginBottom: 8 }}>
            Prendre un rendez-vous
          </Text>
          <TextInput
            placeholder="Coach ID"
            value={coachId}
            onChangeText={setCoachId}
            style={{
              backgroundColor: "#f9fafb",
              padding: 10,
              borderRadius: 8,
              marginBottom: 8,
            }}
          />
          <TextInput
            placeholder="Date ISO (ex: 2025-09-01T15:00:00Z)"
            value={date}
            onChangeText={setDate}
            style={{
              backgroundColor: "#f9fafb",
              padding: 10,
              borderRadius: 8,
              marginBottom: 8,
            }}
          />
          <TouchableOpacity
            onPress={onCreate}
            style={{
              backgroundColor: "#111827",
              padding: 12,
              borderRadius: 10,
            }}
          >
            <Text
              style={{ color: "#fff", fontWeight: "600", textAlign: "center" }}
            >
              Créer
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={{ marginBottom: 8 }}>
          Vue RDV (coach): consulte tes RDV côté coach
        </Text>
      )}

      <FlatList
        data={items}
        keyExtractor={(it, idx) => String(it.id || idx)}
        renderItem={({ item }) => (
          <AppointmentCard item={item} onRefresh={loadMine} />
        )}
      />
    </View>
  );
}
