import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import {
  YStack,
  XStack,
  Text,
  Button,
  ScrollView,
  Circle,
  Theme,
  H1,
  H2,
  H3,
  Paragraph,
  Spacer,
  View,
} from "tamagui";
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions, Platform, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
} from "react-native-reanimated";
import { GourmetColors, GourmetRadii } from "@/constants/gourmet-theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IS_MOBILE = SCREEN_WIDTH < 768;

// Reusable Glass Card Component
const GlassCard = ({
  children,
  style,
  hoverable = true,
}: {
  children: React.ReactNode;
  style?: any;
  hoverable?: boolean;
}) => (
  <YStack
    padding="$6"
    borderRadius={GourmetRadii.xl}
    backgroundColor="rgba(255, 255, 255, 0.03)"
    borderWidth={1}
    borderColor="rgba(255, 255, 255, 0.08)"
    style={[
      {
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      },
      style,
    ]}
    pressStyle={
      hoverable
        ? { scale: 0.98, backgroundColor: "rgba(255,255,255,0.06)" }
        : undefined
    }
    animation="quick"
  >
    {children}
  </YStack>
);

export default function WelcomeLandingPage() {
  const router = useRouter();
  const floatAnim = useSharedValue(0);

  useEffect(() => {
    // Platform check since web animations can differ, but in Expo Reanimated works well.
    floatAnim.value = withRepeat(
      withSequence(
        withTiming(15, { duration: 2500 }),
        withTiming(0, { duration: 2500 }),
      ),
      -1,
      true,
    );
  }, []);

  const floatingStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatAnim.value }],
  }));

  const NavBar = () => (
    <XStack
      height={80}
      paddingHorizontal={IS_MOBILE ? "$4" : "$10"}
      alignItems="center"
      justifyContent="space-between"
      position="absolute"
      top={0}
      left={0}
      right={0}
      zIndex={100}
      backgroundColor="rgba(15, 17, 23, 0.6)"
      style={{
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255,255,255,0.05)",
      }}
    >
      <XStack alignItems="center" gap="$3">
        <Circle
          size={42}
          backgroundColor={GourmetColors.accent.emeraldGlow}
          borderWidth={1}
          borderColor="rgba(16,185,129,0.3)"
        >
          <Ionicons
            name="restaurant"
            size={20}
            color={GourmetColors.accent.emerald}
          />
        </Circle>
        <Text fontSize={24} fontWeight="900" color="$color" letterSpacing={-1}>
          Gourmet<Text color={GourmetColors.accent.emerald}>Flow</Text>
        </Text>
      </XStack>

      {IS_MOBILE ? (
        <Button
          circular
          icon={<Ionicons name="menu" size={24} color="#fff" />}
          chromeless
        />
      ) : (
        <XStack gap="$8" alignItems="center">
          <Text
            color="$colorSecondary"
            fontSize={15}
            fontWeight="600"
            cursor="pointer"
            hoverStyle={{ color: "$color" }}
          >
            Platform
          </Text>
          <Text
            color="$colorSecondary"
            fontSize={15}
            fontWeight="600"
            cursor="pointer"
            hoverStyle={{ color: "$color" }}
          >
            Solutions
          </Text>
          <Text
            color="$colorSecondary"
            fontSize={15}
            fontWeight="600"
            cursor="pointer"
            hoverStyle={{ color: "$color" }}
          >
            Pricing
          </Text>
          <Button
            size="$4"
            backgroundColor={GourmetColors.accent.emerald}
            borderRadius={GourmetRadii.md}
            onPress={() => router.push("/auth")}
            hoverStyle={{ opacity: 0.9 }}
            pressStyle={{ scale: 0.97 }}
          >
            <Text fontWeight="800" fontSize={15} color="#fff">
              Login to Workspace
            </Text>
          </Button>
        </XStack>
      )}
    </XStack>
  );

  return (
    <Theme name="dark">
      <ScrollView
        style={{ backgroundColor: GourmetColors.bg.primary }}
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        <NavBar />

        {/* --- HERO SECTION --- */}
        <YStack
          minHeight={IS_MOBILE ? 800 : 900}
          paddingTop={120}
          paddingHorizontal={IS_MOBILE ? "$6" : "$12"}
          justifyContent="center"
          alignItems="center"
          position="relative"
          overflow="hidden"
        >
          {/* Ambient Lighting Orbs */}
          <Circle
            size={Platform.OS === "web" ? 600 : 300}
            backgroundColor="rgba(16, 185, 129, 0.08)"
            position="absolute"
            top={-150}
            right={-100}
            style={
              Platform.OS === "web" ? { filter: "blur(120px)" } : undefined
            }
          />
          <Circle
            size={Platform.OS === "web" ? 500 : 250}
            backgroundColor="rgba(249, 115, 22, 0.05)"
            position="absolute"
            bottom={100}
            left={-150}
            style={
              Platform.OS === "web" ? { filter: "blur(120px)" } : undefined
            }
          />

          <XStack
            flex={1}
            gap="$10"
            alignItems="center"
            flexWrap={IS_MOBILE ? "wrap" : "nowrap"}
            width="100%"
            maxWidth={1400}
            margin="auto"
          >
            {/* Left Copy */}
            <YStack
              flex={1}
              gap="$6"
              minWidth={IS_MOBILE ? "100%" : 500}
              zIndex={10}
            >
              <Animated.View entering={FadeInUp.delay(200).duration(800)}>
                <XStack
                  alignSelf="flex-start"
                  backgroundColor="rgba(16, 185, 129, 0.1)"
                  paddingVertical="$2"
                  paddingHorizontal="$4"
                  borderRadius={GourmetRadii.full}
                  borderWidth={1}
                  borderColor="rgba(16, 185, 129, 0.25)"
                  marginBottom="$5"
                >
                  <Text
                    color={GourmetColors.accent.emerald}
                    fontSize={12}
                    fontWeight="800"
                    letterSpacing={1.2}
                  >
                    THE MODERN RESTAURANT OS
                  </Text>
                </XStack>

                <H1
                  fontSize={IS_MOBILE ? 48 : 76}
                  lineHeight={IS_MOBILE ? 56 : 84}
                  fontWeight="900"
                  letterSpacing={-2}
                  color="$color"
                >
                  Master the Art of{"\n"}
                  <Text color={GourmetColors.accent.emerald}>
                    Restaurant
                  </Text>{" "}
                  Speed
                </H1>

                <Paragraph
                  fontSize={20}
                  color="$colorSecondary"
                  marginTop="$6"
                  lineHeight={32}
                  paddingRight={IS_MOBILE ? 0 : "$10"}
                >
                  Shatter delays and elevate service with our unified suite.
                  GourmetFlow blends intuitive POS interactions with a
                  high-velocity Kitchen Display System and proactive Inventory
                  tracking.
                </Paragraph>
              </Animated.View>

              <Animated.View entering={FadeInUp.delay(400).duration(800)}>
                <XStack gap="$4" marginTop="$6" flexWrap="wrap">
                  <Button
                    size="$6"
                    backgroundColor={GourmetColors.accent.emerald}
                    borderRadius={GourmetRadii.lg}
                    onPress={() => router.push("/auth")}
                    iconAfter={
                      <Ionicons name="arrow-forward" size={20} color="#fff" />
                    }
                    pressStyle={{ scale: 0.97 }}
                    hoverStyle={{ scale: 1.02 }}
                    shadowColor={GourmetColors.accent.emerald}
                    shadowOffset={{ width: 0, height: 8 }}
                    shadowOpacity={0.3}
                    shadowRadius={20}
                  >
                    <Text
                      fontSize={18}
                      fontWeight="800"
                      color="#fff"
                      letterSpacing={0.5}
                    >
                      Start Free Trial
                    </Text>
                  </Button>

                  <Button
                    size="$6"
                    backgroundColor="rgba(255,255,255,0.03)"
                    borderRadius={GourmetRadii.lg}
                    borderWidth={1}
                    borderColor="rgba(255,255,255,0.15)"
                    hoverStyle={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                    pressStyle={{ scale: 0.97 }}
                    icon={
                      <Ionicons
                        name="play-circle-outline"
                        size={22}
                        color="#fff"
                      />
                    }
                  >
                    <Text fontSize={18} fontWeight="600" color="$color">
                      Watch Demo
                    </Text>
                  </Button>
                </XStack>

                <XStack gap="$6" marginTop="$8" alignItems="center">
                  <XStack>
                    {[1, 2, 3, 4].map((i) => (
                      <Circle
                        key={i}
                        size={40}
                        backgroundColor="$backgroundStrong"
                        borderWidth={2}
                        borderColor="$background"
                        marginLeft={i !== 1 ? -15 : 0}
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Ionicons
                          name="person"
                          size={20}
                          color={GourmetColors.text.muted}
                        />
                      </Circle>
                    ))}
                  </XStack>
                  <YStack>
                    <XStack alignItems="center" gap="$1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Ionicons
                          key={i}
                          name="star"
                          size={16}
                          color={GourmetColors.accent.amber}
                        />
                      ))}
                    </XStack>
                    <Text
                      color="$colorSecondary"
                      fontSize={13}
                      fontWeight="600"
                      marginTop="$1"
                    >
                      Trusted by 4,000+ chefs
                    </Text>
                  </YStack>
                </XStack>
              </Animated.View>
            </YStack>

            {/* Right Interactive Mockup (Replacing Image) */}
            {!IS_MOBILE && (
              <YStack
                flex={1}
                alignItems="center"
                justifyContent="center"
                minHeight={500}
                zIndex={10}
              >
                <Animated.View style={floatingStyle}>
                  {/* Outer Tablet Frame */}
                  <GlassCard
                    hoverable={false}
                    style={{
                      width: 580,
                      height: 420,
                      padding: 0,
                      overflow: "hidden",
                      borderWidth: 2,
                      borderColor: "rgba(255,255,255,0.1)",
                      shadowColor: GourmetColors.accent.emerald,
                      shadowOpacity: 0.15,
                      shadowRadius: 40,
                      shadowOffset: { width: 0, height: 20 },
                    }}
                  >
                    <LinearGradient
                      colors={["#161B25", "#0F1117"]}
                      style={{ flex: 1, padding: 24 }}
                    >
                      {/* Fake Dashboard Header */}
                      <XStack
                        justifyContent="space-between"
                        alignItems="center"
                        marginBottom="$6"
                      >
                        <YStack>
                          <Text color="$color" fontSize={24} fontWeight="800">
                            Kitchen Display
                          </Text>
                          <Text
                            color={GourmetColors.accent.emerald}
                            fontSize={14}
                            fontWeight="600"
                          >
                            All Stations Operational
                          </Text>
                        </YStack>
                        <XStack gap="$3">
                          <Circle
                            size={40}
                            backgroundColor="rgba(255,255,255,0.05)"
                          >
                            <Ionicons
                              name="notifications-outline"
                              size={20}
                              color="#fff"
                            />
                          </Circle>
                          <Circle
                            size={40}
                            backgroundColor="rgba(255,255,255,0.05)"
                          >
                            <Ionicons
                              name="settings-outline"
                              size={20}
                              color="#fff"
                            />
                          </Circle>
                        </XStack>
                      </XStack>

                      {/* Fake Order Cards */}
                      <XStack gap="$4" flex={1}>
                        <YStack
                          flex={1}
                          backgroundColor="rgba(255,255,255,0.03)"
                          borderRadius="$4"
                          padding="$4"
                          borderWidth={1}
                          borderColor="rgba(239,68,68,0.2)"
                        >
                          <XStack
                            justifyContent="space-between"
                            marginBottom="$3"
                          >
                            <Text color="$color" fontWeight="800" fontSize={16}>
                              Table 4
                            </Text>
                            <View
                              backgroundColor="rgba(239,68,68,0.2)"
                              paddingHorizontal="$2"
                              paddingVertical={2}
                              borderRadius="$2"
                            >
                              <Text
                                color={GourmetColors.accent.red}
                                fontSize={12}
                                fontWeight="800"
                              >
                                18m
                              </Text>
                            </View>
                          </XStack>
                          <Text
                            color="$colorSecondary"
                            fontSize={14}
                            marginBottom="$1"
                          >
                            1x Lobster Risotto
                          </Text>
                          <Text
                            color="$colorSecondary"
                            fontSize={14}
                            marginBottom="$1"
                          >
                            2x Truffle Arancini
                          </Text>
                          <Text color="$colorSecondary" fontSize={14}>
                            1x Negroni
                          </Text>
                          <Spacer flex={1} />
                          <Button
                            size="$3"
                            backgroundColor={GourmetColors.accent.red}
                            borderRadius="$3"
                          >
                            DONE
                          </Button>
                        </YStack>

                        <YStack
                          flex={1}
                          backgroundColor="rgba(255,255,255,0.03)"
                          borderRadius="$4"
                          padding="$4"
                          borderWidth={1}
                          borderColor="rgba(249,115,22,0.2)"
                        >
                          <XStack
                            justifyContent="space-between"
                            marginBottom="$3"
                          >
                            <Text color="$color" fontWeight="800" fontSize={16}>
                              Table 12
                            </Text>
                            <View
                              backgroundColor="rgba(249,115,22,0.2)"
                              paddingHorizontal="$2"
                              paddingVertical={2}
                              borderRadius="$2"
                            >
                              <Text
                                color={GourmetColors.accent.orange}
                                fontSize={12}
                                fontWeight="800"
                              >
                                12m
                              </Text>
                            </View>
                          </XStack>
                          <Text
                            color="$colorSecondary"
                            fontSize={14}
                            marginBottom="$1"
                          >
                            2x Salmon en Papillote
                          </Text>
                          <Text color="$colorSecondary" fontSize={14}>
                            1x Crème Brûlée
                          </Text>
                          <Spacer flex={1} />
                          <Button
                            size="$3"
                            backgroundColor={GourmetColors.accent.orange}
                            borderRadius="$3"
                          >
                            COOKING
                          </Button>
                        </YStack>

                        <YStack
                          flex={1}
                          backgroundColor="rgba(255,255,255,0.03)"
                          borderRadius="$4"
                          padding="$4"
                          borderWidth={1}
                          borderColor="rgba(16,185,129,0.2)"
                        >
                          <XStack
                            justifyContent="space-between"
                            marginBottom="$3"
                          >
                            <Text color="$color" fontWeight="800" fontSize={16}>
                              Takeout #8
                            </Text>
                            <View
                              backgroundColor="rgba(16,185,129,0.2)"
                              paddingHorizontal="$2"
                              paddingVertical={2}
                              borderRadius="$2"
                            >
                              <Text
                                color={GourmetColors.accent.emerald}
                                fontSize={12}
                                fontWeight="800"
                              >
                                4m
                              </Text>
                            </View>
                          </XStack>
                          <Text
                            color="$colorSecondary"
                            fontSize={14}
                            marginBottom="$1"
                          >
                            1x Beef Carpaccio
                          </Text>
                          <Spacer flex={1} />
                          <Button
                            size="$3"
                            backgroundColor={GourmetColors.accent.emerald}
                            borderRadius="$3"
                          >
                            PREP
                          </Button>
                        </YStack>
                      </XStack>
                    </LinearGradient>
                  </GlassCard>
                </Animated.View>
              </YStack>
            )}
          </XStack>
        </YStack>

        {/* --- SYSTEM CAPABILITIES SECTION --- */}
        <YStack
          paddingVertical={120}
          paddingHorizontal={IS_MOBILE ? "$6" : "$12"}
          backgroundColor="rgba(0,0,0,0.2)"
        >
          <YStack alignItems="center" marginBottom={80}>
            <Text
              color={GourmetColors.accent.emerald}
              fontSize={14}
              fontWeight="800"
              letterSpacing={2}
              marginBottom="$4"
            >
              CAPABILITIES
            </Text>
            <H2
              textAlign="center"
              fontSize={IS_MOBILE ? 36 : 48}
              fontWeight="900"
              letterSpacing={-1}
            >
              Everything You Need to Run
            </H2>
            <H2
              textAlign="center"
              fontSize={IS_MOBILE ? 36 : 48}
              fontWeight="900"
              color={GourmetColors.accent.emerald}
              letterSpacing={-1}
            >
              Outrageously Fast
            </H2>
          </YStack>

          <XStack
            flexWrap="wrap"
            gap="$8"
            justifyContent="center"
            maxWidth={1200}
            margin="auto"
          >
            {/* POS Feature */}
            <GlassCard
              style={{ width: IS_MOBILE ? "100%" : 350, minHeight: 280 }}
            >
              <Circle
                size={56}
                backgroundColor={GourmetColors.accent.blueGlow}
                marginBottom="$6"
                borderWidth={1}
                borderColor="rgba(59,130,246,0.3)"
              >
                <Ionicons
                  name="grid"
                  size={28}
                  color={GourmetColors.accent.blue}
                />
              </Circle>
              <H3
                fontWeight="800"
                fontSize={22}
                marginBottom="$3"
                color="$color"
              >
                Intelligent POS
              </H3>
              <Paragraph color="$colorSecondary" fontSize={16} lineHeight={26}>
                A Point of Sale that doesn't just record orders, but anticipates
                them. Manage tables visually, split checks instantly, and beam
                orders direct to stations.
              </Paragraph>
            </GlassCard>

            {/* KDS Feature */}
            <GlassCard
              style={{
                width: IS_MOBILE ? "100%" : 350,
                minHeight: 280,
                borderColor: GourmetColors.accent.emerald,
              }}
            >
              <View
                position="absolute"
                top={-12}
                right={20}
                backgroundColor={GourmetColors.accent.emerald}
                paddingHorizontal="$3"
                paddingVertical="$1"
                borderRadius="$full"
              >
                <Text color="#fff" fontSize={11} fontWeight="800">
                  MOST REVOLUTIONARY
                </Text>
              </View>
              <Circle
                size={56}
                backgroundColor={GourmetColors.accent.emeraldGlow}
                marginBottom="$6"
                borderWidth={1}
                borderColor="rgba(16,185,129,0.3)"
              >
                <Ionicons
                  name="flame"
                  size={28}
                  color={GourmetColors.accent.emerald}
                />
              </Circle>
              <H3
                fontWeight="800"
                fontSize={22}
                marginBottom="$3"
                color="$color"
              >
                Live Action KDS
              </H3>
              <Paragraph color="$colorSecondary" fontSize={16} lineHeight={26}>
                Say goodbye to paper tickets. Dynamic color-coded urgency,
                course pacing, and all-station synchronicity so the line cooks
                are always in unison.
              </Paragraph>
            </GlassCard>

            {/* Inventory Feature */}
            <GlassCard
              style={{ width: IS_MOBILE ? "100%" : 350, minHeight: 280 }}
            >
              <Circle
                size={56}
                backgroundColor={GourmetColors.accent.orangeGlow}
                marginBottom="$6"
                borderWidth={1}
                borderColor="rgba(249,115,22,0.3)"
              >
                <Ionicons
                  name="cube"
                  size={28}
                  color={GourmetColors.accent.orange}
                />
              </Circle>
              <H3
                fontWeight="800"
                fontSize={22}
                marginBottom="$3"
                color="$color"
              >
                Sync'd Inventory
              </H3>
              <Paragraph color="$colorSecondary" fontSize={16} lineHeight={26}>
                Automated stock depletion as dishes are sold. 86 items from the
                register before a server even tries to order them. Never
                disappoint a guest again.
              </Paragraph>
            </GlassCard>
          </XStack>
        </YStack>

        {/* --- TESTIMONIALS --- */}
        <YStack
          paddingVertical={120}
          paddingHorizontal={IS_MOBILE ? "$6" : "$12"}
          position="relative"
          overflow="hidden"
        >
          {/* subtle background glow */}
          <Circle
            size={Platform.OS === "web" ? 800 : 400}
            backgroundColor="rgba(139, 92, 246, 0.04)"
            position="absolute"
            top={0}
            left={"10%"}
            style={
              Platform.OS === "web" ? { filter: "blur(100px)" } : undefined
            }
          />

          <YStack alignItems="center" marginBottom={80}>
            <H2
              textAlign="center"
              fontSize={42}
              fontWeight="900"
              marginBottom="$4"
            >
              Loved by{" "}
              <Text color={GourmetColors.accent.purple}>Industry Leaders</Text>
            </H2>
            <Paragraph textAlign="center" fontSize={18} color="$colorSecondary">
              From bustling bistros to Michelin-starred establishments.
            </Paragraph>
          </YStack>

          <XStack
            flexWrap="wrap"
            gap="$8"
            justifyContent="center"
            maxWidth={1200}
            margin="auto"
          >
            {[
              {
                name: "Marco Rossi",
                role: "Exec Chef, L'Osteria",
                text: "The KDS urgency glow completely changed my kitchen dynamics. We never miss a beat during the Friday 8pm rush anymore.",
                rating: 5,
              },
              {
                name: "Sarah Chen",
                role: "Owner, Zen Garden Fusion",
                text: "Switching to GourmetFlow reduced our front-to-back order errors to practically zero. The glassmorphism UI is stunning on our venue tablets.",
                rating: 5,
              },
              {
                name: "Julian Bautista",
                role: "GM, The Capital Steakhouse",
                text: "Inventory management was a nightmare until this. Real-time ingredient tracking saves us thousands in shrinkage and waste every month.",
                rating: 5,
              },
            ].map((t, i) => (
              <GlassCard key={i} style={{ width: IS_MOBILE ? "100%" : 370 }}>
                <XStack gap="$1" marginBottom="$4">
                  {Array(t.rating)
                    .fill(0)
                    .map((_, i) => (
                      <Ionicons
                        key={i}
                        name="star"
                        size={16}
                        color={GourmetColors.accent.amber}
                      />
                    ))}
                </XStack>
                <Text
                  fontSize={17}
                  fontStyle="italic"
                  color="$colorSecondary"
                  marginBottom="$6"
                  lineHeight={28}
                >
                  "{t.text}"
                </Text>
                <XStack gap="$4" alignItems="center">
                  <View
                    width={48}
                    height={48}
                    borderRadius={24}
                    backgroundColor="rgba(255,255,255,0.1)"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text fontWeight="900" color="#fff" fontSize={18}>
                      {t.name.charAt(0)}
                    </Text>
                  </View>
                  <YStack>
                    <Text fontWeight="800" fontSize={16} color="$color">
                      {t.name}
                    </Text>
                    <Text fontSize={13} color={GourmetColors.text.muted}>
                      {t.role}
                    </Text>
                  </YStack>
                </XStack>
              </GlassCard>
            ))}
          </XStack>
        </YStack>

        {/* --- CONTACT / CTA SECTION --- */}
        <YStack
          paddingVertical={100}
          alignItems="center"
          paddingHorizontal="$6"
        >
          <GlassCard
            style={{
              width: "100%",
              maxWidth: 900,
              padding: IS_MOBILE ? "$6" : "$10",
              backgroundColor: "rgba(16,185,129,0.03)",
              borderColor: "rgba(16,185,129,0.2)",
            }}
          >
            <XStack
              flexWrap={IS_MOBILE ? "wrap" : "nowrap"}
              gap="$10"
              alignItems="center"
            >
              <YStack flex={1}>
                <H2
                  fontWeight="900"
                  fontSize={36}
                  letterSpacing={-1}
                  marginBottom="$3"
                >
                  Ready to upgrade your flow?
                </H2>
                <Paragraph
                  color="$colorSecondary"
                  fontSize={18}
                  lineHeight={28}
                  marginBottom="$6"
                >
                  Join thousands of restaurants running smoother, faster, and
                  more profitably. Get a personalized demo from our culinary
                  tech experts.
                </Paragraph>

                <YStack gap="$4">
                  <XStack alignItems="center" gap="$3">
                    <Circle
                      size={24}
                      backgroundColor={GourmetColors.accent.emeraldGlow}
                    >
                      <Ionicons
                        name="checkmark"
                        size={14}
                        color={GourmetColors.accent.emerald}
                      />
                    </Circle>
                    <Text color="$color" fontSize={16} fontWeight="500">
                      Free 14-day full platform trial
                    </Text>
                  </XStack>
                  <XStack alignItems="center" gap="$3">
                    <Circle
                      size={24}
                      backgroundColor={GourmetColors.accent.emeraldGlow}
                    >
                      <Ionicons
                        name="checkmark"
                        size={14}
                        color={GourmetColors.accent.emerald}
                      />
                    </Circle>
                    <Text color="$color" fontSize={16} fontWeight="500">
                      White-glove onboarding & menu import
                    </Text>
                  </XStack>
                  <XStack alignItems="center" gap="$3">
                    <Circle
                      size={24}
                      backgroundColor={GourmetColors.accent.emeraldGlow}
                    >
                      <Ionicons
                        name="checkmark"
                        size={14}
                        color={GourmetColors.accent.emerald}
                      />
                    </Circle>
                    <Text color="$color" fontSize={16} fontWeight="500">
                      24/7 dedicated support
                    </Text>
                  </XStack>
                </YStack>
              </YStack>

              <YStack
                flex={1}
                minWidth={IS_MOBILE ? "100%" : 350}
                backgroundColor="rgba(0,0,0,0.4)"
                padding="$6"
                borderRadius="$6"
                borderWidth={1}
                borderColor="rgba(255,255,255,0.05)"
              >
                <Text fontSize={20} fontWeight="800" marginBottom="$6">
                  Request Demo
                </Text>
                <YStack gap="$4">
                  <YStack gap="$2">
                    <Text
                      fontSize={13}
                      color="$colorSecondary"
                      fontWeight="600"
                    >
                      Restaurant Name
                    </Text>
                    <View
                      backgroundColor="rgba(255,255,255,0.05)"
                      height={52}
                      borderRadius={GourmetRadii.md}
                      paddingHorizontal="$4"
                      justifyContent="center"
                    >
                      <Text color="$colorMuted">The French Laundry</Text>
                    </View>
                  </YStack>
                  <YStack gap="$2">
                    <Text
                      fontSize={13}
                      color="$colorSecondary"
                      fontWeight="600"
                    >
                      Work Email
                    </Text>
                    <View
                      backgroundColor="rgba(255,255,255,0.05)"
                      height={52}
                      borderRadius={GourmetRadii.md}
                      paddingHorizontal="$4"
                      justifyContent="center"
                    >
                      <Text color="$colorMuted">chef@restaurant.com</Text>
                    </View>
                  </YStack>
                  <Button
                    marginTop="$4"
                    height={56}
                    backgroundColor={GourmetColors.accent.emerald}
                    borderRadius={GourmetRadii.md}
                    pressStyle={{ scale: 0.98 }}
                  >
                    <Text fontWeight="800" fontSize={16} color="#fff">
                      Contact Sales
                    </Text>
                  </Button>
                </YStack>
              </YStack>
            </XStack>
          </GlassCard>
        </YStack>

        {/* --- FOOTER --- */}
        <YStack
          paddingVertical="$10"
          alignItems="center"
          gap="$6"
          borderTopWidth={1}
          borderTopColor="rgba(255,255,255,0.05)"
        >
          <XStack alignItems="center" gap="$2">
            <Circle
              size={32}
              backgroundColor={GourmetColors.accent.emeraldGlow}
              borderWidth={1}
              borderColor="rgba(16,185,129,0.4)"
            >
              <Ionicons
                name="restaurant"
                size={16}
                color={GourmetColors.accent.emerald}
              />
            </Circle>
            <Text
              fontSize={20}
              fontWeight="900"
              color="$color"
              letterSpacing={-1}
            >
              Gourmet<Text color={GourmetColors.accent.emerald}>Flow</Text>
            </Text>
          </XStack>
          <XStack gap="$6" flexWrap="wrap" justifyContent="center">
            <Text color="$colorSecondary" fontSize={14}>
              Privacy Policy
            </Text>
            <Text color="$colorSecondary" fontSize={14}>
              Terms of Service
            </Text>
            <Text color="$colorSecondary" fontSize={14}>
              Hardware Partners
            </Text>
            <Text color="$colorSecondary" fontSize={14}>
              Careers
            </Text>
          </XStack>
          <Text color="$colorMuted" fontSize={13} marginTop="$4">
            © 2026 GourmetFlow SaaS. All rights reserved. Built for chefs, by
            tech.
          </Text>
        </YStack>
      </ScrollView>
    </Theme>
  );
}
