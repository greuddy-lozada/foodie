import React, { useState } from "react";
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
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { GourmetColors, GourmetRadii } from "@/constants/gourmet-theme";

export default function GourmetLoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ tenant?: string }>();
  const tenant = params.tenant ?? "restaurant";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    else if (password.length < 6)
      e.password = "Password must be at least 6 characters";
    return e;
  };

  const handleLogin = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setErrors({});
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace("/(dashboard)/pos" as any);
    }, 1800);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={["#0F1117", "#161B25", "#0F1117"]}
        style={StyleSheet.absoluteFillObject}
      />
      {/* Ambient orbs */}
      <View
        style={[
          styles.orb,
          { top: -80, left: -80, backgroundColor: "rgba(16,185,129,0.07)" },
        ]}
      />
      <View
        style={[
          styles.orb,
          {
            bottom: -60,
            right: -60,
            width: 200,
            height: 200,
            backgroundColor: "rgba(249,115,22,0.05)",
          },
        ]}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back + Tenant badge */}
          <View style={styles.topRow}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => router.back()}
            >
              <Ionicons
                name="arrow-back"
                size={20}
                color={GourmetColors.text.secondary}
              />
            </TouchableOpacity>
            <View style={styles.tenantBadge}>
              <View style={styles.tenantDot} />
              <Text style={styles.tenantText}>{tenant}.gourmetflow.app</Text>
            </View>
          </View>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoMini}>
              <Ionicons
                name="restaurant"
                size={22}
                color={GourmetColors.accent.emerald}
              />
            </View>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>
              Sign in to your GourmetFlow dashboard
            </Text>
          </View>

          {/* General error */}
          {errors.general ? (
            <View style={styles.generalError}>
              <Ionicons name="warning" size={16} color="#EF4444" />
              <Text style={styles.generalErrorText}>{errors.general}</Text>
            </View>
          ) : null}

          {/* Form card */}
          <View style={styles.formCard}>
            {/* Email */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email address</Text>
              <View
                style={[
                  styles.inputWrapper,
                  emailFocused && styles.inputFocused,
                  errors.email && styles.inputError,
                ]}
              >
                <Ionicons
                  name="mail-outline"
                  size={18}
                  color={
                    emailFocused
                      ? GourmetColors.accent.emerald
                      : GourmetColors.text.muted
                  }
                />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={(t) => {
                    setEmail(t);
                    setErrors((p) => ({ ...p, email: undefined }));
                  }}
                  placeholder="you@restaurant.com"
                  placeholderTextColor={GourmetColors.text.muted}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                />
              </View>
              {errors.email ? (
                <Text style={styles.fieldError}>{errors.email}</Text>
              ) : null}
            </View>

            {/* Password */}
            <View style={styles.fieldGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Password</Text>
                <TouchableOpacity>
                  <Text style={styles.forgotLink}>Forgot password?</Text>
                </TouchableOpacity>
              </View>
              <View
                style={[
                  styles.inputWrapper,
                  passwordFocused && styles.inputFocused,
                  errors.password && styles.inputError,
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color={
                    passwordFocused
                      ? GourmetColors.accent.emerald
                      : GourmetColors.text.muted
                  }
                />
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={(t) => {
                    setPassword(t);
                    setErrors((p) => ({ ...p, password: undefined }));
                  }}
                  placeholder="••••••••"
                  placeholderTextColor={GourmetColors.text.muted}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                />
                <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={18}
                    color={GourmetColors.text.muted}
                  />
                </TouchableOpacity>
              </View>
              {errors.password ? (
                <Text style={styles.fieldError}>{errors.password}</Text>
              ) : null}
            </View>

            {/* Sign in button */}
            <TouchableOpacity
              style={[styles.ctaBtn, loading && { opacity: 0.7 }]}
              onPress={handleLogin}
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
                    <Text style={styles.ctaText}>Sign In</Text>
                    <Ionicons name="arrow-forward" size={18} color="#fff" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Register link */}
          <View style={styles.registerRow}>
            <Text style={styles.registerText}>New to GourmetFlow?</Text>
            <TouchableOpacity
              onPress={() => router.push("/auth/register" as any)}
            >
              <Text style={styles.registerLink}> Create workspace</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: GourmetColors.bg.primary },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 40,
    gap: 24,
  },
  orb: { position: "absolute", width: 250, height: 250, borderRadius: 999 },
  topRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: GourmetRadii.md,
    backgroundColor: GourmetColors.bg.secondary,
    borderWidth: 1,
    borderColor: GourmetColors.bg.glassBorder,
    justifyContent: "center",
    alignItems: "center",
  },
  tenantBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: GourmetColors.bg.secondary,
    borderRadius: GourmetRadii.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: GourmetColors.bg.glassBorder,
  },
  tenantDot: {
    width: 7,
    height: 7,
    borderRadius: 99,
    backgroundColor: GourmetColors.accent.emerald,
  },
  tenantText: {
    fontSize: 12,
    color: GourmetColors.text.secondary,
    fontWeight: "500",
  },
  header: { alignItems: "center", gap: 8 },
  logoMini: {
    width: 52,
    height: 52,
    borderRadius: GourmetRadii.lg,
    backgroundColor: GourmetColors.accent.emeraldGlow,
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.25)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: GourmetColors.text.primary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: GourmetColors.text.secondary,
    textAlign: "center",
  },
  generalError: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(239,68,68,0.1)",
    borderRadius: GourmetRadii.md,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.2)",
  },
  generalErrorText: { color: "#EF4444", fontSize: 14, fontWeight: "500" },
  formCard: {
    backgroundColor: GourmetColors.bg.secondary,
    borderRadius: GourmetRadii.xxl,
    borderWidth: 1,
    borderColor: GourmetColors.bg.glassBorder,
    padding: 24,
    gap: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },
  fieldGroup: { gap: 6 },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: GourmetColors.text.secondary,
    marginLeft: 2,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  forgotLink: {
    fontSize: 13,
    color: GourmetColors.accent.emerald,
    fontWeight: "600",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: GourmetColors.bg.tertiary,
    borderRadius: GourmetRadii.md,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.07)",
    height: 52,
    paddingHorizontal: 14,
  },
  inputFocused: {
    borderColor: GourmetColors.accent.emerald,
    shadowColor: GourmetColors.accent.emerald,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  inputError: { borderColor: "#EF4444" },
  input: {
    flex: 1,
    color: GourmetColors.text.primary,
    fontSize: 15,
    fontWeight: "500",
  },
  fieldError: {
    fontSize: 12,
    color: "#EF4444",
    fontWeight: "500",
    marginLeft: 2,
  },
  ctaBtn: {
    borderRadius: GourmetRadii.md,
    overflow: "hidden",
    shadowColor: GourmetColors.accent.emerald,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    marginTop: 4,
  },
  ctaGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 52,
    gap: 8,
  },
  ctaText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  registerText: { fontSize: 14, color: GourmetColors.text.secondary },
  registerLink: {
    fontSize: 14,
    color: GourmetColors.accent.emerald,
    fontWeight: "700",
  },
});
