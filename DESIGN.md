---
name: LanderShop
description: A serene, wellness-first e-commerce design system grounded in tactile clarity and botanical purity
colors:
  primary: "#2563eb"
  primary-hover: "#1d4ed8"
  primary-subtle: "#eff6ff"
  accent-success: "#16a34a"
  accent-success-subtle: "#dcfce7"
  accent-warning: "#ca8a04"
  accent-warning-subtle: "#fef9c3"
  accent-status-purple: "#9333ea"
  accent-status-purple-subtle: "#f3e8ff"
  accent-danger: "#dc2626"
  neutral-bg: "#ffffff"
  neutral-surface: "#f9fafb"
  neutral-subtle: "#f3f4f6"
  neutral-border: "#e5e7eb"
  neutral-muted: "#6b7280"
  neutral-dark: "#374151"
  neutral-heading: "#111827"
typography:
  display:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: "2.25rem"
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: "2rem"
    letterSpacing: "-0.015em"
  title:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: "1.5rem"
    letterSpacing: "normal"
  body:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: "1.25rem"
    letterSpacing: "normal"
  label:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: "1rem"
    letterSpacing: "0.025em"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-bg}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-secondary:
    backgroundColor: "{colors.neutral-border}"
    textColor: "{colors.neutral-heading}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.neutral-dark}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-danger:
    backgroundColor: "{colors.accent-danger}"
    textColor: "{colors.neutral-bg}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
---

# Design System: LanderShop

## Overview

**Creative North Star: "The Botanical Sanctuary"**

LanderShop's visual system evokes the grounded serenity of a boutique botanical apothecary combined with modern e-commerce precision. Every viewport breathes: generous whitespace, calm mineral accents, and clean structural boundaries allow wellness and skincare formulations to command full buyer focus. The interface conveys unhurried confidence and trustworthiness.

Interaction is tactile, deliberate, and crisp. Controls respond with clear, high-contrast state changes and definite borders rather than ephemeral fluff. By eliminating aggressive visual gimmicks—fake countdown timers, garish banners, and dropshipping clichés—the customer journey feels refined, direct, and restorative.

**Key Characteristics:**
- **Serene Mineral Palette:** Clean porcelain surfaces anchored by Mineral Cobalt for deliberate interactions and Herbal Emerald for savings and fulfillment.
- **Tactile & Deliberate Feedback:** Crisp boundaries, definite state changes, and disciplined focus outlines that assure buyer confidence.
- **Grounded Clarity:** Zero visual clutter, structured card containers, and balanced breathing room around product imagery and typography.

## Colors

The palette balances clean mineral serenity with high-clarity functional signals.

### Primary
- **Mineral Cobalt** (`#2563eb`): Used deliberately for primary conversion actions ("Add to Cart", "Complete Order"), active navigational links, and brand focal anchors.
- **Deep Cobalt** (`#1d4ed8`): Dedicated hover and active press state for primary interactive elements.
- **Cobalt Tint** (`#eff6ff`): Subtle tint background for product category pills and active selections.

### Secondary
- **Herbal Emerald** (`#16a34a`): Dedicated affirmative signal for discounted sale prices, cart total highlights, and final `RECEIVED` order delivery status.
- **Emerald Tint** (`#dcfce7`): Light soft badge background for completed orders and savings confirmation.

### Tertiary
- **Botanical Amber** (`#ca8a04`): Warning and pending status indicator for `READY_TO_SHIP` orders.
- **Amber Tint** (`#fef9c3`): Gentle background container for order preparation alerts.
- **Transit Violet** (`#9333ea`): Progress tracking signal for `TO_BE_DELIVERED` status updates.
- **Violet Tint** (`#f3e8ff`): Soft pill container for out-for-delivery packages.
- **Crimson Alert** (`#dc2626`): Uncompromising error states, stock depletion warnings, and destructive actions.

