import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  RefreshControl,
} from "react-native";
import { AppointmentService } from "../src/services/AppointmentService";
import { AuthContext } from "../src/context/AuthContext";
import AppointmentCard from "../src/components/AppointmentCard";

function parseISO(s) {
  try {
    return new Date(s);
  } catch {
    return null;
  }
}
function formatIso(datetimeStr) {
  const d = parseISO(datetimeStr);
  if (!d) return datetimeStr || "";
  // ISO court lisible
  return d.toISOString().replace(".000Z", "Z");
}

const STATUS = ["all", "pending", "accepted", "rejected"];

export default function CoachAppointmentsScreen() {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [coachId, setCoachId] = useState(user?.sub || "");
  const [refreshing, setRefreshing] = useState(false);

  // UI state filtres/tri
  const [status, setStatus] = useState("all"); // all | pending | accepted | rejected
  const [sortDir, setSortDir] = useState("desc"); // desc | asc
  const [searchUser, setSearchUser] = useState(""); // filtre par user_id

  const load = useCallback(async () => {
    if (!coachId) return;
    try {
      const res = await AppointmentService.coach(coachId);
      setItems(res.data || []);
    } catch {
      setItems([]);
    }
  }, [coachId]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  useEffect(() => {
    load();
  }, [load]);

  const filteredSorted = useMemo(() => {
    let list = Array.isArray(items) ? [...items] : [];

    // filtre par status
    if (status !== "all") {
      list = list.filter((it) => (it.status || "").toLowerCase() === status);
    }

    // filtre par user_id
    if (searchUser.trim()) {
      const q = searchUser.trim().toLowerCase();
      list = list.filter((it) => (it.user_id || "").toLowerCase().includes(q));
    }

    // tri par date
    list.sort((a, b) => {
      const da = parseISO(a?.date)?.getTime() ?? 0;
      const db = parseISO(b?.date)?.getTime() ?? 0;
      return sortDir === "asc" ? da - db : db - da;
    });

    return list;
  }, [items, status, sortDir, searchUser]);

  const update = async (id, next) => {
    try {
      await AppointmentService.updateStatus(id, next);
      await load();
    } catch {
      Alert.alert(
        "Erreur",
        "Action impossible. Vérifie le rôle (coach) et l'ID de RDV."
      );
    }
  };

  // UI helpers
  const StatusPill = ({ value }) => {
    const color =
      value === "accepted"
        ? "#22c55e"
        : value === "rejected"
        ? "#ef4444"
        : "#f59e0b";
    return (
      <View
        style={{
          backgroundColor: color,
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 999,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "700", fontSize: 12 }}>
          {value.toUpperCase()}
        </Text>
      </View>
    );
  };

  const FilterButton = ({ label, active, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: active ? "#111827" : "#e5e7eb",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 999,
      }}
    >
      <Text style={{ color: active ? "#fff" : "#111827", fontWeight: "600" }}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 8 }}>
        Mes RDV (Coach)
      </Text>

      {/* Identité coach + recherche user */}
      <View
        style={{
          backgroundColor: "#fff",
          padding: 12,
          borderRadius: 12,
          marginBottom: 10,
        }}
      >
        <Text style={{ fontWeight: "600", marginBottom: 6 }}>Coach ID</Text>
        <TextInput
          placeholder="Coach ID (rempli automatiquement)"
          value={coachId}
          onChangeText={setCoachId}
          style={{
            backgroundColor: "#f9fafb",
            padding: 10,
            borderRadius: 8,
            marginBottom: 8,
          }}
        />
        <Text style={{ fontWeight: "600", marginBottom: 6 }}>
          Filtrer par User ID
        </Text>
        <TextInput
          placeholder="Recherche par user_id (UUID ou fragment)"
          value={searchUser}
          onChangeText={setSearchUser}
          style={{ backgroundColor: "#f9fafb", padding: 10, borderRadius: 8 }}
        />
      </View>

      {/* Barre de filtres statut */}
      <View
        style={{
          flexDirection: "row",
          gap: 8,
          marginBottom: 10,
          flexWrap: "wrap",
        }}
      >
        {STATUS.map((s) => (
          <FilterButton
            key={s}
            label={s.toUpperCase()}
            active={status === s}
            onPress={() => setStatus(s)}
          />
        ))}
        <FilterButton
          label={sortDir === "desc" ? "Date ⬇︎" : "Date ⬆︎"}
          active={true}
          onPress={() => setSortDir(sortDir === "desc" ? "asc" : "desc")}
        />
        <FilterButton label={"Rafraîchir"} active={false} onPress={onRefresh} />
      </View>

      <FlatList
        data={filteredSorted}
        keyExtractor={(it, idx) => String(it.id || idx)}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <AppointmentCard
            item={item}
            onAccept={() => update(item.id, "accepted")}
            onReject={() => update(item.id, "rejected")}
            onRefresh={onRefresh}
          />
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", opacity: 0.6, marginTop: 16 }}>
            Aucun rendez-vous (vérifie les filtres).
          </Text>
        }
      />
    </View>
  );
}
