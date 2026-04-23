import type { Rank, Suit } from '../cards/card.types'

export type GamePhase = 'idle' | 'flip' | 'arranging' | 'success' | 'fail'
export type Operator = '+' | '-' | '×' | '÷'

export type CardItem =
  | { id: string; kind: 'poker'; suit: Suit; rank: Rank; value: number }
  | { id: string; kind: 'result'; value: number; expression: string }

export interface GameState {
  phase: GamePhase
  flipCards: CardItem[]
  arrangementCards: CardItem[]
  originalCards: CardItem[]
  selectedId: string | null
  selectedOp: Operator | null
  startTime?: number
  endTime?: number
  logs: string[]
}
