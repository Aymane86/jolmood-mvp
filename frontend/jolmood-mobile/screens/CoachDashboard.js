import React, { useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AuthContext } from "../src/context/AuthContext";
import { COLORS } from "../src/theme/colors";

export default function CoachDashboard() {
  const { user, logout } = useContext(AuthContext);
  const theme = COLORS.coach;
  return (
    <View style={{ flex:1, padding:24, backgroundColor: theme.bg }}>
      <Text style={{ fontSize:22, fontWeight:"700", color: theme.text, marginBottom:10 }}>Espace Coach</Text>
      <Text style={{ color: theme.muted, marginBottom:16 }}>{user?.email}</Text>
      <TouchableOpacity onPress={logout} style={{ backgroundColor: theme.primary, padding:12, borderRadius:10, alignSelf:"flex-start" }}>
        <Text style={{ color: theme.primaryText, fontWeight:"600" }}>Se déconnecter</Text>
      </TouchableOpacity>
    </View>
  );
}

