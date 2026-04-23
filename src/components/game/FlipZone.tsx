import { PlayingCard } from '../cards/PlayingCard'
import type { CardItem } from './game.types'

interface FlipZoneProps {
  cards: CardItem[]
  onMove: () => void
  dealingStage: 'idle' | 'gathering' | 'flying'
}

export function FlipZone({ cards, onMove, dealingStage }: FlipZoneProps) {
  const isDealing = dealingStage !== 'idle'

  if (cards.length === 0 && !isDealing) return (
    <div className="flex flex-col items-center gap-3 sm:gap-4 opacity-10">
      <div className="flex gap-3 items-center p-3 rounded-2xl border-2 border-dashed border-white/40 h-[136px] w-[min(360px,calc(100vw-2rem))] justify-center">
        <span className="text-white/40 text-sm font-bold uppercase tracking-widest">Waiting...</span>
      </div>
      <span className="text-[10px] text-white/40 font-bold uppercase tracking-tighter">Dealt Cards</span>
    </div>
  )

  return (
    <div className="flex flex-col items-center gap-3 sm:gap-4">
      <button
        onClick={onMove}
        disabled={isDealing}
        className={[
          "group relative flex flex-wrap justify-center gap-3 sm:gap-4 items-center p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all duration-300 shadow-xl active:scale-95 active:translate-y-1",
          isDealing ? "cursor-wait" : "cursor-pointer"
        ].join(' ')}
      >
        {cards.map((card, idx) =>
          card.kind === 'poker' ? (
            <div 
              key={`${dealingStage}-${card.id}`} 
              className={[
                "game-card-shadow transition-transform duration-500",
                dealingStage === 'gathering' ? "animate-gather" : 
                dealingStage === 'flying' ? "animate-fly-out" : 
                "hover:-translate-y-2 hover:rotate-1"
              ].join(' ')}
              style={{ 
                animationDelay: dealingStage === 'flying' ? `${idx * 80}ms` : 
                                dealingStage === 'gathering' ? `${(cards.length - 1 - idx) * 60}ms` : 
                                '0ms',
                zIndex: cards.length - idx 
              }}
            >
              <PlayingCard suit={card.suit} rank={card.rank} face="back" size="md" />
            </div>
          ) : null
        )}

        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl ring-2 ring-white/20 ring-inset pointer-events-none" />
      </button>
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-[10px] text-white/40 font-bold uppercase tracking-tighter">Dealt Cards</span>
        <span className="text-xs text-white/60 font-medium">
          {dealingStage === 'gathering' ? 'RECALLING...' : 
           dealingStage === 'flying' ? 'DEALING...' : 
           'CLICK TO MOVE TO TABLE'}
        </span>
      </div>
    </div>
  )
}
