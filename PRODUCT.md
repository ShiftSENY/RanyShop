# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary Buyers:** Consumers seeking curated, high-quality wellness and skincare essentials online through a clean, reliable, and frictionless shopping experience.
- **Store Operators (Admin):** Store administrators managing product catalog entries, categories, dual pricing (original vs. discount), and customer order fulfillment lifecycles.

## Product Purpose

LanderShop is a specialized direct-to-consumer e-commerce platform dedicated to wellness and skincare products. It offers buyers an elevated, straightforward catalog discovery experience, persistent shopping carts, and transparent order tracking, while providing store operators with an efficient management dashboard to manage products, categories, and real-time order status updates.

## Positioning

A curated single-niche wellness and skincare boutique focused on streamlined convenience and direct pricing.

- **Customer-Facing Boundary:** All dropshipping mechanisms and third-party supplier logistics are strictly omitted from buyer-facing touchpoints. The storefront presents as a direct, refined brand.
- **Policy Framing:** The strict no-refund and final-sale policy is framed around immediate order processing and direct fulfillment, clearly communicated prior to payment.

## Operating Context

- **Customer Journey:** Web-based browsing across desktop and mobile devices; instant switching between exploratory Grid view and compact List view; persistent cart drawer via local storage (`localStorage`); authenticated checkout ensuring shipping accuracy; simulated direct payment (E-Wallet and Bank Transfer); dedicated order tracking page.
- **Administrator Workflow:** Protected administrative route (`/admin`) requiring `ADMIN` role; overview metrics; category and product catalog CRUD; real-time order notifications; sequential status advancement (`READY_TO_SHIP` → `FOR_SHIPPING` → `TO_BE_DELIVERED` → `RECEIVED`).

## Capabilities and Constraints

- **Storefront Capabilities:** Grid/List view catalog toggle, quantity selector (+ / -), persistent client-side cart drawer, account-guarded checkout, mandatory no-cancellation acceptance checkbox, payment method selection, and real-time status badge tracking.
- **Admin Capabilities:** Role-based access control, product creation/editing with dual price points (original strikethrough vs. sale price), category taxonomy management, order overview and status updates.
- **Confirmed Technical Constraints:**
  - Public storefront must omit dropshipping/supplier references.
  - Mandatory final-sale policy callout box with required checkbox before checkout completion.
  - Stack: Next.js (App Router), TypeScript, Tailwind CSS, PostgreSQL via Prisma ORM, Zustand.

## Brand Commitments

- **Name:** LanderShop
- **Brand Posture:** Clean, trustworthy, modern wellness boutique. Calming, straightforward, and professional.
- **Voice:** Direct, honest, and helpful. Clear product specs, transparent tracking milestones, and zero dropshipping jargon.

## Evidence on Hand

- Implementation guide and prompt specification in [dropshipping_ecom_vibe_coding_guide.md](file:///C:/Users/Sen23/Desktop/LanderShop/dropshipping_ecom_vibe_coding_guide.md).
- Full application codebase in [dropship-store](file:///C:/Users/Sen23/Desktop/LanderShop/dropship-store) featuring Prisma schema, seed script with default credentials, NextAuth RBAC, and Zustand store.
- *Absence note:* No verified customer testimonials or reviews currently exist in the database; future copywriting must not fabricate fictitious user reviews or fake endorsements.

## Product Principles

1. **Boutique Focus Over Marketplace Clutter:** Prioritize clean, intentional presentation of wellness and skincare essentials over overwhelming multi-category noise.
2. **Invisible Logistics, Visible Progress:** Fully abstract third-party backend logistics from buyers while maintaining crystal-clear transparency around order status milestones.
3. **Frictionless Shopping Flow:** Ensure the journey from discovery to cart and final checkout is rapid, responsive, and persistent.
4. **Respectful Policy Clarity:** State the final-sale terms plainly and respectfully before order placement without evasive fine print.
