import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SocialFeedScreen from "../screens/SocialFeedScreen";
import AppointmentScreen from "../screens/AppointmentScreen";
import UserDashboard from "../screens/UserDashboard";
import CoachDashboard from "../screens/CoachDashboard";
import CoachAppointmentsScreen from "../screens/CoachAppointmentsScreen";
import { AuthContext } from "../src/context/AuthContext";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const { user } = useContext(AuthContext);
  const role = user?.role || "particulier";

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Feed" component={SocialFeedScreen} />
      {role === "coach" ? (
        <>
          <Tab.Screen name="CoachRDV" component={CoachAppointmentsScreen} />
          <Tab.Screen name="Coach" component={CoachDashboard} />
        </>
      ) : (
        <>
          <Tab.Screen name="Appointments" component={AppointmentScreen} />
          <Tab.Screen name="Profile" component={UserDashboard} />
        </>
      )}
    </Tab.Navigator>
  );
}

