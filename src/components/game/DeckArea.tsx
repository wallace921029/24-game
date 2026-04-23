import { CardBack } from '../cards/CardBack'

interface DeckAreaProps {
  onClick: () => void
  disabled: boolean
}

export function DeckArea({ onClick, disabled }: DeckAreaProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={onClick}
        disabled={disabled}
        className={[
          'relative transition-all duration-300 group perspective-1000',
          disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        ].join(' ')}
        style={{ width: 80, height: 112 }}
      >
        <div className="absolute transition-transform duration-300" style={{ top: 8, left: 8 }}>
          <CardBack size="md" variant="geometric" className="opacity-40" />
        </div>
        <div className="absolute transition-transform duration-300" style={{ top: 4, left: 4 }}>
          <CardBack size="md" variant="geometric" className="opacity-60" />
        </div>
        <div className="relative game-card-shadow-lg rounded-lg overflow-hidden">
          <CardBack size="md" variant="geometric" />
        </div>
      </button>
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-[10px] font-bold uppercase tracking-tighter text-white/40">
          Deck
        </span>
        <span className="text-xs font-medium text-white/60">
          {disabled ? 'DEALING...' : 'DEAL CARDS'}
        </span>
      </div>
    </div>
  )
}
