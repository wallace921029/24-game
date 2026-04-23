import { PlayingCard } from '../cards/PlayingCard'
import type { CardItem, Operator } from './game.types'
import { OperatorPanel } from './OperatorPanel'
import { ResultCard } from './ResultCard'

interface ArrangementZoneProps {
  cards: CardItem[]
  selectedId: string | null
  selectedOp: Operator | null
  shakeOp: boolean
  phase: 'arranging' | 'success' | 'fail'
  onCardClick: (id: string) => void
  onSelectOp: (op: Operator) => void
}

export function ArrangementZone({
  cards,
  selectedId,
  selectedOp,
  shakeOp,
  phase,
  onCardClick,
  onSelectOp,
}: ArrangementZoneProps) {
  if (cards.length === 0) return null

  return (
    <div className="flex flex-wrap gap-4 sm:gap-6 lg:gap-8 items-center justify-center min-h-[176px]">
      {cards.map((card) => {
        const isSelected = selectedId === card.id
        const isSuccess = phase === 'success' && cards.length === 1
        const isFail = phase === 'fail' && cards.length === 1

        return (
          <div 
            key={card.id} 
            className={[
              'relative transition-all duration-500 ease-out-expo',
              isSelected ? '-translate-y-8 z-30' : 'z-10'
            ].join(' ')}
          >
            {card.kind === 'poker' ? (
              <div
                onClick={() => onCardClick(card.id)}
                className={[
                  'cursor-pointer rounded-xl transition-all duration-300 group',
                  isSelected ? 'game-card-shadow-lg scale-110 ring-2 ring-white/20' : 'game-card-shadow hover:-translate-y-2',
                  isFail ? 'ring-4 ring-red-500/50' : '',
                ].join(' ')}
              >
                <PlayingCard suit={card.suit} rank={card.rank} face="front" size="md" />
                {isSelected && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-pulse shadow-[0_0_8px_white]" />
                )}
              </div>
            ) : (
              <ResultCard
                card={card}
                isSelected={isSelected}
                isSuccess={isSuccess}
                isFail={isFail}
                onClick={() => onCardClick(card.id)}
              />
            )}

            {isSelected && (
              <OperatorPanel
                selectedOp={selectedOp}
                shakeOp={shakeOp}
                onSelectOp={onSelectOp}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
