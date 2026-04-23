import type { Rank, Suit } from '../components/cards/card.types'
import type { CardItem } from '../components/game/game.types'

const SUITS: Suit[] = ['spades', 'hearts', 'diamonds', 'clubs']
const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10']

const RANK_VALUES: Record<string, number> = {
  A: 1, '2': 2, '3': 3, '4': 4, '5': 5,
  '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
}

const TARGET_VALUE = 24
const MAX_RANDOM_SOLVABLE_DRAW_ATTEMPTS = 200

interface Rational {
  numerator: number
  denominator: number
}

function buildDeck(): CardItem[] {
  return SUITS.flatMap((suit) =>
    RANKS.map((rank) => ({
      id: `${suit}-${rank}`,
      kind: 'poker' as const,
      suit,
      rank,
      value: RANK_VALUES[rank],
    }))
  )
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export function drawCards(n: number): CardItem[] {
  return shuffle(buildDeck()).slice(0, n)
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a)
  let y = Math.abs(b)

  while (y !== 0) {
    const next = x % y
    x = y
    y = next
  }

  return x || 1
}

function rational(numerator: number, denominator: number): Rational {
  const sign = denominator < 0 ? -1 : 1
  const divisor = gcd(numerator, denominator)

  return {
    numerator: (numerator / divisor) * sign,
    denominator: Math.abs(denominator / divisor),
  }
}

function add(a: Rational, b: Rational): Rational {
  return rational(
    a.numerator * b.denominator + b.numerator * a.denominator,
    a.denominator * b.denominator
  )
}

function subtract(a: Rational, b: Rational): Rational {
  return rational(
    a.numerator * b.denominator - b.numerator * a.denominator,
    a.denominator * b.denominator
  )
}

function multiply(a: Rational, b: Rational): Rational {
  return rational(a.numerator * b.numerator, a.denominator * b.denominator)
}

function divide(a: Rational, b: Rational): Rational | null {
  if (b.numerator === 0) return null
  return rational(a.numerator * b.denominator, a.denominator * b.numerator)
}

function equalsTarget(value: Rational): boolean {
  return value.numerator === TARGET_VALUE * value.denominator
}

function canValuesMakeTwentyFour(values: Rational[]): boolean {
  if (values.length === 1) return equalsTarget(values[0])

  for (let i = 0; i < values.length; i++) {
    for (let j = i + 1; j < values.length; j++) {
      const a = values[i]
      const b = values[j]
      const rest = values.filter((_, index) => index !== i && index !== j)
      const candidates = [
        add(a, b),
        subtract(a, b),
        subtract(b, a),
        multiply(a, b),
        divide(a, b),
        divide(b, a),
      ].filter((value): value is Rational => value !== null)

      if (candidates.some((candidate) => canValuesMakeTwentyFour([...rest, candidate]))) {
        return true
      }
    }
  }

  return false
}

export function canMakeTwentyFour(cards: Array<Pick<CardItem, 'value'>>): boolean {
  if (cards.length !== 4) return false

  return canValuesMakeTwentyFour(cards.map((card) => rational(card.value, 1)))
}

function findSolvableHand(): CardItem[] {
  const deck = shuffle(buildDeck())

  for (let a = 0; a < deck.length - 3; a++) {
    for (let b = a + 1; b < deck.length - 2; b++) {
      for (let c = b + 1; c < deck.length - 1; c++) {
        for (let d = c + 1; d < deck.length; d++) {
          const hand = [deck[a], deck[b], deck[c], deck[d]]
          if (canMakeTwentyFour(hand)) return hand
        }
      }
    }
  }

  throw new Error('No solvable 24-point hand found in deck.')
}

export function drawSolvableTwentyFourCards(): CardItem[] {
  for (let attempt = 0; attempt < MAX_RANDOM_SOLVABLE_DRAW_ATTEMPTS; attempt++) {
    const cards = drawCards(4)
    if (canMakeTwentyFour(cards)) return cards
  }

  return findSolvableHand()
}
