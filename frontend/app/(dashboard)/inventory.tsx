import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Platform,
  TextInput,
  Modal,
  Dimensions,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { GourmetColors, GourmetRadii } from "@/constants/gourmet-theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IS_TABLET = SCREEN_WIDTH >= 768;

// ─── Types & Mock Data ────────────────────────────────────────────────────────

type InventoryCategory =
  | "All"
  | "Proteins"
  | "Produce"
  | "Dairy"
  | "Beverages"
  | "Dry Goods";

interface InventoryItem {
  id: string;
  name: string;
  category: Exclude<InventoryCategory, "All">;
  unit: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  emoji: string;
  lastUpdated: string;
  outOfStock: boolean;
}

const MOCK_INVENTORY: InventoryItem[] = [
  {
    id: "i1",
    name: "Wagyu Beef Tenderloin",
    category: "Proteins",
    unit: "kg",
    currentStock: 4.5,
    minStock: 5,
    maxStock: 20,
    emoji: "🥩",
    lastUpdated: "2h ago",
    outOfStock: false,
  },
  {
    id: "i2",
    name: "Atlantic Lobster",
    category: "Proteins",
    unit: "pcs",
    currentStock: 8,
    minStock: 10,
    maxStock: 40,
    emoji: "🦞",
    lastUpdated: "1h ago",
    outOfStock: false,
  },
  {
    id: "i3",
    name: "Duck Leg Confit",
    category: "Proteins",
    unit: "pcs",
    currentStock: 12,
    minStock: 8,
    maxStock: 30,
    emoji: "🍗",
    lastUpdated: "3h ago",
    outOfStock: false,
  },
  {
    id: "i4",
    name: "Salmon Fillet",
    category: "Proteins",
    unit: "kg",
    currentStock: 2.1,
    minStock: 3,
    maxStock: 15,
    emoji: "🐟",
    lastUpdated: "30m ago",
    outOfStock: false,
  },
  {
    id: "i5",
    name: "Truffle (Black)",
    category: "Produce",
    unit: "g",
    currentStock: 0,
    minStock: 50,
    maxStock: 200,
    emoji: "🍄",
    lastUpdated: "12h ago",
    outOfStock: true,
  },
  {
    id: "i6",
    name: "Heirloom Tomatoes",
    category: "Produce",
    unit: "kg",
    currentStock: 6,
    minStock: 4,
    maxStock: 20,
    emoji: "🍅",
    lastUpdated: "5h ago",
    outOfStock: false,
  },
  {
    id: "i7",
    name: "Fresh Basil",
    category: "Produce",
    unit: "bunches",
    currentStock: 2,
    minStock: 5,
    maxStock: 20,
    emoji: "🌿",
    lastUpdated: "5h ago",
    outOfStock: false,
  },
  {
    id: "i8",
    name: "Fresh Burrata",
    category: "Dairy",
    unit: "pcs",
    currentStock: 4,
    minStock: 6,
    maxStock: 24,
    emoji: "🧀",
    lastUpdated: "2h ago",
    outOfStock: false,
  },
  {
    id: "i9",
    name: "Heavy Cream",
    category: "Dairy",
    unit: "L",
    currentStock: 3.5,
    minStock: 2,
    maxStock: 12,
    emoji: "🥛",
    lastUpdated: "1h ago",
    outOfStock: false,
  },
  {
    id: "i10",
    name: "Moët & Chandon",
    category: "Beverages",
    unit: "bottles",
    currentStock: 6,
    minStock: 12,
    maxStock: 48,
    emoji: "🍾",
    lastUpdated: "6h ago",
    outOfStock: false,
  },
  {
    id: "i11",
    name: "Campari",
    category: "Beverages",
    unit: "bottles",
    currentStock: 3,
    minStock: 2,
    maxStock: 10,
    emoji: "🍸",
    lastUpdated: "6h ago",
    outOfStock: false,
  },
  {
    id: "i12",
    name: "Arborio Rice",
    category: "Dry Goods",
    unit: "kg",
    currentStock: 8,
    minStock: 5,
    maxStock: 25,
    emoji: "🍚",
    lastUpdated: "1d ago",
    outOfStock: false,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getStockLevel(item: InventoryItem): "out" | "low" | "ok" | "high" {
  if (item.outOfStock || item.currentStock === 0) return "out";
  const ratio = item.currentStock / item.maxStock;
  if (item.currentStock < item.minStock) return "low";
  if (ratio >= 0.7) return "high";
  return "ok";
}

function getStockColor(level: ReturnType<typeof getStockLevel>) {
  return {
    out: GourmetColors.status.critical,
    low: GourmetColors.accent.amber,
    ok: GourmetColors.accent.emerald,
    high: GourmetColors.accent.blue,
  }[level];
}

// ─── Stock Row ────────────────────────────────────────────────────────────────

function InventoryRow({
  item,
  onAdjust,
  onMarkOut,
}: {
  item: InventoryItem;
  onAdjust: (item: InventoryItem) => void;
  onMarkOut: (id: string) => void;
}) {
  const level = getStockLevel(item);
  const color = getStockColor(level);
  const ratio = item.outOfStock
    ? 0
    : Math.min(item.currentStock / item.maxStock, 1);

  return (
    <View style={[styles.row, item.outOfStock && styles.rowOutOfStock]}>
      <View style={styles.rowLeft}>
        <View
          style={[styles.emojiContainer, { backgroundColor: `${color}15` }]}
        >
          <Text style={styles.rowEmoji}>{item.emoji}</Text>
          {level === "out" && (
            <View style={styles.outOverlay}>
              <Ionicons name="close" size={12} color="#fff" />
            </View>
          )}
        </View>
        <View style={styles.rowInfo}>
          <View style={styles.rowNameRow}>
            <Text style={styles.rowName} numberOfLines={1}>
              {item.name}
            </Text>
            {level === "low" && (
              <View style={styles.lowBadge}>
                <Ionicons
                  name="warning"
                  size={10}
                  color={GourmetColors.accent.amber}
                />
                <Text style={styles.lowBadgeText}>Low</Text>
              </View>
            )}
            {level === "out" && (
              <View style={[styles.lowBadge, styles.outBadge]}>
                <Text style={styles.outBadgeText}>Out of Stock</Text>
              </View>
            )}
          </View>
          <Text style={styles.rowCategory}>
            {item.category} · {item.lastUpdated}
          </Text>
          {/* Progress bar */}
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressBar,
                { width: `${ratio * 100}%`, backgroundColor: color },
              ]}
            />
          </View>
          <Text style={[styles.stockText, { color }]}>
            {item.outOfStock
              ? "Out of stock"
              : `${item.currentStock} / ${item.maxStock} ${item.unit}`}
          </Text>
        </View>
      </View>

      {/* Quick actions */}
      <View style={styles.rowActions}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.adjustBtn]}
          onPress={() => onAdjust(item)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="add" size={14} color={GourmetColors.accent.emerald} />
        </TouchableOpacity>
        {!item.outOfStock ? (
          <TouchableOpacity
            style={[styles.actionBtn, styles.outBtn]}
            onPress={() => onMarkOut(item.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name="remove"
              size={14}
              color={GourmetColors.status.critical}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.actionBtn, styles.restoreBtn]}
            onPress={() => onAdjust(item)}
          >
            <Ionicons
              name="refresh"
              size={14}
              color={GourmetColors.accent.blue}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

// ─── Adjust Stock Modal ───────────────────────────────────────────────────────

function AdjustModal({
  item,
  onClose,
  onSave,
}: {
  item: InventoryItem | null;
  onClose: () => void;
  onSave: (id: string, newQty: number) => void;
}) {
  const [qty, setQty] = useState(item?.currentStock.toString() ?? "0");
  if (!item) return null;
  return (
    <Modal
      transparent
      animationType="slide"
      visible={!!item}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalBackdrop}
        activeOpacity={1}
        onPress={onClose}
      />
      <View style={styles.adjustSheet}>
        <View style={styles.sheetHandle} />
        <View style={styles.adjustHeader}>
          <Text style={styles.adjustEmoji}>{item.emoji}</Text>
          <View>
            <Text style={styles.adjustTitle}>{item.name}</Text>
            <Text style={styles.adjustUnit}>Unit: {item.unit}</Text>
          </View>
        </View>
        <View style={styles.adjustBody}>
          <Text style={styles.adjustLabel}>New Stock Quantity</Text>
          <View style={styles.qtyRow}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() =>
                setQty((v) => Math.max(0, parseFloat(v || "0") - 1).toString())
              }
            >
              <Ionicons
                name="remove"
                size={20}
                color={GourmetColors.text.primary}
              />
            </TouchableOpacity>
            <TextInput
              style={styles.qtyInput}
              value={qty}
              onChangeText={setQty}
              keyboardType="decimal-pad"
              selectTextOnFocus
            />
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() =>
                setQty((v) => (parseFloat(v || "0") + 1).toString())
              }
            >
              <Ionicons
                name="add"
                size={20}
                color={GourmetColors.text.primary}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.stockInfo}>
            <Text style={styles.stockInfoText}>
              Min: {item.minStock} {item.unit}
            </Text>
            <Text style={styles.stockInfoText}>
              Max: {item.maxStock} {item.unit}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={() => {
            onSave(item.id, parseFloat(qty) || 0);
            onClose();
          }}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={["#10B981", "#059669"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.saveBtnGradient}
          >
            <Ionicons name="checkmark" size={18} color="#fff" />
            <Text style={styles.saveBtnText}>Update Stock</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

// ─── Main Inventory Screen ────────────────────────────────────────────────────

export default function InventoryScreen() {
  const [inventory, setInventory] = useState<InventoryItem[]>(MOCK_INVENTORY);
  const [category, setCategory] = useState<InventoryCategory>("All");
  const [search, setSearch] = useState("");
  const [adjustItem, setAdjustItem] = useState<InventoryItem | null>(null);

  const categories: InventoryCategory[] = [
    "All",
    "Proteins",
    "Produce",
    "Dairy",
    "Beverages",
    "Dry Goods",
  ];

  const markOut = useCallback((id: string) => {
    setInventory((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, outOfStock: true, currentStock: 0 } : i,
      ),
    );
  }, []);

  const adjustStock = useCallback((id: string, qty: number) => {
    setInventory((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              currentStock: qty,
              outOfStock: qty === 0,
              lastUpdated: "Just now",
            }
          : i,
      ),
    );
  }, []);

  const filtered = inventory
    .filter((i) => category === "All" || i.category === category)
    .filter(
      (i) => !search || i.name.toLowerCase().includes(search.toLowerCase()),
    );

  // Stats
  const lowCount = inventory.filter((i) => getStockLevel(i) === "low").length;
  const outCount = inventory.filter((i) => i.outOfStock).length;
  const okCount = inventory.filter(
    (i) => getStockLevel(i) === "ok" || getStockLevel(i) === "high",
  ).length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.titleRow}>
            <View style={styles.headerIcon}>
              <Ionicons
                name="cube"
                size={20}
                color={GourmetColors.accent.blue}
              />
            </View>
            <View>
              <Text style={styles.headerTitle}>Inventory</Text>
              <Text style={styles.headerSubtitle}>
                {inventory.length} ingredients
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.addNewBtn}>
            <Ionicons
              name="add"
              size={20}
              color={GourmetColors.accent.emerald}
            />
          </TouchableOpacity>
        </View>

        {/* Alert summary */}
        {(lowCount > 0 || outCount > 0) && (
          <View style={styles.alertBanner}>
            <Ionicons
              name="warning"
              size={14}
              color={GourmetColors.accent.amber}
            />
            <Text style={styles.alertText}>
              {outCount > 0 ? `${outCount} out of stock` : ""}
              {outCount > 0 && lowCount > 0 ? " · " : ""}
              {lowCount > 0 ? `${lowCount} low stock` : ""}
              {" — affects POS menu availability"}
            </Text>
          </View>
        )}

        {/* Stats */}
        <View style={styles.statsRow}>
          <View
            style={[
              styles.statCard,
              {
                borderColor: "rgba(16,185,129,0.2)",
                backgroundColor: "rgba(16,185,129,0.07)",
              },
            ]}
          >
            <Text
              style={[styles.statNum, { color: GourmetColors.accent.emerald }]}
            >
              {okCount}
            </Text>
            <Text style={styles.statName}>In Stock</Text>
          </View>
          <View
            style={[
              styles.statCard,
              {
                borderColor: "rgba(245,158,11,0.25)",
                backgroundColor: "rgba(245,158,11,0.07)",
              },
            ]}
          >
            <Text
              style={[styles.statNum, { color: GourmetColors.accent.amber }]}
            >
              {lowCount}
            </Text>
            <Text style={styles.statName}>Low Stock</Text>
          </View>
          <View
            style={[
              styles.statCard,
              {
                borderColor: "rgba(239,68,68,0.25)",
                backgroundColor: "rgba(239,68,68,0.07)",
              },
            ]}
          >
            <Text
              style={[styles.statNum, { color: GourmetColors.status.critical }]}
            >
              {outCount}
            </Text>
            <Text style={styles.statName}>Out</Text>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchBar}>
          <Ionicons
            name="search-outline"
            size={16}
            color={GourmetColors.text.muted}
          />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search ingredients..."
            placeholderTextColor={GourmetColors.text.muted}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons
                name="close-circle"
                size={16}
                color={GourmetColors.text.muted}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Category pills */}
      <FlatList
        data={categories}
        horizontal
        keyExtractor={(c) => c}
        contentContainerStyle={styles.catList}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item: cat }) => (
          <TouchableOpacity
            style={[styles.catChip, category === cat && styles.catChipActive]}
            onPress={() => setCategory(cat)}
          >
            <Text
              style={[styles.catText, category === cat && styles.catTextActive]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        )}
        style={styles.catScroll}
      />

      {/* Inventory list */}
      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <InventoryRow
            item={item}
            onAdjust={setAdjustItem}
            onMarkOut={markOut}
          />
        )}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={{ fontSize: 40 }}>🔍</Text>
            <Text style={styles.emptyText}>No items match your search</Text>
          </View>
        }
      />

      {/* Adjust modal */}
      <AdjustModal
        item={adjustItem}
        onClose={() => setAdjustItem(null)}
        onSave={adjustStock}
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
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: GourmetRadii.md,
    backgroundColor: "rgba(59,130,246,0.1)",
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: GourmetColors.text.primary,
  },
  headerSubtitle: { fontSize: 12, color: GourmetColors.text.muted },
  addNewBtn: {
    width: 40,
    height: 40,
    borderRadius: GourmetRadii.md,
    backgroundColor: GourmetColors.accent.emeraldGlow,
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  alertBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(245,158,11,0.08)",
    borderRadius: GourmetRadii.md,
    borderWidth: 1,
    borderColor: "rgba(245,158,11,0.2)",
    padding: 10,
  },
  alertText: {
    fontSize: 12,
    color: GourmetColors.accent.amber,
    flex: 1,
    fontWeight: "500",
  },
  statsRow: { flexDirection: "row", gap: 10 },
  statCard: {
    flex: 1,
    borderRadius: GourmetRadii.md,
    borderWidth: 1,
    padding: 10,
    alignItems: "center",
    gap: 2,
  },
  statNum: { fontSize: 22, fontWeight: "900" },
  statName: {
    fontSize: 11,
    color: GourmetColors.text.muted,
    fontWeight: "600",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: GourmetColors.bg.tertiary,
    borderRadius: GourmetRadii.md,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    paddingHorizontal: 12,
    height: 42,
  },
  searchInput: { flex: 1, color: GourmetColors.text.primary, fontSize: 14 },
  catScroll: {
    maxHeight: 46,
    backgroundColor: GourmetColors.bg.secondary,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  catList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    alignItems: "center",
  },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: GourmetRadii.full,
    backgroundColor: GourmetColors.bg.tertiary,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
  },
  catChipActive: {
    backgroundColor: "rgba(59,130,246,0.12)",
    borderColor: "rgba(59,130,246,0.3)",
  },
  catText: { fontSize: 12, fontWeight: "600", color: GourmetColors.text.muted },
  catTextActive: { color: GourmetColors.accent.blue },
  list: { padding: 16, gap: 2 },
  separator: { height: 8 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: GourmetColors.bg.secondary,
    borderRadius: GourmetRadii.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: GourmetColors.bg.glassBorder,
    gap: 12,
  },
  rowOutOfStock: { opacity: 0.6, borderColor: "rgba(239,68,68,0.2)" },
  rowLeft: { flex: 1, flexDirection: "row", gap: 12, alignItems: "flex-start" },
  emojiContainer: {
    width: 44,
    height: 44,
    borderRadius: GourmetRadii.md,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  rowEmoji: { fontSize: 22 },
  outOverlay: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
  },
  rowInfo: { flex: 1, gap: 3 },
  rowNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  rowName: {
    fontSize: 14,
    fontWeight: "700",
    color: GourmetColors.text.primary,
    flexShrink: 1,
  },
  lowBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "rgba(245,158,11,0.15)",
    borderRadius: GourmetRadii.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  lowBadgeText: {
    fontSize: 10,
    color: GourmetColors.accent.amber,
    fontWeight: "700",
  },
  outBadge: { backgroundColor: "rgba(239,68,68,0.12)" },
  outBadgeText: {
    fontSize: 10,
    color: GourmetColors.status.critical,
    fontWeight: "700",
  },
  rowCategory: { fontSize: 11, color: GourmetColors.text.muted },
  progressTrack: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 99,
    overflow: "hidden",
    marginVertical: 4,
  },
  progressBar: { height: "100%", borderRadius: 99 },
  stockText: { fontSize: 11, fontWeight: "600" },
  rowActions: { gap: 6 },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: GourmetRadii.md,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  adjustBtn: {
    backgroundColor: GourmetColors.accent.emeraldGlow,
    borderColor: "rgba(16,185,129,0.25)",
  },
  outBtn: {
    backgroundColor: "rgba(239,68,68,0.08)",
    borderColor: "rgba(239,68,68,0.2)",
  },
  restoreBtn: {
    backgroundColor: "rgba(59,130,246,0.08)",
    borderColor: "rgba(59,130,246,0.2)",
  },

  // Adjust modal
  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)" },
  adjustSheet: {
    backgroundColor: GourmetColors.bg.secondary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    gap: 20,
    borderTopWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 99,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignSelf: "center",
    marginBottom: 8,
  },
  adjustHeader: { flexDirection: "row", alignItems: "center", gap: 14 },
  adjustEmoji: { fontSize: 40 },
  adjustTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: GourmetColors.text.primary,
  },
  adjustUnit: { fontSize: 13, color: GourmetColors.text.muted },
  adjustBody: { gap: 12 },
  adjustLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: GourmetColors.text.secondary,
  },
  qtyRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  qtyBtn: {
    width: 48,
    height: 48,
    borderRadius: GourmetRadii.md,
    backgroundColor: GourmetColors.bg.tertiary,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  qtyInput: {
    flex: 1,
    height: 52,
    backgroundColor: GourmetColors.bg.tertiary,
    borderRadius: GourmetRadii.md,
    borderWidth: 1.5,
    borderColor: GourmetColors.accent.emerald,
    color: GourmetColors.text.primary,
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
  },
  stockInfo: { flexDirection: "row", justifyContent: "space-between" },
  stockInfoText: { fontSize: 12, color: GourmetColors.text.muted },
  saveBtn: {
    borderRadius: GourmetRadii.md,
    overflow: "hidden",
    shadowColor: GourmetColors.accent.emerald,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  saveBtnGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 52,
    gap: 8,
  },
  saveBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  emptyState: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 14, color: GourmetColors.text.muted },
});
