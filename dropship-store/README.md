# LanderShop - Dropshipping E-Commerce Platform

A full-stack dropshipping e-commerce platform with a separate **Admin Dashboard** and **Public Storefront**, built with Next.js 14+, TypeScript, Prisma, and Tailwind CSS.

## Features

### Public Storefront (`/`)
- Product catalog with **Grid** and **List** view toggle
- Product cards with quantity selector
- Strike-through original price with highlighted discount price
- Persistent shopping cart via Zustand + localStorage
- Checkout with shipping details, no-refund policy confirmation, and payment method selection
- Order tracking with status badges

### Admin Dashboard (`/admin`)
- Role-based access control (ADMIN only)
- Product CRUD management
- Category management
- Order management with status updates
- Dashboard with stats and recent orders

## Tech Stack

- **Framework**: Next.js (App Router) + TypeScript
- **Database**: Prisma ORM with PostgreSQL
- **Auth**: NextAuth.js (Credentials + JWT session)
- **State**: Zustand with persist middleware
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
Copy `.env.example` to `.env` and update with your database credentials:
```
DATABASE_URL="postgresql://user:password@localhost:5432/dropship_store?schema=public"
DIRECT_URL="postgresql://user:password@localhost:5432/dropship_store?schema=public"
AUTH_SECRET="your-random-secret-key"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAIL="admin@yourdomain.com"
```

### 3. Set up the database
```bash
npx prisma generate
npx prisma db push
```

### 4. Seed initial data
```bash
npm run db:seed
```

### 5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the storefront and [http://localhost:3000/admin](http://localhost:3000/admin) for the admin dashboard.

## Default Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@landershop.com | admin123 |
| Customer | customer@example.com | customer123 |

## Project Structure

```
dropship-store/
├── app/
│   ├── (admin)/admin/       # Admin Dashboard
│   │   ├── login/           # Admin login
│   │   ├── dashboard/       # Stats overview
│   │   ├── products/        # Product CRUD
│   │   ├── categories/      # Category management
│   │   └── orders/          # Order management
│   ├── (shop)/              # Public Storefront
│   │   ├── page.tsx         # Product catalog
│   │   ├── product/[id]/    # Product details
│   │   ├── cart/            # Shopping cart
│   │   ├── checkout/        # Checkout flow
│   │   ├── orders/          # Order tracking
│   │   └── login/           # Customer auth
│   └── api/                 # REST API endpoints
├── components/
│   ├── admin/               # Admin components
│   ├── shop/                # Storefront components
│   └── ui/                  # Reusable UI
├── lib/
│   ├── db.ts                # Prisma client
│   ├── auth.ts              # NextAuth config
│   ├── store.ts             # Zustand cart store
│   └── utils.ts             # Helpers
├── prisma/
│   └── schema.prisma        # Database schema
└── middleware.ts            # Route protection
```

## Deploy to Vercel

1. Push code to GitHub
2. Import in Vercel
3. Configure environment variables (see `.env.example`)
4. Deploy
