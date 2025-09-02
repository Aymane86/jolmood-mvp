import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { COLORS } from "../src/theme/colors";

export default function RoleSelectionScreen({ navigation }) {
  return (
    <View style={{ flex:1, justifyContent:"center", padding:24, backgroundColor:"#fff" }}>
      <Text style={{ fontSize:22, fontWeight:"700", marginBottom:16 }}>Choisis ton rôle</Text>
      <TouchableOpacity onPress={() => navigation.navigate("Login")} style={{ backgroundColor: COLORS.particulier.primary, padding:14, borderRadius:12, marginBottom:10 }}>
        <Text style={{ textAlign:"center", color:"#fff" }}>Je suis Particulier</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Login")} style={{ backgroundColor: COLORS.coach.primary, padding:14, borderRadius:12 }}>
        <Text style={{ textAlign:"center", color:"#fff" }}>Je suis Coach</Text>
      </TouchableOpacity>
    </View>
  );
}

