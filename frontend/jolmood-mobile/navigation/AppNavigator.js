import React, { useContext } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthProvider, { AuthContext } from "../src/context/AuthContext";
import OnboardingScreen from "../screens/OnboardingScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import RoleSelectionScreen from "../screens/RoleSelectionScreen";
import UserDashboard from "../screens/UserDashboard";
import CoachDashboard from "../screens/CoachDashboard";
import AdminDashboard from "../screens/AdminDashboard";
import TabNavigator from "./TabNavigator";
import { COLORS } from "../src/theme/colors";
import ToastBinder from "../src/components/ToastBinder";

const Stack = createNativeStackNavigator();

function Wrapper() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  const role = user?.role || null;
  const themeColors =
    role === "coach"
      ? COLORS.coach
      : role === "admin"
      ? COLORS.admin
      : COLORS.particulier;

  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: themeColors.primary,
      background: themeColors.bg,
      text: themeColors.text,
      card: themeColors.card,
      border: "#e5e7eb",
      notification: themeColors.primary,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <ToastBinder />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!role ? (
          <>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen
              name="RoleSelection"
              component={RoleSelectionScreen}
            />
          </>
        ) : role === "admin" ? (
          <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        ) : (
          <Stack.Screen name="Main" component={TabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function AppNavigator() {
  return (
    <AuthProvider>
      <Wrapper />
    </AuthProvider>
  );
}
