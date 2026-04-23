import type { CSSProperties } from 'react'
import { CARD_SIZES } from './card.types'
import type { CardSize, Rank, Suit } from './card.types'
import { SuitIcon } from './SuitIcon'
import { cn } from '@/lib/utils'

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
  joker: 'text-foreground',
}

interface CardFrontProps {
  suit: Suit
  rank: Rank
  size: CardSize
  className?: string
  style?: CSSProperties
}

export function CardFront({ suit, rank, size, className, style }: CardFrontProps) {
  const cfg = CARD_SIZES[size]
  
  // Joker handling: big joker is red, small joker is black
  // In our system, if rank is 'joker', we use suit to determine color
  const isRedJoker = rank === 'joker' && (suit === 'hearts' || suit === 'diamonds')
  const suitColor = rank === 'joker' 
    ? (isRedJoker ? 'text-red-500' : 'text-slate-900')
    : SUIT_COLORS[suit]

  const cornerHeight =
    cfg.padding + cfg.cornerFontSize + cfg.cornerGap + cfg.cornerIconSize + 4

  const renderPipArea = () => {
    if (rank === 'joker') {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <SuitIcon suit="joker" size={cfg.aceSize * 1.8} className={suitColor} />
        </div>
      )
    }
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
      {rank === 'joker' ? (
        <div className={cn("flex flex-col items-center leading-none font-bold", suitColor)}
             style={{ fontSize: cfg.cornerFontSize * 0.6 }}>
          {"JOKER".split("").map((char, i) => (
            <span key={i} className="py-[0.5px]">{char}</span>
          ))}
        </div>
      ) : (
        <>
          <span
            className={`font-semibold leading-none ${suitColor}`}
            style={{ fontSize: rank === '10' ? cfg.cornerFontSize * 0.82 : cfg.cornerFontSize }}
          >
            {rank}
          </span>
          <SuitIcon 
            suit={suit} 
            size={cfg.cornerIconSize} 
          />
        </>
      )}
    </>
  )

  return (
    <div
      className={cn(
        "relative bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm",
        className
      )}
      style={{ width: cfg.width, height: cfg.height, flexShrink: 0, ...style }}
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
