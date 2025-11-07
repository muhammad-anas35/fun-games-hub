'use client'

import { useState, useEffect, useRef } from 'react'
import GameModal from './GameModal'

interface SnakeLadderModalProps {
  onClose: () => void
  saveActivity: (message: string, icon: string) => void
  incrementGameCount: () => void
}

const snakes: Record<number, number> = {
  16: 6, 46: 25, 49: 11, 62: 19, 64: 60, 74: 53, 89: 68, 92: 88, 95: 75, 99: 80
}

const ladders: Record<number, number> = {
  2: 38, 7: 14, 8: 31, 15: 26, 21: 42, 28: 84, 36: 44, 51: 67, 71: 91, 78: 98
}

export default function SnakeLadderModal({ onClose, saveActivity, incrementGameCount }: SnakeLadderModalProps) {
  const [playerPos, setPlayerPos] = useState(1)
  const [gameStatus, setGameStatus] = useState('Ready to play! Roll the dice to start.')
  const [diceRolling, setDiceRolling] = useState(false)
  const [diceFace, setDiceFace] = useState('🎲')
  const boardRef = useRef<HTMLDivElement>(null)

  const diceFaces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅']

  useEffect(() => {
    createBoard()
  }, [])

  const createBoard = () => {
    if (!boardRef.current) return
    
    boardRef.current.innerHTML = ''
    
    for (let row = 9; row >= 0; row--) {
      const isEvenRow = row % 2 === 0
      const startNum = row * 10 + 1
      const endNum = (row + 1) * 10
      
      if (isEvenRow) {
        for (let i = endNum; i >= startNum; i--) {
          createCell(i, boardRef.current)
        }
      } else {
        for (let i = startNum; i <= endNum; i++) {
          createCell(i, boardRef.current)
        }
      }
    }
    updatePlayerPosition()
  }

  const createCell = (num: number, container: HTMLDivElement) => {
    const cell = document.createElement('div')
    cell.className = 'aspect-square bg-gradient-to-br from-background-light to-white border-2 border-primary/20 rounded-lg flex flex-col items-center justify-center text-xs font-semibold text-primary transition-all duration-300 relative p-1 min-h-[50px]'
    cell.id = `cell-${num}`
    
    const cellNumber = document.createElement('span')
    cellNumber.className = 'text-sm font-bold z-[2]'
    cellNumber.textContent = num.toString()
    cell.appendChild(cellNumber)
    
    if (snakes[num]) {
      cell.classList.add('bg-gradient-to-br', 'from-red-500', 'to-red-600', 'text-white', 'border-red-700')
      cell.title = `🐍 Snake! Slides down to ${snakes[num]}`
      const snakeIcon = document.createElement('span')
      snakeIcon.className = 'text-lg absolute top-0.5 right-0.5 z-[1] animate-pulse'
      snakeIcon.textContent = '🐍'
      cell.appendChild(snakeIcon)
    }
    
    if (ladders[num]) {
      cell.title = `🎉 Ladder! Climb up to ${ladders[num]}`
      const ladderIcon = document.createElement('span')
      ladderIcon.className = 'text-lg absolute top-0.5 right-0.5 z-[1] animate-pulse'
      ladderIcon.textContent = '🎉'
      cell.appendChild(ladderIcon)
    }
    
    container.appendChild(cell)
  }

  const updatePlayerPosition = () => {
    document.querySelectorAll('.board-cell').forEach(cell => {
      cell.classList.remove('player-here')
    })
    
    const currentCell = document.getElementById(`cell-${playerPos}`)
    if (currentCell) {
      currentCell.classList.add('player-here', 'bg-gradient-primary', 'border-primary-dark', 'shadow-lg', 'scale-110', 'z-[5]')
      currentCell.innerHTML = `<span class="text-white text-base font-bold z-[2]">${playerPos}</span><span class="absolute text-2xl animate-player-bounce z-[10] drop-shadow">👤</span>`
      currentCell.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  useEffect(() => {
    updatePlayerPosition()
  }, [playerPos])

  const rollDice = () => {
    if (diceRolling) return
    setDiceRolling(true)
    
    let rollCount = 0
    const rollInterval = setInterval(() => {
      const randomNum = Math.floor(Math.random() * 6) + 1
      setDiceFace(diceFaces[randomNum - 1])
      rollCount++
      
      if (rollCount >= 10) {
        clearInterval(rollInterval)
        const finalRoll = Math.floor(Math.random() * 6) + 1
        setDiceFace(diceFaces[finalRoll - 1])
        movePlayer(finalRoll)
      }
    }, 100)
  }

  const movePlayer = (steps: number) => {
    const startPos = playerPos
    const targetPos = Math.min(playerPos + steps, 100)
    
    animateMovement(startPos, targetPos, () => {
      let newPos = targetPos
      
      if (ladders[newPos]) {
        const ladderDest = ladders[newPos]
        setGameStatus(`🎉 Ladder! Climbing to ${ladderDest}!`)
        setTimeout(() => {
          newPos = ladderDest
          setPlayerPos(newPos)
          setGameStatus(`🎉 Climbed to position ${newPos}!`)
          checkGameEnd(newPos)
        }, 800)
      } else if (snakes[newPos]) {
        const snakeDest = snakes[newPos]
        setGameStatus(`🐍 Snake! Sliding down to ${snakeDest}!`)
        setTimeout(() => {
          newPos = snakeDest
          setPlayerPos(newPos)
          setGameStatus(`🐍 Slid down to position ${newPos}!`)
          checkGameEnd(newPos)
        }, 800)
      } else {
        setPlayerPos(newPos)
        checkGameEnd(newPos)
      }
    })
  }

  const animateMovement = (start: number, end: number, callback: () => void) => {
    let current = start
    const step = start < end ? 1 : -1
    const interval = setInterval(() => {
      current += step
      setPlayerPos(current)
      
      if (current === end) {
        clearInterval(interval)
        setTimeout(callback, 300)
      }
    }, 150)
  }

  const checkGameEnd = (pos: number) => {
    if (pos === 100) {
      setGameStatus('🎉 Congratulations! You won!')
      saveActivity('🏆 Won Snake & Ladder game!', 'fa-trophy')
      incrementGameCount()
      showConfetti()
      setTimeout(() => {
        onClose()
      }, 3000)
    } else {
      setDiceRolling(false)
      if (!gameStatus.includes('Ladder') && !gameStatus.includes('Snake')) {
        setGameStatus(`Moved to position ${pos}. Roll again!`)
      }
    }
  }

  const showConfetti = () => {
    const confettiCount = 50
    const colors = ['#DE9843', '#C8842E', '#FFD93D', '#FF6B9D', '#51CF66']
    
    for (let i = 0; i < confettiCount; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div')
        confetti.className = 'confetti fixed z-[9999] rounded-full'
        confetti.style.left = Math.random() * 100 + '%'
        confetti.style.width = (Math.random() * 10 + 5) + 'px'
        confetti.style.height = (Math.random() * 10 + 5) + 'px'
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
        confetti.style.animationDelay = Math.random() * 0.5 + 's'
        confetti.style.animation = 'confetti-fall 3s linear forwards'
        document.body.appendChild(confetti)
        
        setTimeout(() => confetti.remove(), 3000)
      }, i * 20)
    }
  }

  return (
    <GameModal title="🎲 Snake & Ladder" onClose={onClose}>
      <div className="flex flex-col gap-5">
        <div className="bg-primary/10 p-5 rounded-2xl text-center">
          <div className="text-2xl font-bold text-primary mb-5">
            Your Position: <span className="text-4xl text-primary-dark">{playerPos}</span>/100
          </div>
          <div className="flex flex-col items-center gap-4 my-5">
            <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center text-5xl shadow-lg transition-transform hover:scale-110">
              {diceFace}
            </div>
            <button
              onClick={rollDice}
              disabled={diceRolling}
              className="py-4 px-10 bg-gradient-primary text-white border-none rounded-full text-base font-semibold cursor-pointer transition-all duration-300 shadow-lg hover:-translate-y-1 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Roll Dice
            </button>
          </div>
          <div className="text-lg font-semibold text-primary min-h-[30px]">{gameStatus}</div>
        </div>
        <div className="grid grid-cols-10 gap-0.5 max-w-[600px] mx-auto" ref={boardRef}></div>
      </div>
    </GameModal>
  )
}

