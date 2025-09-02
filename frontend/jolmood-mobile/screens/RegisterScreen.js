import React, { useContext, useMemo, useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { AuthContext } from "../src/context/AuthContext";
import { COLORS } from "../src/theme/colors";
import { useToast } from "../src/context/ToastContext";
import { ValidationService } from "../src/services/ValidationService";

export default function RegisterScreen() {
  const { register, login } = useContext(AuthContext);
  const toast = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("particulier"); // toggle Particulier / Coach

  const theme = useMemo(
    () => (role === "coach" ? COLORS.coach : COLORS.particulier),
    [role]
  );

  const onSubmit = async () => {
    // Validation des données
    const validation = ValidationService.registration({
      name,
      email,
      phone,
      password,
      role,
    });
    if (!validation.valid) {
      const firstError = Object.values(validation.errors)[0];
      toast.error(firstError);
      return;
    }

    try {
      await register({ name, email, phone, password, role });
      await login(email, password);
      toast.success("Compte créé avec succès !");
    } catch (e) {
      toast.error("Erreur lors de la création du compte");
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
        Créer un compte
      </Text>

      <View style={{ flexDirection: "row", gap: 10, marginBottom: 16 }}>
        <TouchableOpacity
          onPress={() => setRole("particulier")}
          style={{
            backgroundColor: role === "particulier" ? theme.primary : "#e5e7eb",
            padding: 10,
            borderRadius: 10,
          }}
        >
          <Text
            style={{
              color: role === "particulier" ? theme.primaryText : "#111827",
            }}
          >
            Particulier
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setRole("coach")}
          style={{
            backgroundColor:
              role === "coach" ? COLORS.coach.primary : "#e5e7eb",
            padding: 10,
            borderRadius: 10,
          }}
        >
          <Text
            style={{
              color: role === "coach" ? COLORS.coach.primaryText : "#111827",
            }}
          >
            Coach
          </Text>
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="Nom"
        value={name}
        onChangeText={setName}
        style={{
          backgroundColor: "#fff",
          padding: 12,
          borderRadius: 10,
          marginBottom: 10,
        }}
      />
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
        placeholder="Téléphone"
        value={phone}
        onChangeText={setPhone}
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
          S'inscrire
        </Text>
      </TouchableOpacity>
    </View>
  );
}
