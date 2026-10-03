# Full-Stack Dropshipping E-Commerce Platform — Implementation Guide & Prompt Spec

> **Purpose:** This document is designed for **Vibe Coding** (AI-assisted rapid prototyping using tools like Cursor, v0, Bolt.new, or GitHub Copilot) and deployment on **Vercel**. It contains complete architectural choices, database schema, API specifications, and step-by-step instructions to build both the **Admin Dashboard** and **Public Storefront**.

---

## 🛠️ Recommended Tech Stack

| Layer | Technology Choice | Rationale for Vercel & Fast Development |
| :--- | :--- | :--- |
| **Framework** | **Next.js 14+ (App Router)** | Full-stack capability (Server Components, API Routes, Server Actions) hosted natively on Vercel. |
| **Monorepo / Folder Structure** | Next.js Single Project (Route Groups) | Keep both Admin (`/admin`) and Public Storefront (`/(shop)`) in one repository for easy state/DB sharing. |
| **Language** | **TypeScript** | Strict typing across API endpoints, database models, and UI components. |
| **Database & ORM** | **Supabase (PostgreSQL) + Prisma / Drizzle** | Instant serverless DB, native Auth, real-time listeners for admin alerts, and seamless integration with Vercel. |
| **UI & Styling** | **Tailwind CSS + Shadcn UI** | Pre-built, accessible, lightweight components optimized for speed and modern aesthetics. |
| **Authentication** | **NextAuth.js (Auth.js) or Supabase Auth** | Unified auth supporting Role-Based Access Control (RBAC: `ADMIN` vs `CUSTOMER`). |
| **Email Service** | **Resend + React Email** | Fast transactional emails for order notifications sent directly from Vercel Server Actions. |
| **State Management** | **Zustand** | Lightweight state for local Shopping Cart persistence (`localStorage`). |

---

## 📂 Project Structure

```text
dropship-store/
├── app/
│   ├── (admin)/
│   │   ├── admin/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── products/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── categories/
│   │   │   │   └── page.tsx
│   │   │   ├── orders/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   ├── (shop)/
│   │   ├── page.tsx               # Product Catalog (Grid/List View)
│   │   ├── product/[id]/page.tsx  # Product Detail Page
│   │   ├── cart/page.tsx          # Shopping Cart
│   │   ├── checkout/page.tsx      # Checkout & Payment Flow
│   │   ├── orders/page.tsx        # Customer Order History & Tracking
│   │   ├── login/page.tsx         # Customer Login / Register
│   │   └── layout.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── webhook/payment/route.ts
│   │   └── ...
├── components/
│   ├── admin/
│   │   ├── AdminHeader.tsx
│   │   ├── OrderAlertBanner.tsx
│   │   └── ProductForm.tsx
│   ├── shop/
│   │   ├── ProductGrid.tsx
│   │   ├── ProductList.tsx
│   │   ├── CartDrawer.tsx
│   │   └── OrderStatusBadge.tsx
│   └── ui/                       # Shadcn components
├── lib/
│   ├── db.ts                     # Database connection
│   ├── email.ts                  # Resend helper
│   ├── store.ts                  # Zustand Cart Store
│   └── utils.ts
├── prisma/
│   └── schema.prisma             # Database Schema
├── .env.example
├── next.config.mjs
└── package.json
```

---

## 🗄️ Database Schema (`prisma/schema.prisma`)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  ADMIN
  CUSTOMER
}

enum OrderStatus {
  READY_TO_SHIP
  FOR_SHIPPING
  TO_BE_DELIVERED
  RECEIVED
}

enum PaymentMethod {
  E_WALLET
  BANK_TRANSFER
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String
  name          String?
  role          Role      @default(CUSTOMER)
  phone         String?
  address       String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  orders        Order[]
}

model Category {
  id          String    @id @default(cuid())
  name        String    @unique
  slug        String    @unique
  description String?
  products    Product[]
  createdAt   DateTime  @default(now())
}

model Product {
  id            String      @id @default(cuid())
  name          String
  slug          String      @unique
  details       String
  originalPrice Float
  discountPrice Float
  categoryId    String
  category      Category    @relation(fields: [categoryId], references: [id])
  imageUrl      String?
  stock         Int         @default(100)
  orderItems    OrderItem[]
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}

model Order {
  id             String        @id @default(cuid())
  orderKey       String        @unique // e.g. ORD-2026-8942
  userId         String
  user           User          @relation(fields: [userId], references: [id])
  shippingName   String
  shippingPhone  String
  shippingAddress String
  paymentMethod  PaymentMethod
  paymentStatus  String        @default("PAID")
  status         OrderStatus   @default(READY_TO_SHIP)
  totalQuantity  Int
  totalAmount    Float
  items          OrderItem[]
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt
}

