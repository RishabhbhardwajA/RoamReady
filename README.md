# RoamReady — Engineered Travel Gear & Luggage Accessories Platform

> **Engineered for the Modern Journey.**  
> A production-oriented e-commerce platform specialising in airport security-compliant luggage accessories, TSA combination locks, modular compression cubes, heavy-duty baggage belts, and packable travel duffels.

---

## 🛫 Table of Contents
1. [Executive Overview & Brand Identity](#-executive-overview--brand-identity)
2. [Market & Competitor Positioning](#-market--competitor-positioning)
3. [Technology Architecture](#-technology-architecture)
4. [Folder Structure](#-folder-structure)
5. [Quick Start & Setup Instructions](#-quick-start--setup-instructions)
6. [Demo & Test Credentials](#-demo--test-credentials)
7. [REST API Documentation](#-rest-api-documentation)
8. [Automated Test Suite](#-automated-test-suite)
9. [Deployment Guide](#-deployment-guide)

---

## 🎯 Executive Overview & Brand Identity

* **Brand Name:** **RoamReady**
* **Tagline:** *Engineered for the Modern Journey.*
* **Brand Colors:**
  * **Obsidian Navy (`#0F172A` / `#090D16`):** Prestige, durability, stability.
  * **Aero Cobalt (`#2563EB` / `#0E87EB`):** High-tech, precision, movement.
  * **Sunrise Amber (`#F59E0B` / `#D97706`):** High-visibility luggage accent, alerts, optimism.
  * **Canvas White & Slate (`#FFFFFF` / `#F8FAFC`):** Crisp, airport-grade clarity.
* **Core Product Categories:**
  1. **TSA-Approved Luggage Combination Locks** (High-tensile zinc alloy, 4-dial & flexible cable).
  2. **Privacy Luggage Tags** (Anodized aluminum with covert dual-sided contact sleeve).
  3. **Compression Packing Cubes** (Double-zipper 60% space-savers, 300D ripstop nylon, SBS sliders).
  4. **Heavy-Duty Baggage Straps** (X-cross configuration, impact POM buckle, TSA combo lock).
  5. **Foldable Nylon Duffel Bags** (40L ultralight packable, water-resistant, luggage trolley sleeve).
  6. **Ready-to-Fly Travel Kits & Bundles** (International Explorer, Weekend Escape).

---

## 🔍 Market & Competitor Positioning

Based on deep research of existing industry players (**Mokobara, Samsonite, Safari, Decathlon, and Bagpoint**):

* **The Problem:** Travelers are forced to choose between overpriced lifestyle brands that treat accessories as secondary afterthoughts, utilitarian sports gear that looks out of place in airport business lounges, or flimsy white-label marketplace items whose zippers snap under transit compression.
* **The RoamReady Solution:** Laboratory-tested hardware (heavy-gauge SBS dual zippers, TSA-certified zinc alloys, anodized aluminum privacy tags) paired with pre-curated travel kit bundles and interactive airport-readiness tools.

*(See full report in `competitor_research_report.md` for in-depth SWOT, pricing matrices, and UX teardowns).*

---

## ⚙️ Technology Architecture

* **Frontend:**
  * **Next.js 14** (React 18, App Router, TypeScript)
  * **Tailwind CSS** (Custom theme system with responsive mobile-first layouts)
  * **Lucide React** (Clean semantic iconography)
  * **Axios** (Configured API client with automatic session persistence)
  * **Canvas Confetti** (Order celebration animations)
* **Backend:**
  * **Node.js & Express.js** (Strict MVC modular architecture)
  * **Mongoose & MongoDB** (With built-in resilient dual-engine for seamless offline/in-memory evaluation)
  * **JWT (JSON Web Tokens) & bcryptjs** (Secure authentication & password hashing)
  * **Zod** (Schema validation for requests)
  * **Helmet, Morgan, Compression, Express Rate Limit** (Security & performance)
* **Separation of Concerns:**
  * Kept strictly separated: `frontend/` (Next.js client) and `backend/` (Express REST API) operating as standalone decoupled services.

---

## 📂 Folder Structure

```text
new intern/
├── backend/
│   ├── src/
│   │   ├── config/             # Environment & Database connections
│   │   ├── controllers/        # Auth, Product, Cart, Order, Admin controllers
│   │   ├── middleware/         # JWT Protect, Admin Role, Error Handler
│   │   ├── models/             # Mongoose schemas: User, Product, Category, Order, Cart, Review, Coupon
│   │   ├── routes/             # REST endpoints (/api/auth, /api/products, etc.)
│   │   ├── services/           # Dual-engine repository & realistic seed dataset
│   │   ├── utils/              # ApiResponse standards & JWT token helpers
│   │   └── validators/         # Zod request validators
│   ├── tests/                  # Automated API test suite
│   ├── server.js               # Express server entry point
│   ├── .env.example            # Backend environment template
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/                # Next.js App Router pages
│   │   │   ├── page.tsx        # Homepage (Hero, Categories, Bestsellers, Kits, Reviews)
│   │   │   ├── products/       # Catalog & Product Detail ([slug])
│   │   │   ├── kits/           # Ready-to-Fly Bundles
│   │   │   ├── compare/        # Specification Comparison Tool
│   │   │   ├── finder/         # Smart Travel Pack Finder Quiz
│   │   │   ├── cart/           # Shopping Bag experience
│   │   │   ├── checkout/       # Multi-step checkout with UPI/Card/COD
│   │   │   ├── account/        # User Profile, Saved Addresses, Orders & Tracking
│   │   │   ├── admin/          # Admin Command Center
│   │   │   └── auth/           # Login & Registration
│   │   ├── components/         # Reusable UI components (Navbar, Footer, CartDrawer, etc.)
│   │   ├── context/            # Auth, Cart, Wishlist, Compare contexts
│   │   ├── lib/                # API client & currency formatters
│   │   └── types/              # Comprehensive TypeScript interfaces
│   ├── tailwind.config.ts
│   ├── next.config.js
│   └── package.json
└── package.json                # Root orchestration scripts
```

---

## 🚀 Quick Start & Setup Instructions

### 1. Prerequisites
* **Node.js**: v18.0.0 or higher (v22 tested)
* **npm**: v9.0.0 or higher
* **MongoDB**: Optional (Connects to MongoDB Atlas / Local MongoDB URI; automatically switches to high-speed resilient in-memory engine if MongoDB is offline).

### 2. Install Dependencies
```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

### 3. Run Development Servers
Open two terminal windows or use the root commands:

```bash
# Terminal 1: Run Express Backend (Port 5000)
cd backend
npm run dev

# Terminal 2: Run Next.js Frontend (Port 3000)
cd frontend
npm run dev
```

Visit **`http://localhost:3000`** in your browser.

---

## 🔑 Demo & Test Credentials

Pre-configured credentials for quick evaluation:

| Account Type | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Store Customer** | `traveler@roamready.com` | `TravelGear2026!` | Checkout, order history, live BlueDart tracking, wishlist |
| **Store Administrator** | `admin@roamready.com` | `TravelGear2026!` | Full admin dashboard, revenue KPIs, product CRUD, inventory, order status updates, coupon generation |

*(Note: The login page at `/auth/login` includes **1-Click Fast Evaluation Buttons** to log in instantly without typing).*

### Promo Coupons for Checkout
* `WELCOME10`: 10% discount on orders above ₹499
* `ROAMFREEDOM`: Flat ₹200 off on orders above ₹1499
* `FLYREADY`: 15% off on travel kits above ₹1999

---

## 📡 REST API Documentation

Base URL: `http://localhost:5000/api`

### Products & Categories
* `GET /api/categories`: Fetch all travel accessory categories
* `GET /api/products`: Filter products (`?category=tsa-locks&sort=price-low&search=pack`)
* `GET /api/products/:slug`: Get detailed specs, image gallery, variants, and reviews
* `GET /api/products/kits`: Get pre-curated travel kits
* `POST /api/products/compare`: Compare up to 4 items side-by-side
* `POST /api/products/finder`: Smart 3-question travel quiz recommendation
* `GET /api/products/check-pincode/:pincode`: Indian PIN code delivery timeline & hub checker

### Cart & Coupons
* `GET /api/cart`: Retrieve session cart
* `POST /api/cart/items`: Add variant with stock checks
* `PUT /api/cart/items`: Update line item quantity
* `DELETE /api/cart/items/:variantId`: Remove line item
* `POST /api/cart/coupon`: Apply discount voucher
* `DELETE /api/cart/coupon`: Remove coupon

### Orders & Logistics
* `POST /api/orders`: Place order (Supports UPI, Card, Net Banking, and COD with demo verification)
* `GET /api/orders/my-orders`: Retrieve authenticated user order history
* `POST /api/orders/track`: Public airway bill tracking by order number

### Admin Suite (Requires Admin JWT)
* `GET /api/admin/metrics`: Real-time revenue, order status counts, low-stock alerts
* `GET /api/admin/products`: Full SKU catalog
* `POST /api/admin/products`: Create new product
* `PUT /api/admin/products/:id`: Update price, inventory, or badges
* `DELETE /api/admin/products/:id`: Delete product
* `PUT /api/admin/orders/:id/status`: Update dispatch status (`confirmed` -> `shipped` -> `delivered`)
* `POST /api/admin/coupons`: Generate new discount vouchers

---

## 🧪 Automated Test Suite

Run the comprehensive test suite verifying 32 critical API flows:

```bash
node backend/tests/api.test.js
```

**Results:**
```text
======================================================
📊 Test Results: 32 Passed, 0 Failed
======================================================
```

---

## 🌐 Live Deployment Guide

The entire codebase is version-controlled and pushed to GitHub:  
👉 **[GitHub Repository: RishabhbhardwajA/RoamReady](https://github.com/RishabhbhardwajA/RoamReady)**

### Step 1: Deploy the Backend API (Render / Railway)

#### Option A: 1-Click Free Deploy on Render
1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** > **Blueprint**.
2. Connect your GitHub repository: `RishabhbhardwajA/RoamReady`.
3. Render will automatically detect [`backend/render.yaml`](backend/render.yaml) and configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
4. Click **Apply**. Once built (approx. 1 min), your REST API will be live at:
   `https://roamready-api.onrender.com/api`

*(Note: The backend has a resilient dual-engine that operates flawlessly with or without MongoDB Atlas connection string).*

---

### Step 2: Deploy the Frontend (Vercel)

1. Go to [Vercel Dashboard](https://vercel.com/new).
2. Click **Import** next to `RishabhbhardwajA/RoamReady`.
3. In Project Configuration:
   - **Framework Preset:** `Next.js`
   - **Root Directory:** Click Edit and select `frontend`
4. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_API_URL` = `https://roamready-api.onrender.com` (your backend URL, or leave blank to fallback to demo mode)
5. Click **Deploy**. Vercel will build and assign a free HTTPS URL (e.g. `https://roamready.vercel.app`).

---

### Step 3: Production Verification

- Storefront: `https://roamready.vercel.app`
- API Health Check: `https://roamready-api.onrender.com/api/health`
- Admin Dashboard: `https://roamready.vercel.app/admin` (Sign in with demo admin credentials)

