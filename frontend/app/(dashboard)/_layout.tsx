import React from "react";
import { Tabs } from "expo-router";
import { View, Platform, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GourmetColors } from "@/constants/gourmet-theme";

function TabIcon({
  name,
  focused,
  color,
}: {
  name: any;
  focused: boolean;
  color: string;
}) {
  return (
    <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
      <Ionicons
        name={focused ? name : `${name}-outline`}
        size={22}
        color={color}
      />
    </View>
  );
}

export default function DashboardLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: GourmetColors.accent.emerald,
        tabBarInactiveTintColor: GourmetColors.text.muted,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="pos"
        options={{
          title: "POS",
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="grid" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="kds"
        options={{
          title: "Kitchen",
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="flame" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="inventory"
        options={{
          title: "Inventory",
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="cube" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="settings" focused={focused} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: GourmetColors.bg.secondary,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
    height: Platform.OS === "ios" ? 84 : 64,
    paddingBottom: Platform.OS === "ios" ? 24 : 8,
    paddingTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 20,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  iconWrapperActive: {
    backgroundColor: GourmetColors.accent.emeraldGlow,
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.2)",
  },
});
