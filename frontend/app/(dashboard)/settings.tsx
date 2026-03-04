import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { GourmetColors, GourmetRadii } from "@/constants/gourmet-theme";

interface SettingRow {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  desc: string;
  color: string;
  onPress?: () => void;
  badge?: string;
  badgeColor?: string;
}

export default function SettingsScreen() {
  const router = useRouter();

  const sections: { title: string; rows: SettingRow[] }[] = [
    {
      title: "Restaurant",
      rows: [
        {
          icon: "storefront-outline",
          label: "Restaurant Profile",
          desc: "Name, logo, address",
          color: GourmetColors.accent.emerald,
        },
        {
          icon: "people-outline",
          label: "Staff Management",
          desc: "Roles, access levels",
          color: GourmetColors.accent.blue,
        },
        {
          icon: "grid-outline",
          label: "Table Configuration",
          desc: "Floor plan & table count",
          color: GourmetColors.accent.purple,
        },
        {
          icon: "restaurant-outline",
          label: "Menu Management",
          desc: "Categories, items, pricing",
          color: GourmetColors.accent.orange,
        },
      ],
    },
    {
      title: "Subscription & Billing",
      rows: [
        {
          icon: "card-outline",
          label: "Stripe",
          desc: "Active · Renews Mar 15",
          color: GourmetColors.sub.stripe,
          badge: "Active",
          badgeColor: GourmetColors.status.free,
        },
        {
          icon: "logo-bitcoin",
          label: "Binance Pay",
          desc: "Connected · USDT",
          color: GourmetColors.sub.binance,
          badge: "Connected",
          badgeColor: GourmetColors.accent.amber,
        },
        {
          icon: "phone-portrait-outline",
          label: "Pago Móvil",
          desc: "Not configured",
          color: GourmetColors.sub.pagoMovil,
        },
        {
          icon: "receipt-outline",
          label: "Billing History",
          desc: "Invoices & payments",
          color: GourmetColors.text.muted,
        },
      ],
    },
    {
      title: "System",
      rows: [
        {
          icon: "notifications-outline",
          label: "Notifications",
          desc: "Kitchen alerts, orders",
          color: GourmetColors.accent.amber,
        },
        {
          icon: "language-outline",
          label: "Language & Region",
          desc: "English · USD",
          color: GourmetColors.accent.blue,
        },
        {
          icon: "moon-outline",
          label: "Appearance",
          desc: "Dark mode (Restaurant)",
          color: GourmetColors.text.secondary,
        },
        {
          icon: "shield-outline",
          label: "Security",
          desc: "2FA, sessions",
          color: GourmetColors.accent.emerald,
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileRow}>
          <LinearGradient colors={["#10B981", "#059669"]} style={styles.avatar}>
            <Text style={styles.avatarText}>GF</Text>
          </LinearGradient>
          <View>
            <Text style={styles.restaurantName}>La Belle Maison</Text>
            <Text style={styles.slug}>labelle.gourmetflow.app</Text>
          </View>
          <TouchableOpacity style={styles.editProfile}>
            <Ionicons
              name="pencil"
              size={16}
              color={GourmetColors.text.muted}
            />
          </TouchableOpacity>
        </View>

        {/* Subscription widget */}
        <View style={styles.subWidget}>
          <View style={styles.subWidgetLeft}>
            <View style={styles.subActiveDot} />
            <View>
              <Text style={styles.subWidgetTitle}>Subscription Active</Text>
              <Text style={styles.subWidgetDesc}>
                Professional Plan · $149/mo · Next billing Mar 15, 2026
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.manageBtn}>
            <Text style={styles.manageBtnText}>Manage</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {sections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.rows.map((row, idx) => (
                <React.Fragment key={row.label}>
                  <TouchableOpacity
                    style={styles.settingRow}
                    onPress={row.onPress}
                    activeOpacity={0.75}
                  >
                    <View
                      style={[
                        styles.rowIcon,
                        { backgroundColor: `${row.color}18` },
                      ]}
                    >
                      <Ionicons name={row.icon} size={18} color={row.color} />
                    </View>
                    <View style={styles.rowInfo}>
                      <Text style={styles.rowLabel}>{row.label}</Text>
                      <Text style={styles.rowDesc}>{row.desc}</Text>
                    </View>
                    {row.badge ? (
                      <View
                        style={[
                          styles.badge,
                          {
                            backgroundColor: `${row.badgeColor ?? GourmetColors.accent.emerald}18`,
                            borderColor: `${row.badgeColor ?? GourmetColors.accent.emerald}30`,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.badgeText,
                            {
                              color:
                                row.badgeColor ?? GourmetColors.accent.emerald,
                            },
                          ]}
                        >
                          {row.badge}
                        </Text>
                      </View>
                    ) : null}
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color={GourmetColors.text.muted}
                    />
                  </TouchableOpacity>
                  {idx < section.rows.length - 1 && (
                    <View style={styles.rowDivider} />
                  )}
                </React.Fragment>
              ))}
            </View>
          </View>
        ))}

        {/* Sign out */}
        <TouchableOpacity
          style={styles.signOutBtn}
          onPress={() => router.replace("/auth" as any)}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={18} color="#EF4444" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>
          GourmetFlow v1.0.0 · Powered by Foodie Platform
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: GourmetColors.bg.primary },
  header: {
    backgroundColor: GourmetColors.bg.secondary,
    paddingTop: Platform.OS === "ios" ? 54 : 30,
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  profileRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: GourmetRadii.md,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { color: "#fff", fontSize: 18, fontWeight: "900" },
  restaurantName: {
    fontSize: 18,
    fontWeight: "800",
    color: GourmetColors.text.primary,
  },
  slug: { fontSize: 12, color: GourmetColors.text.muted, marginTop: 2 },
  editProfile: {
    marginLeft: "auto",
    width: 34,
    height: 34,
    borderRadius: GourmetRadii.sm,
    backgroundColor: GourmetColors.bg.tertiary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: GourmetColors.bg.glassBorder,
  },
  subWidget: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(16,185,129,0.07)",
    borderRadius: GourmetRadii.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.18)",
  },
  subWidgetLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    flex: 1,
  },
  subActiveDot: {
    width: 10,
    height: 10,
    borderRadius: 99,
    backgroundColor: GourmetColors.accent.emerald,
    marginTop: 4,
  },
  subWidgetTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: GourmetColors.accent.emerald,
  },
  subWidgetDesc: {
    fontSize: 11,
    color: GourmetColors.text.muted,
    marginTop: 2,
    maxWidth: 220,
  },
  manageBtn: {
    backgroundColor: GourmetColors.accent.emerald,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: GourmetRadii.sm,
  },
  manageBtnText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  scrollContent: { padding: 16, gap: 20, paddingBottom: 48 },
  section: { gap: 8 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: GourmetColors.text.muted,
    letterSpacing: 1,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: GourmetColors.bg.secondary,
    borderRadius: GourmetRadii.xl,
    borderWidth: 1,
    borderColor: GourmetColors.bg.glassBorder,
    overflow: "hidden",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
  },
  rowIcon: {
    width: 38,
    height: 38,
    borderRadius: GourmetRadii.md,
    justifyContent: "center",
    alignItems: "center",
  },
  rowInfo: { flex: 1 },
  rowLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: GourmetColors.text.primary,
  },
  rowDesc: { fontSize: 12, color: GourmetColors.text.muted, marginTop: 1 },
  rowDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    marginHorizontal: 14,
  },
  badge: {
    borderRadius: GourmetRadii.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    marginRight: 4,
  },
  badgeText: { fontSize: 11, fontWeight: "700" },
  signOutBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(239,68,68,0.08)",
    borderRadius: GourmetRadii.lg,
    height: 48,
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.2)",
  },
  signOutText: { color: "#EF4444", fontSize: 15, fontWeight: "700" },
  version: {
    textAlign: "center",
    fontSize: 11,
    color: GourmetColors.text.muted,
  },
});
