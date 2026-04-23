# Poker Card Components Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full 52-card poker component library (front + configurable back) with lucide-react suit icons and Tailwind v4, displayed on the homepage.

**Architecture:** Five focused files under `src/components/cards/` — types/config, SuitIcon wrapper, CardFront, CardBack, PlayingCard entry. App.tsx is replaced with a showcase page displaying all 52 card fronts, 3 back variants, and 3 size comparisons.

**Tech Stack:** React 19, TypeScript 6, Tailwind v4, lucide-react (Heart/Spade/Diamond/Club confirmed in v1.8.0), Vite 8.

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/components/cards/card.types.ts` | Create | Types + CARD_SIZES size-config constant |
| `src/components/cards/SuitIcon.tsx` | Create | lucide icon wrapper, suit→color |
| `src/components/cards/CardFront.tsx` | Create | Front face: corners + pip layout |
| `src/components/cards/CardBack.tsx` | Create | Back face: geometric / icon-tile / solid |
| `src/components/cards/PlayingCard.tsx` | Create | Entry — composes CardFront / CardBack |
| `src/App.tsx` | Modify | Replace default Vite starter with showcase |
| `src/App.css` | Modify | Clear content (replaced by Tailwind) |

---

## Task 1: Types and size configuration

**Files:**
- Create: `src/components/cards/card.types.ts`

- [ ] **Step 1: Create `src/components/cards/card.types.ts`**

```ts
export type Suit = 'spades' | 'hearts' | 'diamonds' | 'clubs'
export type Rank =
  | 'A' | '2' | '3' | '4' | '5' | '6' | '7'
  | '8' | '9' | '10' | 'J' | 'Q' | 'K'
export type CardSize = 'sm' | 'md' | 'lg'
export type BackVariant = 'geometric' | 'icon-tile' | 'solid'

export interface PlayingCardProps {
  suit: Suit
  rank: Rank
  face: 'front' | 'back'
  size?: CardSize
  backVariant?: BackVariant
}

export interface CardSizeConfig {
  width: number
  height: number
  cornerFontSize: number
  cornerIconSize: number
  pipSize: number
  aceSize: number
  faceFontSize: number
  padding: number
  cornerGap: number
  tileIconSize: number
  tileCols: number
  tileRows: number
}

