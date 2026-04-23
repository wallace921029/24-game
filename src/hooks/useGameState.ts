import { useCallback, useState } from 'react'
import { drawSolvableTwentyFourCards } from '../lib/deck'
import type { CardItem, GamePhase, GameState, Operator } from '../components/game/game.types'

const OPS: Record<Operator, (a: number, b: number) => number> = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '×': (a, b) => a * b,
  '÷': (a, b) => a / b,
}

function cardLabel(card: CardItem): string {
  return card.kind === 'result' ? card.expression : String(card.value)
}

const INITIAL: GameState = {
  phase: 'idle',
  flipCards: [],
  arrangementCards: [],
  originalCards: [],
  selectedId: null,
  selectedOp: null,
  logs: [],
  startTime: undefined,
  endTime: undefined,
}

export function useGameState() {
  const [state, setState] = useState<GameState>(INITIAL)
  const [shakeOp, setShakeOp] = useState(false)
  const [dealingStage, setDealingStage] = useState<'idle' | 'gathering' | 'flying'>('idle')

  const deal = useCallback(() => {
    if (dealingStage !== 'idle') return
    
    const hasCards = state.flipCards.length > 0
    if (hasCards) {
      setDealingStage('gathering')
      setTimeout(() => {
        startFlying()
      }, 650)
    } else {
      startFlying()
    }

    function startFlying() {
      setDealingStage('flying')
      setState((s) => ({
        ...s,
        phase: 'flip',
        flipCards: drawSolvableTwentyFourCards(),
        arrangementCards: [],
        originalCards: [],
        selectedId: null,
        selectedOp: null,
        startTime: undefined,
        endTime: undefined,
        logs: ['Cards dealt to flip zone.'],
      }))
      
      setTimeout(() => {
        setDealingStage('idle')
      }, 650)
    }
  }, [dealingStage, state.flipCards.length])

  const moveToArrangement = useCallback(() => {
    setState((s) => {
      if (s.phase !== 'flip') return s
      return {
        ...s,
        phase: 'arranging' as GamePhase,
        flipCards: [],
        arrangementCards: s.flipCards,
        originalCards: s.flipCards,
        startTime: Date.now(),
      }
    })
  }, [])

  const selectOp = useCallback((op: Operator) => {
    setState((s) => {
      if (!s.selectedId || s.phase !== 'arranging') return s
      return { ...s, selectedOp: op }
    })
  }, [])

  const selectCard = useCallback((id: string) => {
    setState((s) => {
      if (s.phase !== 'arranging') return s

      // Deselect same card
      if (s.selectedId === id) return { ...s, selectedId: null, selectedOp: null }

      // Nothing selected → float this card
      if (!s.selectedId) {
        return { ...s, selectedId: id }
      }

      const { selectedId, selectedOp } = s

      // Card + op selected → calculate
      if (selectedId && selectedOp) {
        const cardA = s.arrangementCards.find((c) => c.id === selectedId)
        const cardB = s.arrangementCards.find((c) => c.id === id)
        if (!cardA || !cardB) return s

        const resultValue = OPS[selectedOp](cardA.value, cardB.value)
        const newCard: CardItem = {
          id: `result-${Date.now()}`,
          kind: 'result',
          value: resultValue,
          expression: `(${cardLabel(cardA)} ${selectedOp} ${cardLabel(cardB)})`,
        }
        const remaining = [
          ...s.arrangementCards.filter((c) => c.id !== selectedId && c.id !== id),
          newCard,
        ]
        
        const isWin = remaining.length === 1 && Math.abs(resultValue - 24) < 1e-9
        const isFail = remaining.length === 1 && !isWin

        const phase: GamePhase = isWin ? 'success' : isFail ? 'fail' : 'arranging'
        
        // Only log the actual calculation step
        const logMsg = `${cardA.value} ${selectedOp} ${cardB.value} = ${resultValue}`
        const finalLog = isWin ? '🎉 Success! 24 reached.' : isFail ? '❌ Failed to reach 24.' : null
        
        return { 
          ...s, 
          arrangementCards: remaining, 
          selectedId: null, 
          selectedOp: null, 
          phase,
          endTime: (isWin || isFail) ? Date.now() : undefined,
          logs: [...s.logs, logMsg, ...(finalLog ? [finalLog] : [])]
        }
      }

      // Card selected, no op yet → switch selection
      return { ...s, selectedId: id }
    })
  }, [])

  const trySelectCard = useCallback(
    (id: string) => {
      const { selectedId, selectedOp, arrangementCards, phase } = state
      if (phase === 'arranging' && selectedId && selectedOp === '÷') {
        const cardB = arrangementCards.find((c) => c.id === id)
        if (cardB && cardB.value === 0) {
          setShakeOp(true)
          setTimeout(() => setShakeOp(false), 400)
          setState(s => ({ ...s, logs: [...s.logs, '⚠️ Error: Division by zero'] }))
          return
        }
      }
      selectCard(id)
    },
    [state, selectCard]
  )

  const reset = useCallback(() => {
    setState((s) => ({
      ...s,
      phase: 'arranging',
      arrangementCards: s.originalCards,
      selectedId: null,
      selectedOp: null,
      logs: [...s.logs, '🔄 Round reset.'],
    }))
  }, [])

  const redeal = useCallback(() => setState(INITIAL), [])

  return { ...state, shakeOp, dealingStage, deal, moveToArrangement, trySelectCard, selectOp, reset, redeal }
}