### Neutral
- **Pure Canvas** (`#ffffff`): Card surfaces, modal drawers, and main header container.
- **Soft Porcelain** (`#f9fafb`): Page canvas background, input surfaces, and subtle container separation.
- **Muted Stone** (`#f3f4f6`): Image placeholder backgrounds, hover row states, and secondary button backgrounds.
- **Dividing Line** (`#e5e7eb`): 1px structural container borders, horizontal rules, and table dividers.
- **Muted Slate** (`#6b7280`): Secondary body text, strikethrough original prices, metadata, and helper text.
- **Deep Slate** (`#374151`): Navigation labels, secondary icons, and ghost button text.
- **Midnight Ink** (`#111827`): High-contrast headlines, product titles, and primary emphasis text.

### Named Rules
**The One Signal Rule.** Mineral Cobalt is reserved exclusively for primary forward progression and active identity. Herbal Emerald is reserved strictly for monetary value and fulfillment completion. The two accents never compete for the same role on a single component.

## Typography

**Display Font:** System Grotesque (`system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`)  
**Body Font:** System Grotesque (`system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`)  
**Label Font:** System Grotesque (`system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`)

**Character:** Clean, modern, and disciplined. High legibility across device viewports with tight letter tracking on uppercase labels and clear tabular numerical hierarchy for currency.

### Hierarchy
- **Display** (700 weight, 30px / 1.875rem, line-height 36px / 2.25rem, letter-spacing -0.02em): Hero page headings and storefront section anchors.
- **Headline** (700 weight, 24px / 1.5rem, line-height 32px / 2rem, letter-spacing -0.015em): Modal headers, admin overview metrics, and major module titles.
- **Title** (600 weight, 16px / 1rem, line-height 24px / 1.5rem, normal tracking): Product names in grid/list views, drawer headers, and table column headers.
- **Body** (400 weight, 14px / 0.875rem, line-height 20px / 1.25rem, normal tracking): Product description blurbs, customer shipping details, and policy text (max line length 65–70ch).
- **Label** (500 weight, 12px / 0.75rem, line-height 16px / 1rem, letter-spacing 0.025em): Category tags, order status badges, table column labels, and cart item counts.

### Named Rules
**The Tabular Pricing Rule.** All currency values (PHP `₱`) must render with unambiguous tabular clarity. The active sale price must lead in bold Herbal Emerald (`#16a34a`) alongside a struck-through original price in Muted Slate (`#6b7280`) at a reduced visual weight.

## Layout

The layout uses an aligned 12-column responsive fluid grid maxing out at 1280px (`max-w-7xl` / 80rem) with standardized horizontal padding (16px on mobile, 24px on tablet, 32px on desktop).

- **Catalog Rhythm:** Responsive card grid adapts from 1 column on mobile (`<640px`), 2 columns on tablet (`sm`), 3 columns on desktop (`lg`), to 4 columns on wide monitors (`xl`) with consistent 24px (`gap-6`) gutters.
- **Spatial Rhythm:** 8px base grid. Structural module spacing follows 16px (`p-4`), 24px (`gap-6`), and 32px (`py-8`) intervals.
- **Storefront / Admin Dual Modality:** Public storefront emphasizes expansive browsing, tactile card drawers, and minimal vertical chrome; Admin dashboard adopts a dense, scannable data-table layout with pinned action headers.

## Elevation & Depth

Surfaces are grounded in tonal layering with ambient softness. Elements sit flat at rest, with depth signaled by crisp 1px borders (`#e5e7eb`) and soft background shifts rather than dark drop shadows.

### Shadow Vocabulary
- **Ambient Low** (`0 1px 2px 0 rgba(0, 0, 0, 0.05)`): Pinned navigation header resting elevation.
- **Ambient Soft** (`0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`): Default resting elevation for product cards and floating checkout summaries.
- **Ambient Lift** (`0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`): Applied dynamically on product card hover to invite tactile engagement.

### Named Rules
**The Grounded Rest Rule.** Surfaces rest flat with soft 1px border definition. Elevation is strictly interactive: shadows diffuse outward only on card hover, drawer opening, or modal activation.

## Shapes

The form language balances approachable human curves with structural discipline.

