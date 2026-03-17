import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Dimensions,
  Modal,
  FlatList,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { GourmetColors, GourmetRadii } from "@/constants/gourmet-theme";
import { posApi } from "@/api/pos";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IS_TABLET = SCREEN_WIDTH >= 768;

// ─── Mock Data ────────────────────────────────────────────────────────────────
type TableStatus = "free" | "occupied" | "bill_requested";

interface Table {
  id: string;
  number: number;
  capacity: number;
  status: TableStatus;
  currentOrder?: string;
  occupiedSince?: string;
}

const MOCK_TABLES: Table[] = [
  { id: "t1", number: 1, capacity: 2, status: "free" },
  {
    id: "t2",
    number: 2,
    capacity: 4,
    status: "occupied",
    currentOrder: "ORD-042",
    occupiedSince: "18:30",
  },
  {
    id: "t3",
    number: 3,
    capacity: 4,
    status: "occupied",
    currentOrder: "ORD-041",
    occupiedSince: "18:10",
  },
  {
    id: "t4",
    number: 4,
    capacity: 6,
    status: "bill_requested",
    currentOrder: "ORD-039",
    occupiedSince: "17:45",
  },
  { id: "t5", number: 5, capacity: 2, status: "free" },
  {
    id: "t6",
    number: 6,
    capacity: 4,
    status: "occupied",
    currentOrder: "ORD-043",
    occupiedSince: "18:45",
  },
  { id: "t7", number: 7, capacity: 8, status: "free" },
  {
    id: "t8",
    number: 8,
    capacity: 4,
    status: "bill_requested",
    currentOrder: "ORD-038",
    occupiedSince: "17:20",
  },
  { id: "t9", number: 9, capacity: 2, status: "free" },
  {
    id: "t10",
    number: 10,
    capacity: 6,
    status: "occupied",
    currentOrder: "ORD-044",
    occupiedSince: "18:55",
  },
  { id: "t11", number: 11, capacity: 4, status: "free" },
  {
    id: "t12",
    number: 12,
    capacity: 2,
    status: "occupied",
    currentOrder: "ORD-040",
    occupiedSince: "18:00",
  },
];

type MenuCategory = "All" | "Starters" | "Mains" | "Drinks" | "Desserts";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: Exclude<MenuCategory, "All">;
  emoji: string;
  description: string;
  available: boolean;
  modifiers?: string[];
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: "m1",
    name: "Burrata & Tomato",
    price: 14.5,
    category: "Starters",
    emoji: "🧀",
    description: "Fresh burrata, heirloom tomatoes, basil oil",
    available: true,
    modifiers: ["No basil", "Extra drizzle"],
  },
  {
    id: "m2",
    name: "Beef Carpaccio",
    price: 16,
    category: "Starters",
    emoji: "🥩",
    description: "Thinly sliced wagyu, capers, parmesan",
    available: true,
  },
  {
    id: "m3",
    name: "Truffle Arancini",
    price: 12,
    category: "Starters",
    emoji: "🍙",
    description: "Crispy risotto balls with black truffle",
    available: false,
  },
  {
    id: "m4",
    name: "Filet Mignon 8oz",
    price: 56,
    category: "Mains",
    emoji: "🥩",
    description: "AAA beef, red wine jus, potato gratin",
    available: true,
    modifiers: ["Rare", "Medium-rare", "Medium", "Well done"],
  },
  {
    id: "m5",
    name: "Lobster Risotto",
    price: 42,
    category: "Mains",
    emoji: "🦞",
    description: "Atlantic lobster tail, saffron cream",
    available: true,
    modifiers: ["No cream", "Extra lobster"],
  },
  {
    id: "m6",
    name: "Duck Confit",
    price: 38,
    category: "Mains",
    emoji: "🍗",
    description: "48hr confit leg, cherry reduction, lentils",
    available: true,
  },
  {
    id: "m7",
    name: "Salmon en Papillote",
    price: 34,
    category: "Mains",
    emoji: "🐟",
    description: "Atlantic salmon, fennel, citrus butter",
    available: true,
    modifiers: ["No fennel", "Extra lemon"],
  },
  {
    id: "m8",
    name: "House Negroni",
    price: 14,
    category: "Drinks",
    emoji: "🍸",
    description: "Gin, Campari, sweet vermouth, orange peel",
    available: true,
  },
  {
    id: "m9",
    name: "Champagne Flute",
    price: 18,
    category: "Drinks",
    emoji: "🥂",
    description: "Moët & Chandon Brut Imperial",
    available: true,
  },
  {
    id: "m10",
    name: "Still Water 750ml",
    price: 5,
    category: "Drinks",
    emoji: "💧",
    description: "San Pellegrino still mineral water",
    available: true,
  },
  {
    id: "m11",
    name: "Crème Brûlée",
    price: 12,
    category: "Desserts",
    emoji: "🍮",
    description: "Classic vanilla custard, caramelized sugar",
    available: true,
  },
  {
    id: "m12",
    name: "Chocolate Fondant",
    price: 14,
    category: "Desserts",
    emoji: "🍫",
    description: "Molten dark chocolate, vanilla gelato",
    available: true,
  },
];

