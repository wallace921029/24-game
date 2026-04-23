import { Club, Diamond, Heart, Spade, Ghost } from 'lucide-react'
import type { Suit } from './card.types'

const SUIT_ICONS = {
  hearts: Heart,
  diamonds: Diamond,
  clubs: Club,
  spades: Spade,
  joker: Ghost,
} as const

const SUIT_COLORS: Record<Suit, string> = {
  hearts: 'text-red-500',
  diamonds: 'text-red-500',
  clubs: 'text-foreground',
  spades: 'text-foreground',
  joker: 'text-foreground', // Default color, can be overridden by CardFront
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
