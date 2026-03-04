import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { GourmetColors, GourmetRadii } from "@/constants/gourmet-theme";

export default function TenantDiscoveryScreen() {
  const router = useRouter();
  const [slug, setSlug] = useState("");
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };

  React.useEffect(() => {
    startPulse();
  }, []);

  const handleDiscover = async () => {
    if (!slug.trim()) {
      setError("Please enter your restaurant slug");
      return;
    }
    setError("");
    setLoading(true);
    // Simulate tenant lookup
    setTimeout(() => {
      setLoading(false);
      // Navigate to login with tenant context
      router.push(`/auth/login?tenant=${slug.trim().toLowerCase()}`);
    }, 1500);
  };

  const formattedSlug = slug
    ? `${slug.toLowerCase().replace(/[^a-z0-9-]/g, "-")}.gourmetflow.app`
    : "yourrestaurant.gourmetflow.app";

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Background gradient */}
      <LinearGradient
        colors={["#0F1117", "#161B25", "#0F1117"]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Ambient glow orbs */}
      <View style={[styles.orb, styles.orbTopLeft]} />
      <View style={[styles.orb, styles.orbBottomRight]} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo section */}
          <View style={styles.logoSection}>
            <Animated.View
              style={[
                styles.logoContainer,
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
              <LinearGradient
                colors={["#10B981", "#059669"]}
                style={styles.logoGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="restaurant" size={40} color="#fff" />
              </LinearGradient>
            </Animated.View>
            <Text style={styles.brandName}>GourmetFlow</Text>
            <Text style={styles.brandTagline}>Restaurant Management Suite</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            {/* Card header */}
            <View style={styles.cardHeader}>
              <View style={styles.cardIconBg}>
                <Ionicons
                  name="storefront-outline"
                  size={22}
                  color={GourmetColors.accent.emerald}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>Find Your Restaurant</Text>
                <Text style={styles.cardSubtitle}>
                  Enter your restaurant workspace slug to continue
                </Text>
              </View>
            </View>

            {/* Preview URL */}
            <View style={styles.urlPreview}>
              <Ionicons
                name="globe-outline"
                size={14}
                color={GourmetColors.text.muted}
              />
              <Text style={styles.urlText} numberOfLines={1}>
                {formattedSlug}
              </Text>
            </View>

            {/* Input group */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Restaurant Slug</Text>
              <View
                style={[
                  styles.inputWrapper,
                  focused && styles.inputWrapperFocused,
                  error ? styles.inputWrapperError : null,
                ]}
              >
                <TextInput
                  style={styles.input}
                  value={slug}
                  onChangeText={(t) => {
                    setSlug(t);
                    setError("");
                  }}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder="my-bistro"
                  placeholderTextColor={GourmetColors.text.muted}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="go"
                  onSubmitEditing={handleDiscover}
                />
                <Text style={styles.inputSuffix}>.gourmetflow.app</Text>
              </View>
              {error ? (
                <View style={styles.errorRow}>
                  <Ionicons name="alert-circle" size={14} color="#EF4444" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}
            </View>

            {/* CTA button */}
            <TouchableOpacity
              style={[styles.ctaButton, loading && { opacity: 0.6 }]}
              onPress={handleDiscover}
              disabled={loading}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={["#10B981", "#059669"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.ctaGradient}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Text style={styles.ctaText}>Continue</Text>
                    <Ionicons name="arrow-forward" size={20} color="#fff" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* New account */}
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => router.push("/auth/register" as any)}
            >
              <Ionicons
                name="add-circle-outline"
                size={18}
                color={GourmetColors.accent.emerald}
              />
              <Text style={styles.secondaryButtonText}>
                Create a new restaurant
              </Text>
            </TouchableOpacity>
          </View>

          {/* Bottom info */}
          <View style={styles.bottomInfo}>
            <Ionicons
              name="shield-checkmark-outline"
              size={14}
              color={GourmetColors.text.muted}
            />
            <Text style={styles.bottomInfoText}>
              Enterprise-grade security · SSL encrypted
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GourmetColors.bg.primary,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 60,
    gap: 28,
  },
  orb: {
    position: "absolute",
    borderRadius: 999,
  },
  orbTopLeft: {
    width: 300,
    height: 300,
    top: -100,
    left: -100,
    backgroundColor: "rgba(16,185,129,0.08)",
  },
  orbBottomRight: {
    width: 250,
    height: 250,
    bottom: -80,
    right: -80,
    backgroundColor: "rgba(139,92,246,0.06)",
  },
  logoSection: {
    alignItems: "center",
    gap: 8,
  },
  logoContainer: {
    marginBottom: 8,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: GourmetRadii.xl,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: GourmetColors.accent.emerald,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 16,
  },
  brandName: {
    fontSize: 32,
    fontWeight: "800",
    color: GourmetColors.text.primary,
    letterSpacing: -0.5,
  },
  brandTagline: {
    fontSize: 14,
    color: GourmetColors.text.muted,
    fontWeight: "500",
  },
  card: {
    backgroundColor: GourmetColors.bg.secondary,
    borderRadius: GourmetRadii.xxl,
    borderWidth: 1,
    borderColor: GourmetColors.bg.glassBorder,
    padding: 24,
    gap: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cardIconBg: {
    width: 44,
    height: 44,
    borderRadius: GourmetRadii.md,
    backgroundColor: GourmetColors.accent.emeraldGlow,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.2)",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: GourmetColors.text.primary,
  },
  cardSubtitle: {
    fontSize: 13,
    color: GourmetColors.text.secondary,
    marginTop: 2,
  },
  urlPreview: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: GourmetColors.bg.tertiary,
    borderRadius: GourmetRadii.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  urlText: {
    fontSize: 12,
    color: GourmetColors.accent.emerald,
    fontWeight: "500",
    flex: 1,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: GourmetColors.text.secondary,
    marginLeft: 2,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: GourmetColors.bg.tertiary,
    borderRadius: GourmetRadii.md,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.08)",
    height: 52,
    paddingHorizontal: 14,
  },
  inputWrapperFocused: {
    borderColor: GourmetColors.accent.emerald,
    shadowColor: GourmetColors.accent.emerald,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  inputWrapperError: {
    borderColor: GourmetColors.status.critical,
  },
  input: {
    flex: 1,
    color: GourmetColors.text.primary,
    fontSize: 16,
    fontWeight: "500",
  },
  inputSuffix: {
    fontSize: 13,
    color: GourmetColors.text.muted,
    fontWeight: "500",
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginLeft: 2,
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444",
    fontWeight: "500",
  },
  ctaButton: {
    borderRadius: GourmetRadii.md,
    overflow: "hidden",
    shadowColor: GourmetColors.accent.emerald,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 52,
    gap: 8,
  },
  ctaText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  dividerText: {
    fontSize: 13,
    color: GourmetColors.text.muted,
  },
  secondaryButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 48,
    borderRadius: GourmetRadii.md,
    borderWidth: 1.5,
    borderColor: "rgba(16,185,129,0.3)",
    gap: 8,
    backgroundColor: GourmetColors.accent.emeraldGlow,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: GourmetColors.accent.emerald,
  },
  bottomInfo: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  bottomInfoText: {
    fontSize: 12,
    color: GourmetColors.text.muted,
  },
});
