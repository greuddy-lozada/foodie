import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import {
  YStack,
  XStack,
  Text,
  Circle,
  Button,
  Input,
  Label,
  Spinner,
  useTheme,
  Theme,
} from "tamagui";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { authApi } from "@/api/auth";

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const theme = useTheme();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return;
    setIsLoading(true);
    try {
      await authApi.login(email, password);
      setIsLoading(false);
      router.push("/(dashboard)/pos" as any);
    } catch (error) {
      setIsLoading(false);
      console.error("Login failed:", error);
      alert("Invalid credentials. Please try again.");
    }
  };

  return (
    <Theme name={colorScheme ?? "light"}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: theme.background?.get() }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Section with Brand */}
          <YStack
            paddingTop={Platform.OS === "ios" ? 60 : 40}
            paddingHorizontal="$8"
            paddingBottom="$12"
            backgroundColor="$primary"
            borderTopLeftRadius="$8"
            borderTopRightRadius="$8"
            borderBottomLeftRadius="$8"
            borderBottomRightRadius="$8"
          >
            <Button
              size="$3"
              circular
              backgroundColor="rgba(255, 255, 255, 0.2)"
              icon={<Ionicons name="arrow-back" size={24} color="#FFFFFF" />}
              onPress={() => router.back()}
              marginBottom="$5"
              pressStyle={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
            />

            <YStack alignItems="center" marginBottom="$4">
              <Circle
                size={80}
                backgroundColor="rgba(255, 255, 255, 0.95)"
                justifyContent="center"
                alignItems="center"
                marginBottom="$4"
                elevation="$4"
              >
                <Text
                  fontSize={32}
                  fontWeight="900"
                  color="$primary"
                  letterSpacing={-1}
                >
                  F
                </Text>
                <Circle
                  size={8}
                  backgroundColor="$brandCoral"
                  position="absolute"
                  top={12}
                  right={12}
                />
              </Circle>
              <Text
                fontSize={32}
                fontWeight="800"
                color="#FFFFFF"
                marginBottom="$1"
                textAlign="center"
              >
                Welcome Back!
              </Text>
              <Text
                fontSize={16}
                color="rgba(255, 255, 255, 0.9)"
                textAlign="center"
                fontWeight="500"
              >
                Sign in to continue your foodie journey
              </Text>
            </YStack>
          </YStack>

          {/* Form Section */}
          <YStack flex={1} paddingHorizontal="$8" paddingTop="$10">
            {/* Email Input */}
            <YStack marginBottom="$4">
              <Label
                fontSize={14}
                fontWeight="600"
                color="$color"
                marginBottom="$2"
                marginLeft="$1"
              >
                Email Address
              </Label>
              <XStack
                alignItems="center"
                backgroundColor="$backgroundStrong"
                borderRadius="$3"
                borderWidth={2}
                borderColor={emailFocused ? "$primary" : "$borderColor"}
                paddingHorizontal="$4"
                height={56}
                elevation="$1"
              >
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={
                    emailFocused
                      ? theme.primary?.get()
                      : theme.placeholderColor?.get()
                  }
                />
                <Input
                  flex={1}
                  fontSize={16}
                  color="$color"
                  placeholder="you@example.com"
                  placeholderTextColor="$placeholderColor"
                  borderWidth={0}
                  backgroundColor="transparent"
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </XStack>
            </YStack>

            {/* Password Input */}
            <YStack marginBottom="$2">
              <Label
                fontSize={14}
                fontWeight="600"
                color="$color"
                marginBottom="$2"
                marginLeft="$1"
              >
                Password
              </Label>
              <XStack
                alignItems="center"
                backgroundColor="$backgroundStrong"
                borderRadius="$3"
                borderWidth={2}
                borderColor={passwordFocused ? "$primary" : "$borderColor"}
                paddingHorizontal="$4"
                height={56}
                elevation="$1"
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={
                    passwordFocused
                      ? theme.primary?.get()
                      : theme.placeholderColor?.get()
                  }
                />
                <Input
                  flex={1}
                  fontSize={16}
                  color="$color"
                  placeholder="Enter your password"
                  placeholderTextColor="$placeholderColor"
                  borderWidth={0}
                  backgroundColor="transparent"
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <Button
                  chromeless
                  size="$3"
                  icon={
                    <Ionicons
                      name={showPassword ? "eye-outline" : "eye-off-outline"}
                      size={20}
                      color={theme.placeholderColor?.get()}
                    />
                  }
                  onPress={() => setShowPassword(!showPassword)}
                />
              </XStack>
            </YStack>

            {/* Forgot Password */}
            <Button
              alignSelf="flex-end"
              chromeless
              padding={0}
              marginBottom="$6"
              onPress={() => {}}
            >
              <Text fontSize={14} color="$primary" fontWeight="600">
                Forgot Password?
              </Text>
            </Button>

            {/* Login Button */}
            <Button
              backgroundColor="$primary"
              height={56}
              borderRadius="$3"
              disabled={isLoading}
              onPress={handleLogin}
              pressStyle={{ backgroundColor: "$primaryHover", scale: 0.98 }}
              elevation="$4"
              opacity={isLoading ? 0.6 : 1}
            >
              {isLoading ? (
                <Spinner color="#FFFFFF" size="small" />
              ) : (
                <Text
                  color="#FFFFFF"
                  fontSize={18}
                  fontWeight="700"
                  letterSpacing={0.5}
                >
                  Sign In
                </Text>
              )}
            </Button>

            {/* Register Link */}
            <XStack
              justifyContent="center"
              alignItems="center"
              paddingVertical="$6"
              gap="$1"
            >
              <Text fontSize={15} color="$color" opacity={0.7} fontWeight="500">
                Don't have an account?
              </Text>
              <Button
                chromeless
                padding={0}
                onPress={() => router.push("/register" as any)}
              >
                <Text fontSize={15} color="$primary" fontWeight="700">
                  Sign Up
                </Text>
              </Button>
            </XStack>
          </YStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </Theme>
  );
}
