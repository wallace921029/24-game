import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { PlayingCard } from '../components/cards/PlayingCard'
import type { Rank, Suit } from '../components/cards/card.types'

interface CardState {
  id: number
  suit: Suit
  rank: Rank
  x: number
  y: number
  rotate: number
  targetX: number
  targetY: number
  targetRotate: number
  delay: number
}

const SUITS: Suit[] = ['spades', 'hearts', 'diamonds', 'clubs']
const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

export function HomePage() {
  const [cards, setCards] = useState<CardState[]>([])
  const [isBlown, setIsBlown] = useState(false)

  useEffect(() => {
    // Generate initial cards in a pile with pre-calculated targets
    const newCards: CardState[] = Array.from({ length: 16 }).map((_, i) => ({
      id: i,
      suit: SUITS[Math.floor(Math.random() * SUITS.length)],
      rank: RANKS[Math.floor(Math.random() * RANKS.length)],
      x: 0,
      y: 0,
      rotate: (Math.random() - 0.5) * 15,
      targetX: (Math.random() - 0.5) * 120,
      targetY: (Math.random() - 0.5) * 120,
      targetRotate: (Math.random() - 0.5) * 1080,
      delay: Math.random() * 0.4,
    }))
    setCards(newCards)

    const timer = setTimeout(() => setIsBlown(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background flex flex-col items-center justify-center">
      {/* Cards Layer */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="relative w-full h-full flex items-center justify-center">
          {cards.map((card) => (
            <div
              key={card.id}
              className="absolute transition-all duration-1000 ease-out"
              style={{
                transform: isBlown
                  ? `translate(${card.targetX}vw, ${card.targetY}vh) rotate(${card.targetRotate}deg)`
                  : `translate(${card.x}px, ${card.y}px) rotate(${card.rotate}deg)`,
                transitionDelay: isBlown ? `${card.delay}s` : '0s',
                opacity: 1,
                zIndex: 10 + card.id
              }}
            >
                <PlayingCard
                  suit={card.suit}
                  rank={card.rank}
                  face="front"
                  size="md"
                />
              </div>
            ))}
        </div>
      </div>

      {/* Content Layer */}
      <div className={`relative z-50 text-center transition-all duration-1000 ${isBlown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <h1 className="text-6xl font-bold mb-8 text-foreground tracking-tighter">
          24 GAME
        </h1>
        <div className="flex gap-6 justify-center">
          <Link
            to="/24-game"
            className="group relative px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all"
          >
            开始挑战
            <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </div>
        <p className="mt-12 text-muted-foreground font-medium animate-pulse">
          风暴之后，即是数字的对决
        </p>
      </div>

      {/* Secondary Entrance */}
      <div className="absolute bottom-8 right-8 z-50">
        <Link
          to="/pokers"
          className="text-xs text-muted-foreground/40 hover:text-muted-foreground transition-colors font-medium tracking-widest uppercase"
        >
          Component Showcase
        </Link>
      </div>

      {/* Wind effect overlays */}
      <div 
        className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${isBlown ? 'opacity-20' : 'opacity-0'}`}
        style={{
          background: 'linear-gradient(45deg, transparent 45%, rgba(255,255,255,0.4) 50%, transparent 55%)',
          backgroundSize: '200% 200%',
          animation: isBlown ? 'wind 0.5s linear infinite' : 'none'
        }}
      />

      <style>{`
        @keyframes wind {
          0% { background-position: 200% 0%; }
          100% { background-position: -100% 0%; }
        }
      `}</style>
    </div>
  )
}
