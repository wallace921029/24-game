# 24-Game Page Design

**Date:** 2026-04-22  
**Status:** Approved  
**Route:** `/24-game`

---

## Overview

A single-page card game where the user is dealt 4 cards (A–10, no J/Q/K) and must combine them using +, −, ×, ÷ to reach 24. The interaction model is **progressive reduction**: each operation merges two cards into one result card, until one card remains. If it equals 24, the user wins.

---

## Deck Rules

- 40 cards total: 4 suits × 10 ranks (A, 2–10)
- A = 1, 2–10 = face value
- Each deal draws 4 random cards (fresh shuffle each time)
- No J, Q, K

---

## Game Phases

```
idle → flip → arranging → success | fail
                 ↑______________|  (reset)
```

| Phase | Description |
|-------|-------------|
| `idle` | Deck shown, nothing dealt |
| `flip` | 4 cards in flip zone, waiting to move |
| `arranging` | Cards in arrangement zone, game in progress |
| `success` | Last card = 24 |
| `fail` | Last card ≠ 24 (user chose to submit with 1 card) |

---

## State Model

```ts
type GamePhase = 'idle' | 'flip' | 'arranging' | 'success' | 'fail'

type CardItem =
  | { id: string; kind: 'poker'; suit: Suit; rank: Rank; value: number }
  | { id: string; kind: 'result'; value: number; expression: string }

interface GameState {
  phase: GamePhase
  flipCards: CardItem[]         // cards in flip zone (max 4)
  arrangementCards: CardItem[]  // cards in arrangement zone (starts 4, reduces to 1)
  originalCards: CardItem[]     // saved copy for reset
  selectedId: string | null     // floating card id
  selectedOp: string | null     // chosen operator: '+' | '-' | '×' | '÷'
}
```

---

## Actions

| Action | Description |
|--------|-------------|
| `deal()` | Shuffle and draw 4 cards → flipCards, phase → `flip` |
| `moveToArrangement()` | flipCards → arrangementCards (save copy to originalCards), phase → `arranging` |
| `selectCard(id)` | If no selected card: float it. If card+op already selected: execute calculation. If same card clicked: deselect. |
| `selectOp(op)` | Set selectedOp. Requires selectedId to be set first. |
| `reset()` | Restore originalCards to arrangementCards, clear selectedId/selectedOp, phase → `arranging` |
| `redeal()` | Clear everything, phase → `idle` |

---

## Calculation Logic

Triggered when `selectCard(id)` is called with `selectedId` and `selectedOp` already set:

1. Find card A (`selectedId`) and card B (new `id`)
2. Compute `result = A.value op B.value`
3. If op is `÷` and B.value === 0: abort, shake operator buttons (invalid)
4. Build expression string: `"(${A.expression ?? A.display} ${op} ${B.expression ?? B.display})"`
5. Replace both cards with new result `CardItem` of kind `result`
6. Clear `selectedId` and `selectedOp`
7. If `arrangementCards.length === 1`:
   - `Math.abs(result - 24) < 1e-9` → phase `success`
   - Otherwise → phase `fail`

---

## File Structure

```
src/
  router.tsx                    # BrowserRouter with / and /24-game routes
  pages/
    ShowcasePage.tsx            # current App.tsx content moved here
    GamePage.tsx                # game page shell
  components/
    game/
      DeckArea.tsx              # clickable deck (3-layer card stack)
      FlipZone.tsx              # 4 dealt cards, click zone to move all
      ArrangementZone.tsx       # game board: cards + floating operator panel
      ResultCard.tsx            # result card (distinct visual style)
      OperatorPanel.tsx         # +−×÷ buttons, positioned next to selected card
  hooks/
    useGameState.ts             # all game state + action functions
  lib/
    deck.ts                     # buildDeck(), shuffle(), drawCards(n)
```

---

## Visual Design

### Page
- Background: deep green felt `oklch(0.25 0.06 145)`
- Title: "24点" top-left, white, large

### Layout (vertical flow)
```
[DeckArea]   [FlipZone: card card card card]   ← row 1
────────────────────────────────────────────
[ArrangementZone: card card card card]         ← row 2 (after move)
[Reset]                        [Redeal]        ← row 3
```

### DeckArea
- 3 stacked card-back layers (offset by 2px each), `geometric` variant
- "点击发牌" label below
- Click → press-down animation (`scale(0.97)`, 100ms)
- Empty state when `phase !== 'idle'`

### FlipZone
- Cards displayed face-up in a row, `md` size
- Entire zone is clickable (cursor pointer, hover: subtle outline)
- Hint text below: "点击移入理牌区"

### ArrangementZone cards
- Poker cards: `PlayingCard` component, `md` size
- Result cards: `ResultCard`, same dimensions (80×112px)
  - Background: `oklch(0.3 0.15 280)` (deep blue-purple)
  - Value: centered, `text-2xl font-bold text-white`
  - Expression: bottom, `text-[10px] text-white/60`, truncated
  - Same border-radius and shadow as poker card
- Selected card: `translateY(-10px)` + stronger shadow, `transition: 150ms ease-out`
- Cards spaced with `gap-4`, centered horizontally

### OperatorPanel
- Absolutely positioned, appears to the right of selected card
- 4 circular buttons in vertical stack: `+` `−` `×` `÷`
- Active operator: filled background (accent color)
- Invalid shake: `@keyframes shake` on division-by-zero attempt
- Disappears when card is deselected

### Success State
- Last card animates: `scale(1 → 1.15 → 1)` + green glow (`box-shadow: 0 0 24px oklch(0.7 0.2 145)`)
- Banner at top: "🎉 答对了！" with slide-down animation

### Fail State
- Last card: red border `border-red-500`
- Inline message below arrangement zone: "差一点，重置试试？"

---

## Routing

Add `react-router-dom` to project.

```tsx
// src/router.tsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<ShowcasePage />} />
    <Route path="/24-game" element={<GamePage />} />
  </Routes>
</BrowserRouter>
```

`src/main.tsx` wraps `<App>` with router (or router replaces App).

---

## Constraints & Non-Goals

- No undo (reset instead)
- No timer or scoring
- No hint / auto-solve
- No animations for card-move from flip zone to arrangement zone (phase 1 MVP)
- No persistence / history
