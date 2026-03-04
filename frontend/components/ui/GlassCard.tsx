import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { GourmetColors, GourmetRadii } from "@/constants/gourmet-theme";

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  glowColor?: string;
  padding?: number;
  radius?: number;
  borderColor?: string;
}

export function GlassCard({
  children,
  style,
  glowColor,
  padding = 16,
  radius = GourmetRadii.lg,
  borderColor = GourmetColors.bg.glassBorder,
}: GlassCardProps) {
  return (
    <View
      style={[
        styles.card,
        {
          borderRadius: radius,
          padding,
          borderColor,
          ...(glowColor
            ? {
                shadowColor: glowColor,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.5,
                shadowRadius: 20,
                elevation: 16,
              }
            : styles.defaultShadow),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: GourmetColors.bg.glass,
    borderWidth: 1,
    overflow: "hidden",
  },
  defaultShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
});