model OrderItem {
  id        String   @id @default(cuid())
  orderId   String
  order     Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId String
  product   Product  @relation(fields: [productId], references: [id])
  quantity  Int
  price     Float
}
```

---

## 💻 Detailed Website Specifications

### 1. Admin Website (`/admin`)

#### **Security & Access**
* Dedicated login route (`/admin/login`).
* Middleware protection enforcing `Role === 'ADMIN'` for all `/admin/*` sub-routes. Redirect unauthorized users to login.

#### **Core Features**
1. **Category Management (`/admin/categories`):**
   * Create, update, and delete product categories.
   * Fields: Name, Slug, Description.

2. **Product Catalog CRUD (`/admin/products`):**
   * **Create / Edit Product Form:**
     * Name, Slug, Description/Details.
     * Original Price (strikethrough on shop) & Discounted Price (active sale price).
     * Category dropdown selector.
     * Image URL input / Upload widget.
   * **Product List View:** Table with search, category filtering, price display, and Quick Actions (Edit / Delete).

3. **Real-Time Notification & Alert System:**
   * **In-App Header Alert:** Real-time visual indicator (badge count + audio/toast notification) when a new order is placed (utilizing Supabase Realtime or WebSockets).
   * **Email Notification:** Triggered via **Resend API** upon checkout completion.
     * *Email Content:* Order Key, Buyer Name, Email, Contact Number, Delivery Address, Selected Payment Method, Purchased Items, and Total Amount.

4. **Order Management (`/admin/orders`):**
   * Table displaying all platform orders.
   * Dropdown to update order status: `READY_TO_SHIP` ➔ `FOR_SHIPPING` ➔ `TO_BE_DELIVERED` ➔ `RECEIVED`.

---

### 2. Public Buyer Website (`/(shop)`)

#### **Product Listing Page (Homepage `/`)**
* **Toggle View Component:** Switch instantly between **Grid View** (cards) and **List View** (compact rows).
* **Product Card Components:**
  * Product Image, Title, Category Badge.
  * Price Layout: Strikethrough for Original Price (e.g. ~~$$100.00~~) alongside highlighted Discounted Price ($75.00).
  * **Quantity Selector:** Interactive increment (`+`) and decrement (`-`) buttons.
  * **Add to Cart Button:** Adds selected quantity to Zustand global cart state.

#### **Cart & Authentication Flow**
* Persistent Cart drawer / page using Zustand (`localStorage`).
* **Guest Cart Access:** Unauthenticated users can view products, change quantities, and build their cart freely.
* **Auth Guard on Checkout:** Clicking **"Proceed to Checkout"** checks user auth state:
  * If logged out ➔ Redirects to `/login?redirect=/checkout`.
  * If logged in ➔ Directs straight to `/checkout`.

#### **Checkout Page (`/checkout`)**
1. **Shipping Details Form:** Name, Phone Number, Detailed Address.
2. **Strict No-Refund / Cancellation Policy Warning Modal:**
   * **Mandatory Callout Box:** *"All sales are final. Due to direct dropship supplier processing, orders cannot be cancelled or refunded once confirmed (unless delivery fails). Please verify your item and payment details carefully."*
   * User must tick a required checkbox: `[x] I understand and accept the no-cancellation policy.`
3. **Payment Method Selection:**
   * Choice between **E-Wallet** (e.g. GCash, Maya, PayPal) and **Bank Transfer**.
4. **Mock Payment Environment Modal / Page:**
   * Displays payment instructions or simulates processing gateway.
   * Action: "Complete Payment".
5. **Success Confirmation:**
   * Generates a unique `orderKey` (e.g., `ORD-2026-XXXX`).
   * Saves transaction to PostgreSQL.
   * Triggers transactional emails to admin and customer.
   * Clears active cart and redirects to Order Tracking page.

#### **Order Tracking Tab (`/orders`)**
A responsive table/card list for logged-in users displaying their history with columns:
* **Order Key:** Unique identifier.
* **Payment Method Used:** E-Wallet or Bank Transfer.
* **Order Items:** List of product names, unit prices, and quantities.
* **Total Quantity:** Sum of all item quantities.
* **Status Badge:** Visual status tracker (`READY TO SHIP`, `FOR SHIPPING`, `TO BE DELIVERED`, `RECEIVED`).
* **Total Amount:** Grand total paid.

---

## 🤖 Vibe Coding Prompts (Copy & Paste to AI Editors)

### **Prompt 1: Database Setup & Prisma Schema**
```text
Act as a Principal Full-Stack Engineer. I am building a Next.js 14 App Router dropshipping platform hosted on Vercel with Supabase PostgreSQL. 

Please generate a complete `prisma/schema.prisma` file incorporating:
1. Enums: Role (ADMIN, CUSTOMER), OrderStatus (READY_TO_SHIP, FOR_SHIPPING, TO_BE_DELIVERED, RECEIVED), PaymentMethod (E_WALLET, BANK_TRANSFER).
2. Models: User, Category, Product, Order, OrderItem.
3. Ensure Product includes `originalPrice` and `discountPrice`.
4. Ensure Order includes `orderKey`, `totalQuantity`, `totalAmount`, payment details, and shipping information.

Provide clean, valid Prisma schema syntax along with the command to push this schema to Supabase.
```

---

### **Prompt 2: Admin Product & Category CRUD**
```text
Using Next.js 14 App Router, Server Actions, Tailwind CSS, and Shadcn UI, generate the complete Admin Product CRUD module under `app/(admin)/admin/products`:

1. `page.tsx`: Displays a searchable table of products with columns for Image, Name, Category, Original Price, Discounted Price, Stock, and Actions (Edit/Delete).
2. `[id]/page.tsx`: Form for creating or editing a product. Include validation using Zod.
3. Include a separate server action file `actions/product.ts` for handling database operations via Prisma.
4. Add a Category Management page (`app/(admin)/admin/categories/page.tsx`) that allows inline creation and deletion of categories.
```

---

### **Prompt 3: Customer Catalog (Grid & List View) + Cart Store**
```text
Create the main public shopping storefront for `app/(shop)/page.tsx` using Next.js 14 and Tailwind CSS:

1. Build a toggle button component to switch between "Grid View" and "List View".
2. Display product cards with:
   - Image placeholder or actual image.
   - Title and category.
   - Price display showing `originalPrice` crossed out next to `discountPrice`.
   - Quantity counter selector (+ / -).
   - "Add to Cart" button.
3. Create a Zustand cart store (`lib/store.ts`) that persists cart state to localStorage, handling adding items, updating quantities, and clearing cart.
```

---

### **Prompt 4: Checkout, Policy Confirmation & Order Email Alert**
```text
Build the checkout flow for `app/(shop)/checkout/page.tsx`:

1. Form for shipping details (Name, Phone, Address).
2. Payment method selector (E-Wallet vs Bank Transfer).
3. Callout Box with a required checkbox: "I understand that there are NO refunds or cancellations once processed unless delivery fails."
4. Simulate direct payment processing. On submission:
   - Save order to Prisma with status `READY_TO_SHIP` and generate a unique `orderKey`.
   - Send an email notification to the Admin using Resend (`lib/email.ts`) containing buyer name, shipping address, order items, payment method, and total amount.
   - Clear Zustand cart and redirect to `/orders`.
```

---

### **Prompt 5: Customer Order Tracking & Admin Real-time Alerts**
```text
Build two features:

1. Customer Order Tracking (`app/(shop)/orders/page.tsx`):
   - Table/Card list fetching all orders for the logged-in user.
   - Show: Order Key, Payment Method, Items, Total Quantity, Total Amount, and visual Status Badge (`READY_TO_SHIP`, `FOR_SHIPPING`, `TO_BE_DELIVERED`, `RECEIVED`).

2. Admin Dashboard Live Alerts (`components/admin/OrderAlertBanner.tsx`):
   - Use Supabase Realtime / WebSocket listener on the `Order` table to display an instant floating notification on the Admin dashboard whenever a new order is inserted.
```

---

## 🚀 Step-by-Step Vercel Deployment Guide

1. **Repository Setup:**
   * Push code to GitHub/GitLab.
2. **Database Provisioning:**
   * Create a project on [Supabase](https://supabase.com/).
   * Copy the PostgreSQL Connection String (`DATABASE_URL` and `DIRECT_URL`).
3. **Deploy on Vercel:**
   * Import the repository in [Vercel](https://vercel.com).
   * Configure Environment Variables:
     ```env
     DATABASE_URL="postgres://..."
     DIRECT_URL="postgres://..."
     NEXTAUTH_SECRET="your-random-secret-key"
     NEXTAUTH_URL="https://your-domain.vercel.app"
     RESEND_API_KEY="re_123456789"
     ADMIN_EMAIL="admin@yourdomain.com"
     NEXT_PUBLIC_SUPABASE_URL="https://your-app.supabase.co"
     NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
     ```
4. **Run Migrations on Production:**
   * Set up Vercel build command: `npx prisma generate && npx prisma db push && next build`.
5. **Launch:**
   * Click **Deploy**. Vercel will build and host both the Admin and Public storefronts instantly!