- **Primary Radius (8px / rounded-lg):** The standard corner radius for interactive buttons, product cards, input fields, quantity counter boxes, and image thumbnails.
- **Subtle Radius (4px / rounded):** Category badges, micro-tags, and small utility indicators.
- **Pill Geometry (9999px / rounded-full):** Exclusively reserved for status badges (`OrderStatusBadge`), notification counters, and icon trigger backgrounds.

### Named Rules
**The Radius Hierarchy Rule.** Rectangular containers and cards never use pill rounding; status pills and notification counts never use rectangular rounding. The geometry immediately distinguishes interactive containers from informational tags.

## Components

### Buttons
- **Shape:** Smooth medium rounded corners (8px radius).
- **Primary:** Mineral Cobalt background (`#2563eb`), white text (`#ffffff`), medium padding (`8px 16px` for md, `6px 12px` for sm), font-weight 500.
- **Hover / Focus:** Transitions to Deep Cobalt (`#1d4ed8`), with a distinct 2px focus ring with 2px offset (`focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`).
- **Secondary:** Neutral Border background (`#e5e7eb`), Midnight Ink text (`#111827`), transitions to Muted Stone on hover.
- **Ghost:** Transparent background, Deep Slate text (`#374151`), hover reveals Soft Stone (`#f3f4f6`).

### Cards / Containers
- **Corner Style:** 8px radius (`rounded-lg`), overflow hidden.
- **Background:** Pure Canvas (`#ffffff`).
- **Border:** 1px Dividing Line (`#e5e7eb`).
- **Resting Depth:** Ambient Soft (`shadow-md`), transitioning smoothly to Ambient Lift (`shadow-lg`) on hover.
- **Internal Padding:** 16px (`p-4`).

### Quantity Selector
- **Container:** Integrated 1px neutral border pill box with 8px radius.
- **Buttons:** Minus (`-`) and Plus (`+`) increments with minimum 32px touch targets, subtle background hover tint (`#f3f4f6`).
- **Indicator:** Central text counter in 14px bold Midnight Ink.

### Order Status Badges
- **Shape:** Pill badge (`rounded-full`), padding `2px 10px`, font-size 12px (`text-xs`), font-weight 500.
- **Variants:**
  - `READY_TO_SHIP`: Amber Tint background (`#fef9c3`) with Botanical Amber text (`#854d0e`).
  - `FOR_SHIPPING`: Cobalt Tint background (`#dbeafe`) with Deep Cobalt text (`#1e40af`).
  - `TO_BE_DELIVERED`: Violet Tint background (`#f3e8ff`) with Transit Violet text (`#6b21a8`).
  - `RECEIVED`: Emerald Tint background (`#dcfce7`) with Herbal Emerald text (`#166534`).

### Navigation
- **Top Header:** Pinned sticky header with Pure Canvas background, 1px bottom border (`#e5e7eb`), 64px height (`h-16`).
- **Brand Wordmark:** 24px bold Mineral Cobalt text (`#2563eb`).
- **Cart Button:** Ghost icon trigger with badge pill counter in Crimson Alert (`#dc2626`).

## Do's and Don'ts

### Do:
- **Do** format all pricing in Philippine Pesos (`₱`) with strike-through original prices paired with emphasized Herbal Emerald sale prices.
- **Do** maintain clean, generous spacing around product images and text to sustain the tranquil botanical sanctuary atmosphere.
- **Do** state order status progressions clearly (`READY_TO_SHIP` → `FOR_SHIPPING` → `TO_BE_DELIVERED` → `RECEIVED`) using assigned semantic badges.
- **Do** ensure all form inputs and interactive elements feature crisp focus rings (`focus:ring-2 focus:ring-blue-500 focus:outline-none`).

### Don't:
- **Don't** use dropshipping clichés: no flashing countdown timers, fake stock counters, or neon sale banners.
- **Don't** expose third-party supplier or dropshipping terms in any customer-facing UI.
- **Don't** mix multiple conflicting accent hues on a single card; let the product photography and clean typography command attention.
- **Don't** float cards with heavy dark drop shadows at rest; keep resting surfaces calm, flat, and anchored.
