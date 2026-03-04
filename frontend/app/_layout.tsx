import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { TamaguiProvider } from "tamagui";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { View } from "react-native";

import config from "../tamagui.config";
import { GourmetColors } from "@/constants/gourmet-theme";

export const unstable_settings = {
  initialRouteName: "index",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <TamaguiProvider config={config} defaultTheme="dark">
      <View style={{ flex: 1, backgroundColor: GourmetColors.bg.primary }}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: GourmetColors.bg.primary },
          }}
        >
          {/* Legacy routes kept for backward compat */}
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
          {/* GourmetFlow SaaS routes */}
          <Stack.Screen
            name="auth"
            options={{ headerShown: false, animation: "fade" }}
          />
          <Stack.Screen
            name="(dashboard)"
            options={{ headerShown: false, animation: "fade" }}
          />
          {/* Modal */}
          <Stack.Screen name="modal" options={{ presentation: "modal" }} />
        </Stack>
        <StatusBar style="light" />
      </View>
    </TamaguiProvider>
  );
}
