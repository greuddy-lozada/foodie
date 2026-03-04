// GourmetFlow Design System Constants
// Restaurant Dark Theme - Deep Charcoal backgrounds with vibrant status accents

export const GourmetColors = {
  // Background hierarchy
  bg: {
    primary: "#0F1117", // Deep charcoal - main background
    secondary: "#161B25", // Sidebar / card backgrounds
    tertiary: "#1E2535", // Elevated cards
    elevated: "#252D3D", // Modals / overlays
    glass: "rgba(30,37,53,0.85)", // Glassmorphism background
    glassBorder: "rgba(255,255,255,0.08)",
  },

  // Status colors
  status: {
    free: "#10B981", // Emerald green - table free
    occupied: "#F97316", // Deep orange - table occupied
    billRequested: "#EF4444", // Red - bill requested
    cooking: "#3B82F6", // Blue - order cooking
    ready: "#10B981", // Green - order ready
    urgent: "#F59E0B", // Amber - 15min urgency
    critical: "#EF4444", // Red - 25min critical
  },

  // Accent palette
  accent: {
    emerald: "#10B981",
    emeraldGlow: "rgba(16,185,129,0.15)",
    orange: "#F97316",
    orangeGlow: "rgba(249,115,22,0.15)",
    amber: "#F59E0B",
    amberGlow: "rgba(245,158,11,0.2)",
    red: "#EF4444",
    redGlow: "rgba(239,68,68,0.2)",
    blue: "#3B82F6",
    blueGlow: "rgba(59,130,246,0.15)",
    purple: "#8B5CF6",
    purpleGlow: "rgba(139,92,246,0.15)",
  },

  // Text hierarchy
  text: {
    primary: "#F1F5F9", // Main text
    secondary: "#94A3B8", // Secondary / labels
    muted: "#64748B", // Disabled / placeholder
    inverse: "#0F1117", // On bright background
  },

  // Subscription status
  sub: {
    active: "#10B981",
    trial: "#F59E0B",
    expired: "#EF4444",
    stripe: "#635BFF",
    binance: "#F0B90B",
    pagoMovil: "#1DB954",
  },
};

export const GourmetRadii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const GourmetShadows = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 12,
  }),
};
