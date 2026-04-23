import { Link } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { useGameState } from '../hooks/useGameState'
import { ArrangementZone } from '../components/game/ArrangementZone'
import { DeckArea } from '../components/game/DeckArea'
import { FlipZone } from '../components/game/FlipZone'
import { Button } from '@/components/ui/button'
import { useEffect, useRef } from 'react'

import { GameTimer } from '../components/game/GameTimer'

function ActivityLog({ logs }: { logs: string[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs])

  return (
    <div className="w-64 h-full min-h-0 flex flex-col bg-black/20 backdrop-blur-md rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
      <div className="px-5 py-3 border-b border-white/5 bg-white/5 flex items-center justify-between">
        <span className="text-[9px] text-white/40 font-black uppercase tracking-[0.2em]">Activity Log</span>
        <div className="w-1 h-1 rounded-full bg-indigo-500 animate-pulse" />
      </div>
      <div 
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3 scrollbar-none scroll-smooth"
      >
        {logs.map((log, i) => (
          <div 
            key={i} 
            className="text-[11px] leading-relaxed text-white/60 font-medium border-l border-white/10 pl-3 animate-in fade-in slide-in-from-left-2 duration-300"
          >
            {log}
          </div>
        ))}
      </div>
    </div>
  )
}

export function GamePage() {
  const {
    phase,
    flipCards,
    arrangementCards,
    selectedId,
    selectedOp,
    shakeOp,
    startTime,
    endTime,
    logs,
    deal,
    moveToArrangement,
    trySelectCard,
    selectOp,
    reset,
    redeal,
    dealingStage,
  } = useGameState()

  const formatFinalTime = () => {
    if (!startTime || !endTime) return ''
    const seconds = ((endTime - startTime) / 1000).toFixed(1)
    return `${seconds}s`
  }

  const isDealing = dealingStage !== 'idle'
  const canDeal =
    (phase === 'idle' || phase === 'flip' || phase === 'success' || phase === 'fail') &&
    !isDealing
  const canReset = arrangementCards.length > 0

  return (
    <div
      className="min-h-screen flex flex-col overflow-x-hidden text-left bg-felt selection:bg-white/20"
    >
      {phase === 'success' && (
        <div className="fixed top-0 left-0 w-full bg-green-500/90 text-white text-center py-4 text-xl font-bold animate-slide-down z-50 shadow-lg backdrop-blur-sm">
          🎉 恭喜！用时 {formatFinalTime()} 完美达到 24 点！
        </div>
      )}

      <div className="flex-1 min-h-0 flex flex-col gap-4 p-4 max-w-6xl mx-auto w-full">
        <header className="shrink-0 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-5">
            <Link to="/">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full bg-white/5 border-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all duration-300"
              >
                <ArrowLeft className="size-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">24 GAME</h1>
              <p className="text-white/40 text-xs sm:text-sm font-medium uppercase tracking-widest mt-0.5">Classic Card Puzzle</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <GameTimer 
              startTime={startTime} 
              endTime={endTime} 
              isRunning={phase === 'arranging'} 
            />
          </div>
        </header>

        <main className="flex-1 min-h-0 flex flex-col gap-4">
          <section className="shrink-0 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-7 lg:gap-8 px-4 py-3 rounded-3xl bg-black/10 border border-white/5 shadow-inner">
            <DeckArea onClick={deal} disabled={!canDeal} />
            <div className="hidden sm:block h-20 w-px bg-white/10" />
            <FlipZone cards={flipCards} onMove={moveToArrangement} dealingStage={dealingStage} />
          </section>

          <section className="flex-1 min-h-[300px] flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Play Area Container - Apple Glassmorphism with Log */}
            <div className="relative w-full h-full min-h-[300px] max-h-[460px] rounded-[2rem] sm:rounded-[3rem] bg-white/5 backdrop-blur-3xl border border-white/10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)] overflow-visible">
              
              {/* Minimal Header Bar */}
              <div className="absolute top-4 sm:top-5 left-5 sm:left-7 right-5 sm:right-7 md:right-80 flex justify-between items-center z-40">
                <span className="text-[10px] text-white/20 font-black uppercase tracking-[0.4em] select-none">Game Board</span>
                
                <div className="flex gap-6 items-center pr-2">
                  <button
                    onClick={reset}
                    disabled={!canReset}
                    className="group flex items-center gap-2 transition-all duration-300 disabled:pointer-events-none disabled:opacity-30"
                  >
                    <div className="w-1 h-1 rounded-full bg-white/10 group-hover:bg-amber-500 transition-colors" />
                    <span className="text-[9px] text-white/20 group-hover:text-white/60 font-black uppercase tracking-widest transition-colors">Reset</span>
                  </button>
                  <button
                    onClick={redeal}
                    className="group flex items-center gap-2 transition-all duration-300"
                  >
                    <div className="w-1 h-1 rounded-full bg-white/10 group-hover:bg-indigo-500 transition-colors" />
                    <span className="text-[9px] text-white/20 group-hover:text-white/60 font-black uppercase tracking-widest transition-colors">New Game</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-0 h-full min-h-0">
                {/* Left: Main Play Zone */}
                <div className="flex-1 min-h-0 relative flex flex-col items-center justify-center p-6 sm:p-8 lg:p-10 md:pr-80 mt-4">
                  <ArrangementZone
                    cards={arrangementCards}
                    selectedId={selectedId}
                    selectedOp={selectedOp}
                    shakeOp={shakeOp}
                    phase={phase as 'arranging' | 'success' | 'fail'}
                    onCardClick={trySelectCard}
                    onSelectOp={selectOp}
                  />
                  
                  {/* Soft ambient lighting inside the glass */}
                  <div className="absolute inset-0 pointer-events-none rounded-l-[2rem] sm:rounded-l-[3rem] bg-[radial-gradient(ellipse_at_top_center,rgba(255,255,255,0.06)_0%,transparent_80%)]" />
                </div>
              </div>

              {/* Right: Activity Log Zone */}
              <div className="absolute right-5 top-5 bottom-5 hidden md:flex min-h-0 items-stretch">
                <ActivityLog logs={logs} />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