interface CartItem extends MenuItem {
  quantity: number;
  selectedModifiers: string[];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TableStatusBadge({ status }: { status: TableStatus }) {
  const config = {
    free: {
      color: GourmetColors.status.free,
      label: "Free",
      bg: GourmetColors.accent.emeraldGlow,
    },
    occupied: {
      color: GourmetColors.status.occupied,
      label: "Occupied",
      bg: GourmetColors.accent.orangeGlow,
    },
    bill_requested: {
      color: GourmetColors.status.billRequested,
      label: "Bill",
      bg: GourmetColors.accent.redGlow,
    },
  }[status];
  return (
    <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
      <View style={[styles.statusDot, { backgroundColor: config.color }]} />
      <Text style={[styles.statusLabel, { color: config.color }]}>
        {config.label}
      </Text>
    </View>
  );
}

function TableCard({
  table,
  onSelect,
}: {
  table: Table;
  onSelect: (t: Table) => void;
}) {
  const borderColor = {
    free: "rgba(16,185,129,0.2)",
    occupied: "rgba(249,115,22,0.25)",
    bill_requested: "rgba(239,68,68,0.35)",
  }[table.status];

  const accentColor = {
    free: GourmetColors.status.free,
    occupied: GourmetColors.status.occupied,
    bill_requested: GourmetColors.status.billRequested,
  }[table.status];

  return (
    <TouchableOpacity
      style={[styles.tableCard, { borderColor }]}
      onPress={() => onSelect(table)}
      activeOpacity={0.8}
    >
      <View style={styles.tableHeader}>
        <Text style={[styles.tableNumber, { color: accentColor }]}>
          T{table.number}
        </Text>
        <View style={styles.tableCapacity}>
          <Ionicons
            name="people-outline"
            size={11}
            color={GourmetColors.text.muted}
          />
          <Text style={styles.tableCapacityText}>{table.capacity}</Text>
        </View>
      </View>
      <TableStatusBadge status={table.status} />
      {table.status !== "free" && (
        <Text style={styles.tableOrderId} numberOfLines={1}>
          {table.currentOrder}
        </Text>
      )}
    </TouchableOpacity>
  );
}

function MenuItemCard({
  item,
  onAdd,
}: {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.menuCard, !item.available && styles.menuCardDisabled]}
      onPress={() => item.available && onAdd(item)}
      activeOpacity={0.8}
    >
      <View style={styles.menuEmoji}>
        <Text style={styles.menuEmojiText}>{item.emoji}</Text>
        {!item.available && (
          <View style={styles.outOfStockBadge}>
            <Text style={styles.outOfStockText}>Out</Text>
          </View>
        )}
      </View>
      <View style={styles.menuInfo}>
        <Text style={styles.menuName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.menuDesc} numberOfLines={1}>
          {item.description}
        </Text>
        <View style={styles.menuFooter}>
          <Text style={styles.menuPrice}>${item.price.toFixed(2)}</Text>
          {item.available && (
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => onAdd(item)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="add" size={16} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

function CartPanel({
  cart,
  selectedTable,
  onRemove,
  onSend,
  onClose,
}: {
  cart: CartItem[];
  selectedTable: Table | null;
  onRemove: (id: string) => void;
  onSend: () => void;
  onClose?: () => void;
}) {
  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <View style={styles.cartPanel}>
      <View style={styles.cartHeader}>
        <View>
          <Text style={styles.cartTitle}>Order Cart</Text>
          {selectedTable && (
            <Text style={styles.cartSubtitle}>
              Table {selectedTable.number} · {cart.length} items
            </Text>
          )}
        </View>
        {onClose && (
          <TouchableOpacity style={styles.cartClose} onPress={onClose}>
            <Ionicons
              name="close"
              size={20}
              color={GourmetColors.text.secondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {cart.length === 0 ? (
        <View style={styles.cartEmpty}>
          <Text style={{ fontSize: 36 }}>🛒</Text>
          <Text style={styles.cartEmptyText}>Select a table and add items</Text>
        </View>
      ) : (
        <>
          <ScrollView
            style={styles.cartItems}
            showsVerticalScrollIndicator={false}
          >
            {cart.map((item) => (
              <View key={item.id} style={styles.cartItem}>
                <Text style={styles.cartItemEmoji}>{item.emoji}</Text>
                <View style={styles.cartItemInfo}>
                  <Text style={styles.cartItemName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.cartItemPrice}>
                    ${(item.price * item.quantity).toFixed(2)}
                    {item.quantity > 1 && (
                      <Text style={styles.cartItemQty}> ×{item.quantity}</Text>
                    )}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.cartRemoveBtn}
                  onPress={() => onRemove(item.id)}
                >
                  <Ionicons
                    name="remove-circle"
                    size={22}
                    color={GourmetColors.text.muted}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          <View style={styles.cartTotals}>
            <View style={styles.cartTotalRow}>
              <Text style={styles.cartTotalLabel}>Subtotal</Text>
              <Text style={styles.cartTotalValue}>${subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.cartTotalRow}>
              <Text style={styles.cartTotalLabel}>Tax (10%)</Text>
              <Text style={styles.cartTotalValue}>${tax.toFixed(2)}</Text>
            </View>
            <View style={[styles.cartTotalRow, styles.cartTotalFinal]}>
              <Text style={styles.cartTotalFinalLabel}>Total</Text>
              <Text style={styles.cartTotalFinalValue}>
                ${total.toFixed(2)}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.sendBtn, !selectedTable && { opacity: 0.4 }]}
            onPress={onSend}
            disabled={!selectedTable}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={["#F97316", "#EA580C"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.sendGradient}
            >
              <Ionicons name="flame" size={18} color="#fff" />
              <Text style={styles.sendBtnText}>Send to Kitchen</Text>
            </LinearGradient>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function POSScreen() {
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [menuCategory, setMenuCategory] = useState<MenuCategory>("All");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartVisible, setCartVisible] = useState(false);
  const [view, setView] = useState<"tables" | "menu">("tables");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await posApi.getProducts();
      // Map backend Product to frontend MenuItem
      const mapped = data.map((p: any) => ({
        id: p._id,
        name: p.name,
        price: p.price,
        category: "Mains" as any, // backend doesn't have category yet
        emoji: "🍲",
        description: "Freshly prepared dish",
        available: true,
      }));
      setMenuItems(mapped);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const categories: MenuCategory[] = [
    "All",
    "Starters",
    "Mains",
    "Drinks",
    "Desserts",
  ];

  const filteredMenu =
    menuCategory === "All"
      ? menuItems
      : menuItems.filter((i) => i.category === menuCategory);

  const addToCart = useCallback((item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c,
        );
      }
      return [...prev, { ...item, quantity: 1, selectedModifiers: [] }];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const handleTableSelect = (table: Table) => {
    setSelectedTable(table);
    setView("menu");
  };

  const handleSendToKitchen = async () => {
    if (cart.length === 0) return;
    try {
      const orderItems = cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        notes: "",
      }));
      await posApi.createOrder(orderItems);
      setCart([]);
      setCartVisible(false);
      setView("tables");
      setSelectedTable(null);
      alert("Order sent to kitchen!");
    } catch (error) {
      console.error("Failed to send order:", error);
      alert("Failed to send order. Please try again.");
    }
  };

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  // ── Header ──
  const Header = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <TouchableOpacity
          style={[
            styles.headerTab,
            view === "tables" && styles.headerTabActive,
          ]}
          onPress={() => setView("tables")}
        >
          <Ionicons
            name={view === "tables" ? "grid" : "grid-outline"}
            size={16}
            color={
              view === "tables"
                ? GourmetColors.accent.emerald
                : GourmetColors.text.muted
            }
          />
          <Text
            style={[
              styles.headerTabText,
              view === "tables" && styles.headerTabTextActive,
            ]}
          >
            Tables
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.headerTab, view === "menu" && styles.headerTabActive]}
          onPress={() => setView("menu")}
        >
          <Ionicons
            name={view === "menu" ? "restaurant" : "restaurant-outline"}
            size={16}
            color={
              view === "menu"
                ? GourmetColors.accent.emerald
                : GourmetColors.text.muted
            }
          />
          <Text
            style={[
              styles.headerTabText,
              view === "menu" && styles.headerTabTextActive,
            ]}
          >
            Menu
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.headerRight}>
        {selectedTable && (
          <View style={styles.selectedTableBadge}>
            <Ionicons
              name="location"
              size={12}
              color={GourmetColors.accent.orange}
            />
            <Text style={styles.selectedTableText}>
              T{selectedTable.number}
            </Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.cartFab}
          onPress={() => setCartVisible(true)}
        >
          <Ionicons
            name="cart-outline"
            size={20}
            color={GourmetColors.text.primary}
          />
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  // ── Subscription status bar ──
  const SubBar = () => (
    <View style={styles.subBar}>
      <View style={styles.subBarDot} />
      <Text style={styles.subBarText}>
        Subscription Active · Stripe · Next billing Mar 15
      </Text>
      <View style={styles.subBarRight}>
        <Ionicons
          name="shield-checkmark"
          size={12}
          color={GourmetColors.sub.active}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <SubBar />

      {IS_TABLET ? (
        // ── TABLET: Split view ──
        <View style={styles.splitView}>
          <View style={styles.splitLeft}>
            <Header />
            {view === "tables" ? (
              <ScrollView
                contentContainerStyle={styles.tableGrid}
                showsVerticalScrollIndicator={false}
              >
                {MOCK_TABLES.map((table) => (
                  <TableCard
                    key={table.id}
                    table={table}
                    onSelect={handleTableSelect}
                  />
                ))}
              </ScrollView>
            ) : (
              <>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.catScroll}
                  contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
                >
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.catChip,
                        menuCategory === cat && styles.catChipActive,
                      ]}
                      onPress={() => setMenuCategory(cat)}
                    >
                      <Text
                        style={[
                          styles.catText,
                          menuCategory === cat && styles.catTextActive,
                        ]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <FlatList
                  data={filteredMenu}
                  keyExtractor={(i) => i.id}
                  numColumns={2}
                  contentContainerStyle={styles.menuGrid}
                  renderItem={({ item }) => (
                    <MenuItemCard item={item} onAdd={addToCart} />
                  )}
                  showsVerticalScrollIndicator={false}
                />
              </>
            )}
          </View>
          <CartPanel
            cart={cart}
            selectedTable={selectedTable}
            onRemove={removeFromCart}
            onSend={handleSendToKitchen}
          />
        </View>
      ) : (
        // ── MOBILE: Stack view ──
        <View style={{ flex: 1 }}>
          <Header />
          {view === "tables" ? (
            <FlatList
              data={MOCK_TABLES}
              keyExtractor={(t) => t.id}
              numColumns={3}
              contentContainerStyle={styles.tableGrid}
              renderItem={({ item }) => (
                <TableCard table={item} onSelect={handleTableSelect} />
              )}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={{ flex: 1 }}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.catScroll}
                contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
              >
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.catChip,
                      menuCategory === cat && styles.catChipActive,
                    ]}
                    onPress={() => setMenuCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.catText,
                        menuCategory === cat && styles.catTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <FlatList
                data={filteredMenu}
                keyExtractor={(i) => i.id}
                numColumns={2}
                contentContainerStyle={styles.menuGrid}
                renderItem={({ item }) => (
                  <MenuItemCard item={item} onAdd={addToCart} />
                )}
                showsVerticalScrollIndicator={false}
              />
            </View>
          )}

          {/* Cart bottom sheet modal */}
          <Modal
            visible={cartVisible}
            animationType="slide"
            transparent
            presentationStyle="overFullScreen"
          >
            <TouchableOpacity
              style={styles.modalBackdrop}
              activeOpacity={1}
              onPress={() => setCartVisible(false)}
            />
            <View style={styles.bottomSheet}>
              <View style={styles.bottomSheetHandle} />
              <CartPanel
                cart={cart}
                selectedTable={selectedTable}
                onRemove={removeFromCart}
                onSend={handleSendToKitchen}
                onClose={() => setCartVisible(false)}
              />
            </View>
          </Modal>
        </View>
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: GourmetColors.bg.primary },

  // Subscription bar
  subBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: GourmetColors.bg.secondary,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
    gap: 6,
    paddingTop: Platform.OS === "ios" ? 54 : 30,
  },
  subBarDot: {
    width: 6,
    height: 6,
    borderRadius: 99,
    backgroundColor: GourmetColors.sub.active,
  },
  subBarText: {
    flex: 1,
    fontSize: 11,
    color: GourmetColors.text.muted,
    fontWeight: "500",
  },
  subBarRight: {},

  // Header tabs
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: GourmetColors.bg.secondary,
    borderRadius: GourmetRadii.lg,
    padding: 4,
    borderWidth: 1,
    borderColor: GourmetColors.bg.glassBorder,
  },
  headerTab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: GourmetRadii.md,
  },
  headerTabActive: { backgroundColor: GourmetColors.accent.emeraldGlow },
  headerTabText: {
    fontSize: 14,
    fontWeight: "600",
    color: GourmetColors.text.muted,
  },
  headerTabTextActive: { color: GourmetColors.accent.emerald },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  selectedTableBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: GourmetColors.accent.orangeGlow,
    borderRadius: GourmetRadii.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "rgba(249,115,22,0.2)",
  },
  selectedTableText: {
    fontSize: 12,
    color: GourmetColors.accent.orange,
    fontWeight: "700",
  },
  cartFab: {
    width: 44,
    height: 44,
    borderRadius: GourmetRadii.md,
    backgroundColor: GourmetColors.bg.secondary,
    borderWidth: 1,
    borderColor: GourmetColors.bg.glassBorder,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: GourmetColors.accent.orange,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: { fontSize: 10, color: "#fff", fontWeight: "800" },

  // Table grid
  tableGrid: { padding: 16, gap: 10, flexDirection: "row", flexWrap: "wrap" },
  tableCard: {
    width: IS_TABLET ? "30%" : "30%",
    aspectRatio: 0.9,
    backgroundColor: GourmetColors.bg.secondary,
    borderRadius: GourmetRadii.lg,
    borderWidth: 1.5,
    padding: 12,
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    minWidth: 95,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tableNumber: { fontSize: 20, fontWeight: "800" },
  tableCapacity: { flexDirection: "row", alignItems: "center", gap: 2 },
  tableCapacityText: {
    fontSize: 11,
    color: GourmetColors.text.muted,
    fontWeight: "500",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: GourmetRadii.sm,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  statusDot: { width: 5, height: 5, borderRadius: 99 },
  statusLabel: { fontSize: 10, fontWeight: "700" },
  tableOrderId: {
    fontSize: 10,
    color: GourmetColors.text.muted,
    fontWeight: "500",
  },

  // Menu
  catScroll: { maxHeight: 50, marginVertical: 8 },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: GourmetRadii.full,
    backgroundColor: GourmetColors.bg.secondary,
    borderWidth: 1,
    borderColor: GourmetColors.bg.glassBorder,
    height: 36,
    justifyContent: "center",
  },
  catChipActive: {
    backgroundColor: GourmetColors.accent.emeraldGlow,
    borderColor: "rgba(16,185,129,0.3)",
  },
  catText: { fontSize: 13, fontWeight: "600", color: GourmetColors.text.muted },
  catTextActive: { color: GourmetColors.accent.emerald },
  menuGrid: { padding: 12, gap: 10, flexDirection: "row", flexWrap: "wrap" },
  menuCard: {
    width: "48%",
    backgroundColor: GourmetColors.bg.secondary,
    borderRadius: GourmetRadii.lg,
    borderWidth: 1,
    borderColor: GourmetColors.bg.glassBorder,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  menuCardDisabled: { opacity: 0.45 },
  menuEmoji: {
    height: 72,
    backgroundColor: GourmetColors.bg.tertiary,
    justifyContent: "center",
    alignItems: "center",
  },
  menuEmojiText: { fontSize: 36 },
  outOfStockBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "rgba(239,68,68,0.8)",
    borderRadius: GourmetRadii.sm,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  outOfStockText: { fontSize: 9, color: "#fff", fontWeight: "700" },
  menuInfo: { padding: 10, gap: 3 },
  menuName: {
    fontSize: 13,
    fontWeight: "700",
    color: GourmetColors.text.primary,
  },
  menuDesc: { fontSize: 11, color: GourmetColors.text.muted },
  menuFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  menuPrice: {
    fontSize: 14,
    fontWeight: "800",
    color: GourmetColors.accent.emerald,
  },
  addBtn: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: GourmetColors.accent.emerald,
    justifyContent: "center",
    alignItems: "center",
  },

  // Cart Panel
  cartPanel: {
    backgroundColor: GourmetColors.bg.secondary,
    flex: IS_TABLET ? 1 : undefined,
    maxWidth: IS_TABLET ? 340 : undefined,
    borderLeftWidth: IS_TABLET ? 1 : 0,
    borderLeftColor: "rgba(255,255,255,0.06)",
    padding: 20,
    gap: 16,
  },
  cartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cartTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: GourmetColors.text.primary,
  },
  cartSubtitle: { fontSize: 13, color: GourmetColors.text.muted, marginTop: 2 },
  cartClose: {
    width: 32,
    height: 32,
    borderRadius: GourmetRadii.sm,
    backgroundColor: GourmetColors.bg.tertiary,
    justifyContent: "center",
    alignItems: "center",
  },
  cartEmpty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 40,
  },
  cartEmptyText: {
    fontSize: 14,
    color: GourmetColors.text.muted,
    textAlign: "center",
  },
  cartItems: {
    flex: IS_TABLET ? 1 : undefined,
    maxHeight: IS_TABLET ? undefined : 220,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  cartItemEmoji: { fontSize: 24, width: 36, textAlign: "center" },
  cartItemInfo: { flex: 1 },
  cartItemName: {
    fontSize: 13,
    fontWeight: "600",
    color: GourmetColors.text.primary,
  },
  cartItemPrice: {
    fontSize: 13,
    color: GourmetColors.accent.emerald,
    fontWeight: "700",
    marginTop: 2,
  },
  cartItemQty: {
    fontSize: 12,
    color: GourmetColors.text.muted,
    fontWeight: "500",
  },
  cartRemoveBtn: { padding: 4 },
  cartTotals: {
    gap: 6,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
  },
  cartTotalRow: { flexDirection: "row", justifyContent: "space-between" },
  cartTotalLabel: { fontSize: 13, color: GourmetColors.text.muted },
  cartTotalValue: {
    fontSize: 13,
    color: GourmetColors.text.secondary,
    fontWeight: "600",
  },
  cartTotalFinal: {
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
  },
  cartTotalFinalLabel: {
    fontSize: 16,
    fontWeight: "800",
    color: GourmetColors.text.primary,
  },
  cartTotalFinalValue: {
    fontSize: 18,
    fontWeight: "900",
    color: GourmetColors.accent.emerald,
  },
  sendBtn: {
    borderRadius: GourmetRadii.md,
    overflow: "hidden",
    shadowColor: GourmetColors.accent.orange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  sendGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 52,
    gap: 8,
  },
  sendBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },

  // Split view (tablet)
  splitView: { flex: 1, flexDirection: "row" },
  splitLeft: { flex: 1 },

  // Bottom sheet (mobile)
  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.55)" },
  bottomSheet: {
    backgroundColor: GourmetColors.bg.secondary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "80%",
    borderTopWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 99,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 6,
  },
});
