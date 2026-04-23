import type { CardItem } from './game.types'

interface ResultCardProps {
  card: Extract<CardItem, { kind: 'result' }>
  isSelected: boolean
  isSuccess: boolean
  isFail: boolean
  onClick: () => void
}

export function ResultCard({ card, isSelected, isSuccess, isFail, onClick }: ResultCardProps) {
  const displayValue = Number.isFinite(card.value) 
    ? card.value.toFixed(card.value % 1 === 0 ? 0 : 2) 
    : '?'

  return (
    <div
      onClick={onClick}
      className={[
        'relative flex flex-col items-center justify-center cursor-pointer rounded-xl border select-none overflow-hidden bg-white group game-card-shadow',
        'transition-all duration-500 ease-out',
        isSelected 
          ? 'scale-110 z-20 border-blue-400 shadow-[0_20px_40px_rgba(0,0,0,0.4)]' 
          : 'hover:-translate-y-3 z-10 border-gray-200',
        isSuccess ? 'animate-success ring-4 ring-green-400/50 border-green-500' : '',
        isFail ? 'ring-4 ring-red-500/50 border-red-500' : '',
      ].join(' ')}
      style={{
        width: 80,
        height: 112,
        flexShrink: 0,
      }}
    >
      {/* 角落数值 - 左上 */}
      <div className="absolute top-1 left-1.5 flex flex-col items-center leading-none">
        <span className="text-[14px] font-bold text-gray-900">{displayValue}</span>
      </div>

      {/* 角落数值 - 右下 (倒转) */}
      <div className="absolute bottom-1 right-1.5 flex flex-col items-center leading-none rotate-180">
        <span className="text-[14px] font-bold text-gray-900">{displayValue}</span>
      </div>

      {/* 中间计算公式 */}
      <div className="flex flex-col items-center justify-center px-2 py-4 text-center w-full h-full">
        <div className="w-full border-y border-gray-100 py-2 flex items-center justify-center min-h-[50px]">
          <span className="text-[10px] font-bold text-indigo-600 leading-tight break-words max-w-full">
            {card.expression}
          </span>
        </div>
      </div>

      {/* 扫光动画效果 */}
      <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />

      {/* 选中时的装饰 */}
      {isSelected && (
        <div className="absolute inset-0 border-2 border-indigo-400/30 rounded-xl pointer-events-none" />
      )}
      
      {/* 获胜时的底色 */}
      {isSuccess && (
        <div className="absolute inset-0 bg-green-500/5 pointer-events-none" />
      )}
    </div>
  )
}
