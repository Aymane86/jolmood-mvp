import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

export default function OnboardingScreen({ navigation }) {
  return (
    <View style={{ flex:1, alignItems:"center", justifyContent:"center", padding:24 }}>
      <Image source={{ uri:"https://placekitten.com/400/300" }} style={{ width:280, height:200, borderRadius:16, marginBottom:20 }} />
      <Text style={{ fontSize:24, fontWeight:"700", textAlign:"center", marginBottom:12 }}>Bienvenue sur Jolmood</Text>
      <Text style={{ fontSize:16, textAlign:"center", opacity:0.7, marginBottom:24 }}>
        Coaching, bien-être et communauté. Faites-vous accompagner par des coachs
        et partagez vos progrès avec la communauté.
      </Text>
      <TouchableOpacity onPress={() => navigation.navigate("Login")} style={{ backgroundColor:"#111827", padding:14, borderRadius:12, width:"100%" }}>
        <Text style={{ textAlign:"center", color:"white", fontWeight:"600" }}>Commencer</Text>
      </TouchableOpacity>
    </View>
  );
}

