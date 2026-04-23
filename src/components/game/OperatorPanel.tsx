import type { Operator } from './game.types'

const OPERATORS: Operator[] = ['+', '-', '×', '÷']

interface OperatorPanelProps {
  selectedOp: Operator | null
  shakeOp: boolean
  onSelectOp: (op: Operator) => void
}

export function OperatorPanel({ selectedOp, shakeOp, onSelectOp }: OperatorPanelProps) {
  return (
    <div className="absolute bottom-[calc(100%+24px)] left-1/2 -translate-x-1/2 flex flex-row gap-1 z-30 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* 装饰性小圆点指引 */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-1 h-1 bg-white/30 rounded-full" />
      
      {OPERATORS.map((op, idx) => {
        const isActive = selectedOp === op
        return (
          <button
            key={op}
            onClick={(e) => { e.stopPropagation(); onSelectOp(op) }}
            className={[
              'w-8 h-8 rounded-lg text-base font-black transition-all duration-200 select-none flex items-center justify-center relative group',
              'border shadow-[0_2px_0_0_rgba(0,0,0,0.3)] active:shadow-none active:translate-y-0.5',
              isActive
                ? 'bg-gradient-to-b from-amber-300 to-amber-500 border-amber-200 text-amber-950 scale-110 z-10'
                : 'bg-black/70 backdrop-blur-md border-white/10 text-white/90 hover:bg-white/20 hover:border-white/30 hover:-translate-y-0.5',
              shakeOp && isActive ? 'animate-shake' : '',
            ].join(' ')}
            style={{ transitionDelay: `${idx * 20}ms` }}
          >
            <span className="flex items-center justify-center w-full h-full leading-none mt-[-1px]">
              {op}
            </span>
            
            {isActive && (
              <div className="absolute inset-0 rounded-lg bg-white/20 animate-pulse pointer-events-none" />
            )}
          </button>
        )
      })}
    </div>
  )
}
