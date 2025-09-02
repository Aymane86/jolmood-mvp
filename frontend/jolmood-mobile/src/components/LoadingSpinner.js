import React from "react";
import { View, Text, ActivityIndicator } from "react-native";

export default function LoadingSpinner({
  loading = true,
  message = "Chargement...",
  size = "small",
  color = "#111827",
}) {
  if (!loading) return null;

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <ActivityIndicator size={size} color={color} />
      <Text
        style={{
          marginTop: 12,
          fontSize: 14,
          opacity: 0.7,
          textAlign: "center",
        }}
      >
        {message}
      </Text>
    </View>
  );
}







