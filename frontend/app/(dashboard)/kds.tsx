import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  FlatList,
  Platform,
  Animated,
  Dimensions,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { GourmetColors, GourmetRadii } from "@/constants/gourmet-theme";
import { kdsApi } from "@/api/kds";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IS_TABLET = SCREEN_WIDTH >= 768;
const CARD_WIDTH = IS_TABLET ? (SCREEN_WIDTH - 64) / 3 : SCREEN_WIDTH - 32;

// ─── Types & Mock Data ────────────────────────────────────────────────────────

type OrderStatus = "pending" | "cooking" | "ready";

interface OrderItem {
  name: string;
  quantity: number;
  modifiers?: string[];
}

interface KDSOrder {
  id: string;
  tableNumber: number;
  status: OrderStatus;
  items: OrderItem[];
  createdAt: Date;
  priority: number; // higher = more urgent
}

const now = new Date();

const MOCK_ORDERS: KDSOrder[] = [
  {
    id: "ORD-044",
    tableNumber: 10,
    status: "pending",
    items: [
      {
        name: "Filet Mignon 8oz",
        quantity: 2,
        modifiers: ["Medium-rare", "No jus"],
      },
      { name: "Lobster Risotto", quantity: 1 },
    ],
    createdAt: new Date(now.getTime() - 3 * 60000), // 3 min ago
    priority: 1,
  },
  {
    id: "ORD-043",
    tableNumber: 6,
    status: "cooking",
    items: [
      { name: "Duck Confit", quantity: 1 },
      { name: "Burrata & Tomato", quantity: 2, modifiers: ["No basil"] },
      { name: "House Negroni", quantity: 3 },
    ],
    createdAt: new Date(now.getTime() - 12 * 60000), // 12 min ago (amber)
    priority: 2,
  },
  {
    id: "ORD-042",
    tableNumber: 2,
    status: "cooking",
    items: [
      { name: "Salmon en Papillote", quantity: 1, modifiers: ["Extra lemon"] },
      { name: "Beef Carpaccio", quantity: 1 },
    ],
    createdAt: new Date(now.getTime() - 27 * 60000), // 27 min ago (red!)
    priority: 3,
  },
  {
    id: "ORD-041",
    tableNumber: 3,
    status: "cooking",
    items: [
      { name: "Truffle Arancini", quantity: 3 },
      { name: "Champagne Flute", quantity: 4 },
    ],
    createdAt: new Date(now.getTime() - 8 * 60000), // 8 min ago (normal)
    priority: 4,
  },
  {
    id: "ORD-040",
    tableNumber: 12,
    status: "ready",
    items: [
      { name: "Crème Brûlée", quantity: 2 },
      { name: "Chocolate Fondant", quantity: 1 },
    ],
    createdAt: new Date(now.getTime() - 18 * 60000),
    priority: 5,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getMinutesElapsed(date: Date): number {
  return Math.floor((Date.now() - date.getTime()) / 60000);
}

function getUrgencyLevel(minutes: number): "normal" | "amber" | "critical" {
  if (minutes >= 25) return "critical";
  if (minutes >= 15) return "amber";
  return "normal";
}

function getUrgencyColor(level: ReturnType<typeof getUrgencyLevel>) {
  return {
    normal: GourmetColors.text.secondary,
    amber: GourmetColors.accent.amber,
    critical: GourmetColors.status.critical,
  }[level];
}

function formatElapsed(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

// ─── Order Card ───────────────────────────────────────────────────────────────

function OrderCard({
  order,
  onStartCooking,
  onMarkReady,
  onComplete,
}: {
  order: KDSOrder;
  onStartCooking: (id: string) => void;
  onMarkReady: (id: string) => void;
  onComplete: (id: string) => void;
}) {
  const [elapsed, setElapsed] = useState(getMinutesElapsed(order.createdAt));
  const urgency = getUrgencyLevel(elapsed);
  const glowAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(getMinutesElapsed(order.createdAt));
    }, 30000);
    return () => clearInterval(timer);
  }, [order.createdAt]);

  // Pulse animation for urgent cards
  useEffect(() => {
    if (urgency !== "normal") {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 900,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      glowAnim.stopAnimation();
      glowAnim.setValue(0);
    }
  }, [urgency]);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.15, urgency === "critical" ? 0.5 : 0.35],
  });

  const borderColor = {
    normal: GourmetColors.bg.glassBorder,
    amber: "rgba(245,158,11,0.4)",
    critical: "rgba(239,68,68,0.5)",
  }[urgency];

  const statusConfig = {
    pending: {
      color: GourmetColors.accent.blue,
      label: "Pending",
      icon: "time-outline" as const,
    },
    cooking: {
      color: GourmetColors.accent.orange,
      label: "Cooking",
      icon: "flame-outline" as const,
    },
    ready: {
      color: GourmetColors.accent.emerald,
      label: "Ready ✓",
      icon: "checkmark-circle-outline" as const,
    },
  }[order.status];

  // Long press → Ready for Pickup
  const handleLongPress = () => {
    if (order.status === "cooking") {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.96,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
      onMarkReady(order.id);
    }
  };

  return (
    <TouchableWithoutFeedback
      onLongPress={handleLongPress}
      delayLongPress={600}
    >
      <Animated.View
        style={[styles.cardContainer, { transform: [{ scale: scaleAnim }] }]}
      >
        {/* Urgency glow overlay */}
        {urgency !== "normal" && (
          <Animated.View
            style={[
              StyleSheet.absoluteFillObject,
              {
                borderRadius: GourmetRadii.xl,
                backgroundColor:
                  urgency === "critical"
                    ? GourmetColors.accent.red
                    : GourmetColors.accent.amber,
                opacity: glowOpacity,
              },
            ]}
            pointerEvents="none"
          />
        )}

        <View style={[styles.card, { borderColor }]}>
          {/* Card header */}
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.tableLabel}>TABLE {order.tableNumber}</Text>
              <Text style={styles.orderId}>{order.id}</Text>
            </View>
            <View style={styles.cardHeaderRight}>
              {/* Elapsed timer */}
              <View
                style={[
                  styles.timerBadge,
                  urgency !== "normal" && {
                    backgroundColor:
                      urgency === "critical"
                        ? "rgba(239,68,68,0.15)"
                        : "rgba(245,158,11,0.15)",
                  },
                ]}
              >
                <Ionicons
                  name="timer-outline"
                  size={12}
                  color={getUrgencyColor(urgency)}
                />
                <Text
                  style={[
                    styles.timerText,
                    { color: getUrgencyColor(urgency) },
                  ]}
                >
                  {formatElapsed(elapsed)}
                </Text>
              </View>
              {/* Status badge */}
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: `${statusConfig.color}1A` },
                ]}
              >
                <Ionicons
                  name={statusConfig.icon}
                  size={12}
                  color={statusConfig.color}
                />
                <Text
                  style={[styles.statusText, { color: statusConfig.color }]}
                >
                  {statusConfig.label}
                </Text>
              </View>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Items */}
          <View style={styles.itemsList}>
            {order.items.map((item, i) => (
              <View key={i} style={styles.orderItem}>
                <View style={styles.qtyBadge}>
                  <Text style={styles.qtyText}>{item.quantity}×</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  {item.modifiers?.map((mod, j) => (
                    <Text key={j} style={styles.modifier}>
                      ⚙ {mod}
                    </Text>
                  ))}
                </View>
              </View>
            ))}
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Actions */}
          <View style={styles.cardActions}>
            {order.status === "pending" && (
              <TouchableOpacity
                style={[styles.actionBtn, styles.cookingBtn]}
                onPress={() => onStartCooking(order.id)}
                activeOpacity={0.8}
              >
                <Ionicons name="flame" size={14} color="#fff" />
                <Text style={styles.actionBtnText}>Start Cooking</Text>
              </TouchableOpacity>
            )}
            {order.status === "cooking" && (
              <>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.readyBtn]}
                  onPress={() => onMarkReady(order.id)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="checkmark-circle" size={14} color="#fff" />
                  <Text style={styles.actionBtnText}>Ready</Text>
                </TouchableOpacity>
                <Text style={styles.longPressHint}>Hold to mark ready</Text>
              </>
            )}
            {order.status === "ready" && (
              <TouchableOpacity
                style={[styles.actionBtn, styles.completeBtn]}
                onPress={() => onComplete(order.id)}
                activeOpacity={0.8}
              >
                <Ionicons name="bag-check" size={14} color="#fff" />
                <Text style={styles.actionBtnText}>Picked Up ✓</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

// ─── Main KDS Screen ──────────────────────────────────────────────────────────

export default function KDSScreen() {
  const [orders, setOrders] = useState<KDSOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await kdsApi.getActiveOrders();
      const mapped: KDSOrder[] = data.map((o: any) => ({
        id: o._id,
        tableNumber: 1, // backend doesn't have table yet
        status: o.status.toLowerCase() === 'preparing' ? 'cooking' : o.status.toLowerCase(),
        items: o.items.map((i: any) => ({
          name: i.name,
          quantity: i.quantity,
          modifiers: i.notes ? [i.notes] : [],
        })),
        createdAt: new Date(o.createdAt),
        priority: 1,
      }));
      setOrders(mapped);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const startCooking = useCallback(async (id: string) => {
    try {
      await kdsApi.updateStatus(id, "PREPARING" as any);
      fetchOrders();
    } catch (error) {
      console.error("Failed to start cooking:", error);
    }
  }, []);

  const markReady = useCallback(async (id: string) => {
    try {
      await kdsApi.updateStatus(id, "READY" as any);
      fetchOrders();
    } catch (error) {
      console.error("Failed to mark ready:", error);
    }
  }, []);

  const completeOrder = useCallback(async (id: string) => {
    try {
      await kdsApi.updateStatus(id, "FINISHED" as any);
      fetchOrders();
    } catch (error) {
      console.error("Failed to complete order:", error);
    }
  }, []);

  const filtered =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  // Priority sort: critical first, then pending, cooking, ready
  const sorted = [...filtered].sort((a, b) => {
    const urgA = getMinutesElapsed(a.createdAt);
    const urgB = getMinutesElapsed(b.createdAt);
    return urgB - urgA; // more elapsed = higher priority
  });

  const counts = {
    pending: orders.filter((o) => o.status === "pending").length,
    cooking: orders.filter((o) => o.status === "cooking").length,
    ready: orders.filter((o) => o.status === "ready").length,
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerTitleRow}>
            <View style={styles.kdsIcon}>
              <Ionicons
                name="flame"
                size={20}
                color={GourmetColors.accent.orange}
              />
            </View>
            <View>
              <Text style={styles.screenTitle}>Kitchen Display</Text>
              <Text style={styles.screenSubtitle}>
                {orders.length} active orders
              </Text>
            </View>
          </View>
          {/* Live indicator */}
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>

        {/* Summary stat badges */}
        <View style={styles.statRow}>
          <TouchableOpacity
            style={[
              styles.statBadge,
              filter === "all" && styles.statBadgeActive,
            ]}
            onPress={() => setFilter("all")}
          >
            <Text
              style={[styles.statCount, { color: GourmetColors.text.primary }]}
            >
              {orders.length}
            </Text>
            <Text style={styles.statLabel}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.statBadge,
              styles.pendingBg,
              filter === "pending" && styles.statBadgeActive,
            ]}
            onPress={() => setFilter("pending")}
          >
            <Text
              style={[styles.statCount, { color: GourmetColors.accent.blue }]}
            >
              {counts.pending}
            </Text>
            <Text style={styles.statLabel}>Pending</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.statBadge,
              styles.cookingBg,
              filter === "cooking" && styles.statBadgeActive,
            ]}
            onPress={() => setFilter("cooking")}
          >
            <Text
              style={[styles.statCount, { color: GourmetColors.accent.orange }]}
            >
              {counts.cooking}
            </Text>
            <Text style={styles.statLabel}>Cooking</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.statBadge,
              styles.readyBg,
              filter === "ready" && styles.statBadgeActive,
            ]}
            onPress={() => setFilter("ready")}
          >
            <Text
              style={[
                styles.statCount,
                { color: GourmetColors.accent.emerald },
              ]}
            >
              {counts.ready}
            </Text>
            <Text style={styles.statLabel}>Ready</Text>
          </TouchableOpacity>
        </View>

        {/* Urgency legend */}
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                { backgroundColor: GourmetColors.accent.amber },
              ]}
            />
            <Text style={styles.legendText}>⚠ &gt;15min</Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                { backgroundColor: GourmetColors.accent.red },
              ]}
            />
            <Text style={styles.legendText}>🚨 &gt;25min</Text>
          </View>
          <View style={styles.legendItem}>
            <Ionicons
              name="hand-left-outline"
              size={11}
              color={GourmetColors.text.muted}
            />
            <Text style={styles.legendText}>Hold = Mark Ready</Text>
          </View>
        </View>
      </View>

      {/* Order grid */}
      <FlatList
        data={sorted}
        keyExtractor={(o) => o.id}
        numColumns={IS_TABLET ? 3 : 1}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <OrderCard
            order={item}
            onStartCooking={startCooking}
            onMarkReady={markReady}
            onComplete={completeOrder}
          />
        )}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={{ fontSize: 48 }}>🎉</Text>
            <Text style={styles.emptyTitle}>All caught up!</Text>
            <Text style={styles.emptySubtitle}>
              No orders in the kitchen right now.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: GourmetColors.bg.primary },
  header: {
    backgroundColor: GourmetColors.bg.secondary,
    paddingTop: Platform.OS === "ios" ? 54 : 30,
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitleRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  kdsIcon: {
    width: 40,
    height: 40,
    borderRadius: GourmetRadii.md,
    backgroundColor: GourmetColors.accent.orangeGlow,
    borderWidth: 1,
    borderColor: "rgba(249,115,22,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: GourmetColors.text.primary,
  },
  screenSubtitle: { fontSize: 12, color: GourmetColors.text.muted },
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(16,185,129,0.1)",
    borderRadius: GourmetRadii.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.2)",
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 99,
    backgroundColor: GourmetColors.accent.emerald,
  },
  liveText: {
    fontSize: 10,
    fontWeight: "800",
    color: GourmetColors.accent.emerald,
    letterSpacing: 1,
  },
  statRow: { flexDirection: "row", gap: 8 },
  statBadge: {
    flex: 1,
    alignItems: "center",
    backgroundColor: GourmetColors.bg.tertiary,
    borderRadius: GourmetRadii.md,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  statBadgeActive: {
    borderColor: "rgba(255,255,255,0.15)",
    transform: [{ scale: 1.03 }],
  },
  pendingBg: { backgroundColor: "rgba(59,130,246,0.08)" },
  cookingBg: { backgroundColor: "rgba(249,115,22,0.08)" },
  readyBg: { backgroundColor: "rgba(16,185,129,0.08)" },
  statCount: { fontSize: 20, fontWeight: "900" },
  statLabel: {
    fontSize: 10,
    color: GourmetColors.text.muted,
    fontWeight: "600",
  },
  legendRow: { flexDirection: "row", gap: 16 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 99 },
  legendText: { fontSize: 11, color: GourmetColors.text.muted },
  grid: { padding: 16, gap: 16 },

  // Card
  cardContainer: {
    width: IS_TABLET ? CARD_WIDTH : "100%",
    marginHorizontal: IS_TABLET ? 4 : 0,
  },
  card: {
    backgroundColor: GourmetColors.bg.secondary,
    borderRadius: GourmetRadii.xl,
    borderWidth: 1.5,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 14,
  },
  tableLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: GourmetColors.text.muted,
    letterSpacing: 1,
  },
  orderId: {
    fontSize: 18,
    fontWeight: "900",
    color: GourmetColors.text.primary,
  },
  cardHeaderRight: { alignItems: "flex-end", gap: 6 },
  timerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: GourmetRadii.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  timerText: { fontSize: 13, fontWeight: "800" },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: GourmetRadii.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: { fontSize: 11, fontWeight: "700" },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    marginHorizontal: 14,
  },
  itemsList: { padding: 14, gap: 10 },
  orderItem: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  qtyBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: GourmetColors.bg.tertiary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  qtyText: {
    fontSize: 12,
    fontWeight: "800",
    color: GourmetColors.text.secondary,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "700",
    color: GourmetColors.text.primary,
  },
  modifier: {
    fontSize: 11,
    color: GourmetColors.accent.amber,
    marginTop: 2,
    fontWeight: "500",
  },
  cardActions: {
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: GourmetRadii.md,
    height: 40,
    gap: 6,
  },
  cookingBtn: { backgroundColor: GourmetColors.accent.blue },
  readyBtn: { backgroundColor: GourmetColors.accent.emerald },
  completeBtn: { backgroundColor: GourmetColors.accent.purple },
  actionBtnText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  longPressHint: {
    fontSize: 10,
    color: GourmetColors.text.muted,
    textAlign: "center",
  },

  // Empty state
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: GourmetColors.text.primary,
  },
  emptySubtitle: { fontSize: 14, color: GourmetColors.text.muted },
});
