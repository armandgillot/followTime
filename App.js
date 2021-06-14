import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import BadgeuseScreen from "./Screens/BadgeuseScreen";
import CalendrierScreen from "./Screens/CalendrierScreen";
import OptionsScreen from "./Screens/OptionsScreens";

export default function App() {
  const Tab = createBottomTabNavigator();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color }) => {
            let iconName;

            if (route.name === "Badgeuse") {
              iconName = "time";
            } else if (route.name === "Calendrier") {
              iconName = "calendar-sharp";
            } else if (route.name === "Options") {
              iconName = "ios-options";
            }

            return <Ionicons name={iconName} size={25} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: "#F47C5D",
          inactiveTintColor: "#31A390",
          style: {
            // backgroundColor: "#273c75",
            paddingBottom: 5,
            paddingTop: 5,
          },
        }}
      >
        <Tab.Screen name="Badgeuse" component={BadgeuseScreen} />
        <Tab.Screen name="Calendrier" component={CalendrierScreen} />
        <Tab.Screen name="Options" component={OptionsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
