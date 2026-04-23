import { useEffect, useState } from 'react'

interface GameTimerProps {
  startTime?: number
  endTime?: number
  isRunning: boolean
}

export function GameTimer({ startTime, endTime, isRunning }: GameTimerProps) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setNow(Date.now())
    }, 100)

    return () => clearInterval(interval)
  }, [isRunning])

  const elapsed = startTime ? Math.max(0, (endTime || now) - startTime) : 0
  const seconds = Math.floor(elapsed / 1000)
  const milliseconds = Math.floor((elapsed % 1000) / 100)

  const formatTime = () => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}.${milliseconds}`
  }

  return (
    <div className="px-4 sm:px-5 py-1.5 rounded-2xl bg-black/20 backdrop-blur-md border border-white/5 flex flex-col items-center min-w-28 sm:min-w-32 transition-all duration-500 shadow-xl">
      <span className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-0.5">Time Elapsed</span>
      <span className="text-xl sm:text-2xl font-black text-white font-mono tabular-nums leading-none">
        {formatTime()}
      </span>
    </div>
  )
}
