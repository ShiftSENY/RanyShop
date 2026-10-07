---
name: LanderShop
description: A serene, wellness-first e-commerce design system grounded in tactile clarity, warm linen surfaces, and botanical olive and terracotta purity derived from the RanyShop identity.
colors:
  primary: "#B35E2B"
  primary-hover: "#984E22"
  primary-subtle: "#FDF6F0"
  accent-olive: "#47522D"
  accent-olive-hover: "#353E20"
  accent-olive-subtle: "#F4F6EE"
  accent-success: "#2E6838"
  accent-success-subtle: "#DCFCE7"
  accent-warning: "#B45309"
  accent-warning-subtle: "#FEF3C7"
  accent-danger: "#B91C1C"
  neutral-bg: "#FAF7F2"
  neutral-surface: "#FFFFFF"
  neutral-subtle: "#F4EFEB"
  neutral-border: "#E5DFD7"
  neutral-muted: "#7D8271"
  neutral-dark: "#383D2C"
  neutral-heading: "#23271A"
typography:
  display:
    fontFamily: "var(--font-outfit), ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: "2.25rem"
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "var(--font-outfit), ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: "2rem"
    letterSpacing: "-0.015em"
  title:
    fontFamily: "var(--font-outfit), ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: "1.5rem"
    letterSpacing: "normal"
  body:
    fontFamily: "var(--font-outfit), ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: "1.25rem"
    letterSpacing: "normal"
  label:
    fontFamily: "var(--font-outfit), ui-sans-serif, system-ui, sans-serif"
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
    textColor: "{colors.neutral-surface}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-secondary:
    backgroundColor: "{colors.neutral-surface}"
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
    textColor: "{colors.neutral-surface}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
---

# Design System: LanderShop (RanyShop Botanical Redesign)

## Overview

**Creative North Star: "The Botanical Sanctuary"**

RanyShop's refreshed visual system embodies the tranquil serenity of a boutique botanical apothecary combined with modern e-commerce precision. Every viewport breathes: warm linen and alabaster surfaces (`#FAF7F2`), subtle stone boundaries (`#E5DFD7`), and rich olive green paired with warm terracotta accents allow wellness and skincare formulations to command focus.

Interaction is tactile, grounded, and organic. Controls respond with deliberate state changes, smooth tonal shifts, and warm focus outlines. Dropshipping clichés are replaced with authentic craftsmanship, organic materials, and soothing layout rhythm.

**Key Characteristics:**
- **Earth & Botanical Harmony:** Warm Alabaster/Linen canvas (`#FAF7F2`) anchored by Deep Botanical Forest Olive (`#47522D`) and Warm Terracotta (`#B35E2B`) extracted directly from the leaf insignia in `RanyShop_b-g_LOGO.png`.
- **Tactile & Deliberate Feedback:** Delicate warm stone borders (`#E5DFD7`), soft background tone shifts on hover, and amber/terracotta focus outlines.
- **Grounded Clarity:** Zero visual clutter, structured card containers, and balanced breathing room around product imagery and typography.

## Colors

The palette directly mirrors the natural organic tones in `RanyShop_b-g_LOGO.png`.

### Primary & Action
- **Warm Terracotta** (`#B35E2B`): Primary conversion actions ("Add to Cart", "Complete Order", "Buy Now"), active selection states, and key callouts.
- **Deep Terracotta** (`#984E22`): Interactive hover and active press state for primary interactive elements.
- **Terracotta Glow** (`#FDF6F0`): Gentle highlight container for policy and selected state backgrounds.

### Botanical Brand Anchor
- **Deep Forest Olive** (`#47522D` / `#353E20`): Brand headings, category badges, navigation hover states, and primary font accents.
- **Olive Herb Tint** (`#F4F6EE` / `bg-[#565E37]/10`): Soft pill backgrounds for product category tags.

### Functional & Status Semantics
- **Herbal Emerald** (`#2E6838` / `text-emerald-700`): Affirmative discounted sale prices, cart total values, and completed order confirmations.
- **Amber Ochre** (`#B45309` / `#FEF3C7`): Preparation alert and `READY_TO_SHIP` status badges.
- **Crimson Clay** (`#B91C1C` / `#DC2626`): Order cancellation tags, error states, and destructive actions.

### Neutral Surfaces
- **Warm Alabaster Canvas** (`#FAF7F2`): Primary body canvas and backdrop.
- **Crisp Studio Surface** (`#FFFFFF`): Elevated cards, modals, and input containers.
- **Soft Sand** (`#F4EFEB`): Secondary card containers and image container wells.
- **Warm Stone Border** (`#E5DFD7`): 1px structural container dividing lines, steppers, and inputs.
- **Forest Ink** (`#23271A` / `#2D3319`): High-contrast headlines, product titles, and body typography.
- **Muted Herb** (`#7D8271`): Helper text, strikethrough comparison prices, and placeholder copy.

## Typography

**Display & Body Font:** Outfit (`var(--font-outfit)`) with clean modern fallback grotestque.

### Hierarchy
- **Display** (700 weight, 30px / 1.875rem, line-height 36px, letter-spacing -0.025em): Storefront section titles.
- **Headline** (700 weight, 24px / 1.5rem, line-height 32px, letter-spacing -0.02em): Modal titles, checkout headings, and page anchors.
- **Title** (600 weight, 16px / 1rem, line-height 24px): Product names, quickview headers, and drawer titles.
- **Body** (400 weight, 14px / 0.875rem, line-height 20px): Product details, customer addresses, and policy copy.
- **Label** (500 weight, 12px / 0.75rem, letter-spacing 0.025em): Category badges, order statuses, and tabular quantity indicators.

## Components & Elevation

### Buttons
- **Primary:** Warm Terracotta background (`#B35E2B`), white text (`#FFFFFF`), smooth hover to `#984E22`, focus ring `focus:ring-[#B35E2B]`.
- **Secondary:** Studio white background, warm stone border (`#E5DFD7`), text in `#2D3319`, hover to `#FAF7F2`.
- **Ghost:** Transparent background, text in `#2D3319`, hover to `#B35E2B/10`.

### Cards & Drawers
- **Corner Style:** 8px–12px radius (`rounded-lg sm:rounded-xl`).
- **Surface:** Pure white with 1px border in `#E5DFD7`.
- **Depth:** Ambient soft resting elevation (`shadow-2xs`), lifting gracefully to `shadow-md` on hover.
