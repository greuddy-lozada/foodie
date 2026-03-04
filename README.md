# 🍽️ GourmetFlow — Restaurant Management SaaS

GourmetFlow is a high-performance, modern, and intuitive **Restaurant Management SaaS** designed for efficiency, speed, and a premium user experience. Built on a robust multitenant architecture, it provides a seamless workflow from front-of-house orders to back-of-house kitchen operations.

---

## 🎯 Project Goals

The primary objective is to build a unified platform that solves the core operational challenges of modern restaurants:

- **Tenant Isolation**: Secure, dedicated workspaces for every restaurant slug (e.g., `my-bistro.gourmetflow.app`).
- **Real-Time Efficiency**: Instant communication between POS (Point of Sale) and KDS (Kitchen Display System).
- **Proactive Management**: Low-stock alerts and integrated inventory tracking to prevent operational gaps.
- **Premium Aesthetics**: A "Restaurant Dark" design language using Glassmorphism to reduce eye strain in busy kitchen environments.

---

## 🏗️ Architecture: The "Modular Wrap"

To maintain a high level of reusability, this project uses a **Modular Wrap Architecture** in the backend.

- **Auth Core (`/backend/src/core`)**: A platform-agnostic, reusable authentication and multitenant system. It handles user roles, JWT tokens, Stripe/Binance subscriptions, and tenant isolation.
- **Foodie Modules (`/backend/src/modules/foodie`)**: A project-specific extension layer where the GourmetFlow logic (POS, KDS, Inventory) lives. This keeps the core auth system "isolated" and reusable for future non-food projects.

---

## 🛠️ Technology Stack

### **Frontend (Expo/React Native)**

- **Framework**: Expo SDK 54+ (React Native) with Expo Router for file-based navigation.
- **Styling**: Tamagui (Modern UI toolkit) for a performance-first design system.
- **Design Language**: Glassmorphism with Neo-Skeuomorphic touches (Rounded corners, directional shadows, emerald/orange/amber status colors).
- **Platforms**: Mobile-first for tablets/phones, fully responsive for Web.

### **Backend (NestJS)**

- **Framework**: NestJS (Node.js) with Fastify adapter for maximum throughput.
- **Database**: MongoDB (Mongoose) for flexible, document-based storage.
- **Cache/Pub-Sub**: Redis for real-time order notifications.
- **Authentication**: JWT-based with support for Super Admins and Tenant Admins.

---

## 📱 Modules Overview

### **1. SaaS Auth & Onboarding**

- **Tenant Discovery**: Find your workspace by slug.
- **Subscription Health**: High-visibility status widgets for Stripe, Binance Pay, and Pago Móvil.

### **2. Point of Sale (POS)**

- **Interactive Table Map**: Real-time status indicators (Free, Occupied, Bill Requested).
- **Adaptive Menu Browser**: Category-filtered menu with "Out of Stock" intelligence.
- **Order Cart**: Split-view side panel on tablets, bottom sheets on mobile.

### **3. Kitchen Display System (KDS)**

- **Priority Logic**: Orders are sorted by time elapsed.
- **Urgency Glow**: Visual pulses (Amber >15m, Red >25m) to highlight late orders.
- **Micro-interactions**: One-tap "Start Cooking", long-press "Mark Ready".

### **4. Inventory Management**

- **Visual Stock Levels**: Progress bars colored by stock ratio.
- **Alert System**: Immediate visual "Low Stock" and "Out of Stock" notifications.
- **Quick Adjust**: Integrated bottom sheets for rapid stock corrections.

---

## 🚀 Getting Started

### **Running with Docker**

Ensure Docker Desktop is running, then use the following command from the root:

```bash
docker compose up -d --build
```

- **Backend API**: `http://localhost:5000`
- **Frontend App**: `http://localhost:3000`
- **MongoDB Browser**: `http://localhost:8081`

### **Running Individually**

- **Backend**: `cd backend && pnpm dev`
- **Frontend**: `cd frontend && pnpm web`

---

## 📄 License

This project belongs to the **Foodie Platform** by David Lozada.
