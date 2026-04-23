import { Spade } from 'lucide-react'
import type { CSSProperties } from 'react'
import { CARD_SIZES } from './card.types'
import type { BackVariant, CardSize } from './card.types'
import { cn } from '@/lib/utils'

interface CardBackProps {
  size: CardSize
  variant: BackVariant
  className?: string
  style?: CSSProperties
}

export function CardBack({ size, variant, className, style }: CardBackProps) {
  const cfg = CARD_SIZES[size]
  const base = {
    width: cfg.width,
    height: cfg.height,
    flexShrink: 0,
  }

  if (variant === 'geometric') {
    return (
      <div
        className={cn("relative rounded-lg overflow-hidden border-2 border-white shadow-sm", className)}
        style={{
          ...base,
          backgroundColor: 'oklch(0.205 0 0)',
          backgroundImage: [
            'repeating-linear-gradient(45deg, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 1px, transparent 1px, transparent 8px)',
            'repeating-linear-gradient(-45deg, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 1px, transparent 1px, transparent 8px)',
          ].join(', '),
          ...style,
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
        className={cn("relative rounded-lg overflow-hidden border-2 border-white shadow-sm", className)}
        style={{ ...base, backgroundColor: 'oklch(0.205 0 0)', ...style }}
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
      className={cn("relative rounded-lg overflow-hidden border-2 border-white shadow-sm flex items-center justify-center", className)}
      style={{ ...base, backgroundColor: 'oklch(0.205 0 0)', ...style }}
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