export const CARD_SIZES: Record<CardSize, CardSizeConfig> = {
  sm: {
    width: 56,
    height: 80,
    cornerFontSize: 8,
    cornerIconSize: 7,
    pipSize: 7,
    aceSize: 18,
    faceFontSize: 16,
    padding: 3,
    cornerGap: 1,
    tileIconSize: 10,
    tileCols: 3,
    tileRows: 5,
  },
  md: {
    width: 80,
    height: 112,
    cornerFontSize: 11,
    cornerIconSize: 9,
    pipSize: 10,
    aceSize: 26,
    faceFontSize: 22,
    padding: 4,
    cornerGap: 1,
    tileIconSize: 14,
    tileCols: 4,
    tileRows: 5,
  },
  lg: {
    width: 112,
    height: 156,
    cornerFontSize: 15,
    cornerIconSize: 13,
    pipSize: 13,
    aceSize: 36,
    faceFontSize: 30,
    padding: 6,
    cornerGap: 2,
    tileIconSize: 20,
    tileCols: 5,
    tileRows: 6,
  },
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/cards/card.types.ts
git commit -m "feat: add poker card types and size config"
```

---

## Task 2: SuitIcon component

**Files:**
- Create: `src/components/cards/SuitIcon.tsx`

- [ ] **Step 1: Create `src/components/cards/SuitIcon.tsx`**

```tsx
import { Club, Diamond, Heart, Spade } from 'lucide-react'
import type { Suit } from './card.types'

const SUIT_ICONS = {
  hearts: Heart,
  diamonds: Diamond,
  clubs: Club,
  spades: Spade,
} as const

const SUIT_COLORS: Record<Suit, string> = {
  hearts: 'text-red-500',
  diamonds: 'text-red-500',
  clubs: 'text-foreground',
  spades: 'text-foreground',
}

interface SuitIconProps {
  suit: Suit
  size: number
  className?: string
}

export function SuitIcon({ suit, size, className = '' }: SuitIconProps) {
  const Icon = SUIT_ICONS[suit]
  return (
    <Icon
      width={size}
      height={size}
      fill="currentColor"
      strokeWidth={0}
      className={`${SUIT_COLORS[suit]} ${className}`}
    />
  )
}
```

> Note: `fill="currentColor"` + `strokeWidth={0}` renders solid filled suit shapes, matching real poker card aesthetics.

- [ ] **Step 2: Commit**

```bash
git add src/components/cards/SuitIcon.tsx
git commit -m "feat: add SuitIcon lucide wrapper"
```

---

## Task 3: CardFront component

**Files:**
- Create: `src/components/cards/CardFront.tsx`

- [ ] **Step 1: Create `src/components/cards/CardFront.tsx`**

```tsx
import { CARD_SIZES } from './card.types'
import type { Rank, Suit, CardSize } from './card.types'
import { SuitIcon } from './SuitIcon'

interface PipPosition {
  left: number
  top: number
  rotate?: boolean
}

const PIP_LAYOUTS: Record<string, PipPosition[]> = {
  '2': [
    { left: 50, top: 15 },
    { left: 50, top: 85, rotate: true },
  ],
  '3': [
    { left: 50, top: 12 },
    { left: 50, top: 50 },
    { left: 50, top: 88, rotate: true },
  ],
  '4': [
    { left: 25, top: 15 },
    { left: 75, top: 15 },
    { left: 25, top: 85, rotate: true },
    { left: 75, top: 85, rotate: true },
  ],
  '5': [
    { left: 25, top: 15 },
    { left: 75, top: 15 },
    { left: 50, top: 50 },
    { left: 25, top: 85, rotate: true },
    { left: 75, top: 85, rotate: true },
  ],
  '6': [
    { left: 25, top: 15 },
    { left: 75, top: 15 },
    { left: 25, top: 50 },
    { left: 75, top: 50 },
    { left: 25, top: 85, rotate: true },
    { left: 75, top: 85, rotate: true },
  ],
  '7': [
    { left: 25, top: 15 },
    { left: 75, top: 15 },
    { left: 50, top: 30 },
    { left: 25, top: 50 },
    { left: 75, top: 50 },
    { left: 25, top: 85, rotate: true },
    { left: 75, top: 85, rotate: true },
  ],
  '8': [
    { left: 25, top: 15 },
    { left: 75, top: 15 },
    { left: 50, top: 30 },
    { left: 25, top: 50 },
    { left: 75, top: 50 },
    { left: 50, top: 70, rotate: true },
    { left: 25, top: 85, rotate: true },
    { left: 75, top: 85, rotate: true },
  ],
  '9': [
    { left: 25, top: 12 },
    { left: 75, top: 12 },
    { left: 25, top: 35 },
    { left: 75, top: 35 },
    { left: 50, top: 50 },
    { left: 25, top: 65, rotate: true },
    { left: 75, top: 65, rotate: true },
    { left: 25, top: 88, rotate: true },
    { left: 75, top: 88, rotate: true },
  ],
  '10': [
    { left: 25, top: 12 },
    { left: 75, top: 12 },
    { left: 50, top: 24 },
    { left: 25, top: 38 },
    { left: 75, top: 38 },
    { left: 25, top: 62, rotate: true },
    { left: 75, top: 62, rotate: true },
    { left: 50, top: 76, rotate: true },
    { left: 25, top: 88, rotate: true },
    { left: 75, top: 88, rotate: true },
  ],
}

const FACE_CARDS = new Set<Rank>(['J', 'Q', 'K'])

const SUIT_COLORS: Record<Suit, string> = {
  hearts: 'text-red-500',
  diamonds: 'text-red-500',
  clubs: 'text-foreground',
  spades: 'text-foreground',
}

interface CardFrontProps {
  suit: Suit
  rank: Rank
  size: CardSize
}

export function CardFront({ suit, rank, size }: CardFrontProps) {
  const cfg = CARD_SIZES[size]
  const suitColor = SUIT_COLORS[suit]
  const cornerHeight =
    cfg.padding + cfg.cornerFontSize + cfg.cornerGap + cfg.cornerIconSize + 4

  const renderPipArea = () => {
    if (rank === 'A') {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <SuitIcon suit={suit} size={cfg.aceSize} />
        </div>
      )
    }
    if (FACE_CARDS.has(rank)) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <span
            className={`font-bold leading-none ${suitColor}`}
            style={{ fontSize: cfg.faceFontSize }}
          >
            {rank}
          </span>
        </div>
      )
    }
    const pips = PIP_LAYOUTS[rank] ?? []
    return (
      <div className="relative w-full h-full">
        {pips.map((pos, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${pos.left}%`,
              top: `${pos.top}%`,
              transform: `translate(-50%, -50%)${pos.rotate ? ' rotate(180deg)' : ''}`,
            }}
          >
            <SuitIcon suit={suit} size={cfg.pipSize} />
          </div>
        ))}
      </div>
    )
  }

  const cornerLabel = (
    <>
      <span
        className={`font-semibold leading-none ${suitColor}`}
        style={{ fontSize: rank === '10' ? cfg.cornerFontSize * 0.82 : cfg.cornerFontSize }}
      >
        {rank}
      </span>
      <SuitIcon suit={suit} size={cfg.cornerIconSize} />
    </>
  )

  return (
    <div
      className="relative bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm"
      style={{ width: cfg.width, height: cfg.height, flexShrink: 0 }}
    >
      {/* Top-left corner */}
      <div
        className="absolute flex flex-col items-center"
        style={{ top: cfg.padding, left: cfg.padding, gap: cfg.cornerGap }}
      >
        {cornerLabel}
      </div>

      {/* Center pip area */}
      <div
        className="absolute"
        style={{
          top: cornerHeight,
          bottom: cornerHeight,
          left: cfg.padding,
          right: cfg.padding,
        }}
      >
        {renderPipArea()}
      </div>

      {/* Bottom-right corner (rotated 180°) */}
      <div
        className="absolute flex flex-col items-center rotate-180"
        style={{ bottom: cfg.padding, right: cfg.padding, gap: cfg.cornerGap }}
      >
        {cornerLabel}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/cards/CardFront.tsx
git commit -m "feat: add CardFront with pip layout"
```

---

## Task 4: CardBack component

**Files:**
- Create: `src/components/cards/CardBack.tsx`

- [ ] **Step 1: Create `src/components/cards/CardBack.tsx`**

```tsx
import { Spade } from 'lucide-react'
import { CARD_SIZES } from './card.types'
import type { CardSize, BackVariant } from './card.types'

interface CardBackProps {
  size: CardSize
  variant: BackVariant
}

export function CardBack({ size, variant }: CardBackProps) {
  const cfg = CARD_SIZES[size]
  const base = {
    width: cfg.width,
    height: cfg.height,
    flexShrink: 0,
  }

  if (variant === 'geometric') {
    return (
      <div
        className="relative rounded-lg overflow-hidden border-2 border-white shadow-sm"
        style={{
          ...base,
          backgroundColor: 'oklch(0.205 0 0)',
          backgroundImage: [
            'repeating-linear-gradient(45deg, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 1px, transparent 1px, transparent 8px)',
            'repeating-linear-gradient(-45deg, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 1px, transparent 1px, transparent 8px)',
          ].join(', '),
        }}
      >
        <div
          className="absolute rounded border border-white/30"
          style={{ inset: 4 }}
        />
      </div>
    )
  }

  if (variant === 'icon-tile') {
    const total = cfg.tileCols * cfg.tileRows
    return (
      <div
        className="relative rounded-lg overflow-hidden border-2 border-white shadow-sm"
        style={{ ...base, backgroundColor: 'oklch(0.205 0 0)' }}
      >
        <div
          className="absolute inset-0 grid"
          style={{
            gridTemplateColumns: `repeat(${cfg.tileCols}, 1fr)`,
            padding: 4,
            gap: 2,
          }}
        >
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} className="flex items-center justify-center">
              <Spade
                width={cfg.tileIconSize}
                height={cfg.tileIconSize}
                fill="currentColor"
                strokeWidth={0}
                className="text-white/20"
              />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // variant === 'solid'
  return (
    <div
      className="relative rounded-lg overflow-hidden border-2 border-white shadow-sm flex items-center justify-center"
      style={{ ...base, backgroundColor: 'oklch(0.205 0 0)' }}
    >
      <div
        className="absolute rounded border border-white/30"
        style={{ inset: 4 }}
      />
      <Spade
        width={cfg.aceSize}
        height={cfg.aceSize}
        fill="currentColor"
        strokeWidth={0}
        className="text-white/60 relative z-10"
      />
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/cards/CardBack.tsx
git commit -m "feat: add CardBack with geometric/icon-tile/solid variants"
```

---

## Task 5: PlayingCard entry component

**Files:**
- Create: `src/components/cards/PlayingCard.tsx`

- [ ] **Step 1: Create `src/components/cards/PlayingCard.tsx`**

```tsx
import { CardBack } from './CardBack'
import { CardFront } from './CardFront'
import type { PlayingCardProps } from './card.types'

export function PlayingCard({
  suit,
  rank,
  face,
  size = 'md',
  backVariant = 'geometric',
}: PlayingCardProps) {
  if (face === 'back') {
    return <CardBack size={size} variant={backVariant} />
  }
  return <CardFront suit={suit} rank={rank} size={size} />
}
```

- [ ] **Step 2: Verify types compile**

Run: `npm run build`
Expected: exits 0, no TypeScript errors. If there are errors, fix them before committing.

- [ ] **Step 3: Commit**

```bash
git add src/components/cards/PlayingCard.tsx
git commit -m "feat: add PlayingCard entry component"
```

---

## Task 6: Homepage showcase (App.tsx)

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/App.css` (clear)

- [ ] **Step 1: Clear `src/App.css`** (remove all content to avoid style conflicts)

Replace entire file content with:

```css
```

(empty file)

- [ ] **Step 2: Replace `src/App.tsx`**

```tsx
import { PlayingCard } from './components/cards/PlayingCard'
import type { BackVariant, Rank, Suit } from './components/cards/card.types'

const SUITS: Suit[] = ['spades', 'hearts', 'diamonds', 'clubs']
const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
const BACK_VARIANTS: BackVariant[] = ['geometric', 'icon-tile', 'solid']

const SUIT_LABELS: Record<Suit, string> = {
  spades: '♠ Spades',
  hearts: '♥ Hearts',
  diamonds: '♦ Diamonds',
  clubs: '♣ Clubs',
}

function App() {
  return (
    <div className="min-h-screen bg-neutral-100 p-8">
      <h1 className="text-3xl font-bold mb-10 text-foreground text-left">
        Poker Card Components
      </h1>

      {/* Section 1: Full deck — front */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold mb-4 text-left text-foreground">
          Full Deck — Front
        </h2>
        <div className="flex flex-col gap-3">
          {SUITS.map((suit) => (
            <div key={suit} className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground text-left mb-1">
                {SUIT_LABELS[suit]}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {RANKS.map((rank) => (
                  <PlayingCard
                    key={rank}
                    suit={suit}
                    rank={rank}
                    face="front"
                    size="sm"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Back variants */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold mb-4 text-left text-foreground">
          Back Variants
        </h2>
        <div className="flex gap-8 items-start">
          {BACK_VARIANTS.map((variant) => (
            <div key={variant} className="flex flex-col items-center gap-2">
              <PlayingCard
                suit="spades"
                rank="A"
                face="back"
                size="md"
                backVariant={variant}
              />
              <span className="text-xs text-muted-foreground">{variant}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: Size comparison */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold mb-4 text-left text-foreground">
          Size Comparison
        </h2>
        <div className="flex gap-8 items-end">
          {(['sm', 'md', 'lg'] as const).map((size) => (
            <div key={size} className="flex flex-col items-center gap-2">
              <PlayingCard suit="spades" rank="A" face="front" size={size} />
              <span className="text-xs text-muted-foreground">{size}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default App
```

- [ ] **Step 3: Start dev server and verify visually**

Run: `npm run dev`

Open the local URL (default `http://localhost:5173`). Verify:
- [ ] All 52 cards render in 4 rows of 13 — no missing cards, no overflow errors in console
- [ ] Red suits (hearts, diamonds) show red icons; black suits (spades, clubs) show dark icons
- [ ] Number cards (2–10) show the correct pip count in the correct positions
- [ ] Face cards (J, Q, K) show large bold letter; Ace shows large centered suit icon
- [ ] Corner labels show rank + suit icon top-left and bottom-right (rotated)
- [ ] "10" rank renders without breaking the corner label layout
- [ ] Three back variants render distinctly: crosshatch pattern / tiled spade icons / solid + centered spade
- [ ] Three size variants render at noticeably different sizes (sm < md < lg)

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx src/App.css
git commit -m "feat: replace homepage with poker card showcase"
```

---

## Done

All 52 card fronts + 3 back variants + 3 size variants are displayed on the homepage. No interaction, no game logic — pure display components ready for reuse.
