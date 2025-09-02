import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function AppointmentCard({
  item,
  onAccept,
  onReject,
  onRefresh,
}) {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 12,
        marginBottom: 10,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontWeight: "700" }}>{item.date}</Text>
        <View
          style={{
            backgroundColor:
              item.status === "accepted"
                ? "#22c55e"
                : item.status === "rejected"
                ? "#ef4444"
                : "#f59e0b",
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 999,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 12 }}>
            {(item.status || "pending").toUpperCase()}
          </Text>
        </View>
      </View>
      {item.user_id ? (
        <Text style={{ opacity: 0.65, marginTop: 4 }}>
          Particulier: {item.user_id}
        </Text>
      ) : null}
      {item.coach_id ? (
        <Text style={{ opacity: 0.65, marginTop: 2 }}>
          Coach: {item.coach_id}
        </Text>
      ) : null}

      {(onAccept || onReject || onRefresh) && (
        <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
          {onAccept && (
            <TouchableOpacity
              onPress={onAccept}
              style={{
                backgroundColor: "#22c55e",
                paddingVertical: 10,
                paddingHorizontal: 14,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>Accepter</Text>
            </TouchableOpacity>
          )}
          {onReject && (
            <TouchableOpacity
              onPress={onReject}
              style={{
                backgroundColor: "#ef4444",
                paddingVertical: 10,
                paddingHorizontal: 14,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>Rejeter</Text>
            </TouchableOpacity>
          )}
          {onRefresh && (
            <TouchableOpacity
              onPress={onRefresh}
              style={{
                backgroundColor: "#111827",
                paddingVertical: 10,
                paddingHorizontal: 14,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>
                Rafraîchir
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}
