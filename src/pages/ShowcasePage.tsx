import { useState } from 'react'
import { Link } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { PlayingCard } from '../components/cards/PlayingCard'
import { Button } from '@/components/ui/button'
import type { BackVariant, Rank, Suit } from '../components/cards/card.types'

const SUITS: Suit[] = ['spades', 'hearts', 'diamonds', 'clubs']
const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
const BACK_VARIANTS: BackVariant[] = ['geometric', 'icon-tile', 'solid']

const SUIT_LABELS: Record<Suit, string> = {
  spades: '♠ Spades',
  hearts: '♥ Hearts',
  diamonds: '♦ Diamonds',
  clubs: '♣ Clubs',
  joker: '🃏 Jokers',
}

export function ShowcasePage() {
  const [animatingCards, setAnimatingCards] = useState<Set<string>>(new Set())
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set())
  const [flippingToBack, setFlippingToBack] = useState<Set<string>>(new Set())

  const handleCardClick = (id: string) => {
    if (animatingCards.has(id)) return
    
    const isCurrentlyFront = !flippedCards.has(id)
    
    setAnimatingCards(prev => new Set(prev).add(id))
    if (isCurrentlyFront) {
      setFlippingToBack(prev => new Set(prev).add(id))
    }

    // Toggle face at the midpoint of the animation (300ms)
    setTimeout(() => {
      setFlippedCards(prev => {
        const next = new Set(prev)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        return next
      })
    }, 300)

    setTimeout(() => {
      setAnimatingCards(prev => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
      setFlippingToBack(prev => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }, 600)
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="flex items-center gap-4 mb-10">
        <Link to="/">
          <Button variant="outline" size="icon">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-slate-950 dark:text-slate-50">
          组件预览
        </h1>
      </div>

      <section className="mb-12">
        <h2 className="text-lg font-semibold mb-4 text-left text-slate-900 dark:text-slate-100">
          全套卡牌 — 正面
        </h2>
        <div className="flex flex-col gap-6">
          {SUITS.filter(s => s !== 'joker').map((suit) => (
            <div key={suit} className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground text-left mb-1">
                {SUIT_LABELS[suit]}
              </span>
              <div className="flex flex-wrap gap-4 py-2 items-end">
                {RANKS.map((rank) => {
                  const id = `${suit}-${rank}`
                  const isAnimating = animatingCards.has(id)
                  const isFlipped = flippedCards.has(id)
                  const isToBack = flippingToBack.has(id)
                  
                  const animClass = isAnimating 
                    ? (isToBack ? 'animate-flip-to-back' : 'animate-flip-to-front')
                    : ''

                  return (
                    <div 
                      key={rank} 
                      onClick={() => handleCardClick(id)}
                      className={`cursor-pointer perspective-1000 ${animClass} ${!isAnimating && isFlipped ? 'is-flipped' : ''}`}
                    >
                      <PlayingCard 
                        suit={suit} 
                        rank={rank} 
                        face={isFlipped ? 'back' : 'front'} 
                        size="sm"
                        style={{ 
                          transform: isFlipped ? 'rotateY(180deg)' : 'none' 
                        }}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

          {/* Dedicated Jokers Group */}
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground text-left mb-1">
              Jokers
            </span>
            <div className="flex flex-wrap gap-4 py-2 items-end">
              {[
                { suit: 'hearts' as Suit, rank: 'joker' as Rank, id: 'joker-big' },
                { suit: 'clubs' as Suit, rank: 'joker' as Rank, id: 'joker-small' }
              ].map((joker) => {
                const isAnimating = animatingCards.has(joker.id)
                const isFlipped = flippedCards.has(joker.id)
                const isToBack = flippingToBack.has(joker.id)
                
                const animClass = isAnimating 
                  ? (isToBack ? 'animate-flip-to-back' : 'animate-flip-to-front')
                  : ''

                return (
                  <div 
                    key={joker.id} 
                    onClick={() => handleCardClick(joker.id)}
                    className={`cursor-pointer perspective-1000 ${animClass} ${!isAnimating && isFlipped ? 'is-flipped' : ''}`}
                  >
                    <PlayingCard 
                      suit={joker.suit} 
                      rank={joker.rank} 
                      face={isFlipped ? 'back' : 'front'} 
                      size="sm"
                      style={{ 
                        transform: isFlipped ? 'rotateY(180deg)' : 'none' 
                      }}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-lg font-semibold mb-4 text-left text-slate-900 dark:text-slate-100">
          卡背样式
        </h2>
        <div className="flex gap-8 items-start">
          {BACK_VARIANTS.map((variant) => (
            <div key={variant} className="flex flex-col items-center gap-2">
              <PlayingCard suit="spades" rank="A" face="back" size="md" backVariant={variant} />
              <span className="text-xs text-muted-foreground">{variant}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-lg font-semibold mb-4 text-left text-black dark:text-white">
          尺寸对比
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
