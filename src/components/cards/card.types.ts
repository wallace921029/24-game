export type Suit = 'spades' | 'hearts' | 'diamonds' | 'clubs' | 'joker'
export type Rank =
  | 'A' | '2' | '3' | '4' | '5' | '6' | '7'
  | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'joker'
export type CardSize = 'sm' | 'md' | 'lg'
export type BackVariant = 'geometric' | 'icon-tile' | 'solid'

import type { CSSProperties } from 'react'

export interface PlayingCardProps {
  suit: Suit
  rank: Rank
  face: 'front' | 'back'
  size?: CardSize
  backVariant?: BackVariant
  className?: string
  style?: CSSProperties
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
