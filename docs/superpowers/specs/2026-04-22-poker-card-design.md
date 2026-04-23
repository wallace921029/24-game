# Poker Card Component Design

**Date:** 2026-04-22  
**Status:** Approved  
**Scope:** Pure display component library; interaction deferred

---

## Overview

A full set of poker card components (52 cards + configurable back) built with React 19, TypeScript, Tailwind v4, and lucide-react icons. Components are pure display — no click handlers or game logic. The homepage (`App.tsx`) replaces the default Vite starter and showcases all cards.

---

## File Structure

```
src/components/cards/
  card.types.ts        # Shared type definitions
  SuitIcon.tsx         # lucide icon wrapper (Heart/Diamond/Club/Spade)
  CardFront.tsx        # Front face: corner labels + center pip layout
  CardBack.tsx         # Back face: three configurable variants
  PlayingCard.tsx      # Main entry point, composes front/back
```

---

## Type System

```ts
type Suit = 'spades' | 'hearts' | 'diamonds' | 'clubs'
type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K'
type CardSize = 'sm' | 'md' | 'lg'
type BackVariant = 'geometric' | 'icon-tile' | 'solid'

interface PlayingCardProps {
  suit: Suit
  rank: Rank
  face: 'front' | 'back'
  size?: CardSize           // default: 'md'
  backVariant?: BackVariant // default: 'geometric', only used when face='back'
}
```

---

## Card Dimensions

Standard poker aspect ratio (~1:1.4):

| Size | Width | Height |
|------|-------|--------|
| sm   | 56px  | 80px   |
| md   | 80px  | 112px  |
| lg   | 112px | 156px  |

Consistent border-radius across all sizes (proportional via Tailwind).

---

## SuitIcon Component

Wraps lucide-react icons:

| Suit     | lucide Icon |
|----------|-------------|
| hearts   | `Heart`     |
| diamonds | `Diamond`   |
| clubs    | `Club`      |
| spades   | `Spade`     |

**Color rules:**
- `hearts` / `diamonds` → `text-red-500`
- `spades` / `clubs` → `text-foreground`

Props: `suit: Suit`, `size: number` (px), `className?: string`

---

## CardFront Component

Standard poker layout:

```
┌─────────────────┐
│ A               │  ← top-left: rank + small suit icon
│ ♥               │
│                 │
│      pips       │  ← center: pip grid (number cards) or large letter (J/Q/K)
│                 │
│               ♥ │  ← bottom-right: rank + small suit icon (rotate-180)
│               A │
└─────────────────┘
```

### Center area rules

- **A**: single large suit icon centered
- **2–10**: fixed pip position grid — each rank has a defined coordinate set matching standard pip layout
- **J / Q / K**: large bold letter in suit color

### Pip layout positions (normalized grid)

Standard pip positions for each rank, as a fraction of card height/width:

| Rank | Pip count | Layout description |
|------|-----------|--------------------|
| 2    | 2         | top-center, bottom-center |
| 3    | 3         | top-center, center, bottom-center |
| 4    | 4         | 2×2 corners |
| 5    | 5         | 4 corners + center |
| 6    | 6         | 2 columns × 3 rows |
| 7    | 7         | 6 + top-center-middle |
| 8    | 8         | 7 + bottom-center-middle |
| 9    | 9         | 4 corners + center column (3) + 2 mid-side |
| 10   | 10        | 4 corners + 2 center-column + top/bottom center |

Pips rendered as absolute-positioned `SuitIcon` elements within a relative container.

---

## CardBack Component

Three variants, all sharing: same border-radius, white border, size-aware dimensions.

### `geometric` (default)
- Background: `bg-primary`
- Foreground pattern: CSS `repeating-linear-gradient` or SVG pattern to create a diamond/crosshatch texture
- Inner inset border: white, ~4px inset from card edge

### `icon-tile`
- Background: `bg-primary`
- Texture: grid of semi-transparent white `Spade` lucide icons at fixed spacing
- Rendered via CSS grid or absolute positioning with overflow hidden
- Center area slightly lighter or unobstructed

### `solid`
- Background: `bg-primary`
- Border only: outer white border + inner inset white border
- Center: single large `Spade` lucide icon as a logo mark, white

---

## Homepage Display (App.tsx)

Replaces current default Vite content entirely.

### Sections

**1. Full deck — front face**  
Four rows (one per suit), each row 13 cards (A–K), `sm` size, flex-wrap.

**2. Back variants**  
Three cards side by side, `md` size, labeled: `geometric`, `icon-tile`, `solid`.

**3. Size comparison**  
Three cards (♠A front), one per size (`sm`, `md`, `lg`), aligned bottom, labeled.

### Styling
- White background page, centered layout
- Section headings using existing `h2` styles
- Card gap: `gap-2` between cards, `gap-8` between sections
- No changes to existing CSS variables

---

## Constraints & Non-Goals

- No click/hover interaction (deferred)
- No animation (deferred)
- No game logic
- No additional shadcn components needed (no `Card` wrapper)
- No test runner configured; manual visual verification only
