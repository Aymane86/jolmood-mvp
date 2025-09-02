import React from "react";
import { View, Text } from "react-native";

export default function StatsChart({ data, title }) {
  if (!data || Object.keys(data).length === 0) {
    return (
      <View
        style={{ padding: 16, backgroundColor: "#f9fafb", borderRadius: 8 }}
      >
        <Text style={{ textAlign: "center", opacity: 0.6 }}>
          Aucune donnée disponible
        </Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 16, backgroundColor: "#fff", borderRadius: 12 }}>
      {title && (
        <Text style={{ fontSize: 16, fontWeight: "700", marginBottom: 12 }}>
          {title}
        </Text>
      )}

      <View style={{ gap: 8 }}>
        {Object.entries(data).map(([key, value]) => (
          <View
            key={key}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 8,
              borderBottomWidth: 1,
              borderBottomColor: "#f3f4f6",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "500",
                textTransform: "capitalize",
              }}
            >
              {key.replace(/_/g, " ")}
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#111827" }}>
              {typeof value === "number" ? value.toLocaleString() : value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
