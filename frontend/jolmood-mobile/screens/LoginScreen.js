import React, { useContext, useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { AuthContext } from "../src/context/AuthContext";
import { COLORS } from "../src/theme/colors";
import { useToast } from "../src/context/ToastContext";

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const theme = COLORS.particulier;

  const onSubmit = async () => {
    try {
      await login(email, password);
    } catch (e) {
      toast.error("Email ou mot de passe invalide");
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: 24,
        backgroundColor: theme.bg,
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: "700",
          marginBottom: 16,
          color: theme.text,
        }}
      >
        Se connecter
      </Text>
      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={{
          backgroundColor: "#fff",
          padding: 12,
          borderRadius: 10,
          marginBottom: 10,
        }}
      />
      <TextInput
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{
          backgroundColor: "#fff",
          padding: 12,
          borderRadius: 10,
          marginBottom: 18,
        }}
      />
      <TouchableOpacity
        onPress={onSubmit}
        style={{
          backgroundColor: theme.primary,
          padding: 14,
          borderRadius: 12,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            color: theme.primaryText,
            fontWeight: "600",
          }}
        >
          Connexion
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("Register")}
        style={{ padding: 14, borderRadius: 12, marginTop: 12 }}
      >
        <Text style={{ textAlign: "center", color: theme.text }}>
          Créer un compte
        </Text>
      </TouchableOpacity>
    </View>
  );
}
