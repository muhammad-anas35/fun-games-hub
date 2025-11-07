'use client'

import { useState, useEffect } from 'react'
import GameModal from './GameModal'

interface PuzzleModalProps {
  onClose: () => void
  saveActivity: (message: string, icon: string) => void
}

export default function PuzzleModal({ onClose, saveActivity }: PuzzleModalProps) {
  const [puzzleNumbers, setPuzzleNumbers] = useState<(number | null)[]>([])
  const [emptyIndex, setEmptyIndex] = useState(8)
  const [moves, setMoves] = useState(0)

  useEffect(() => {
    initGame()
  }, [])

  const shuffleArray = (array: (number | null)[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
  }

  const initGame = () => {
    const numbers: (number | null)[] = [1, 2, 3, 4, 5, 6, 7, 8, null]
    shuffleArray(numbers)
    setPuzzleNumbers(numbers)
    setEmptyIndex(numbers.indexOf(null))
    setMoves(0)
  }

  const movePiece = (index: number) => {
    const row = Math.floor(index / 3)
    const col = index % 3
    const emptyRow = Math.floor(emptyIndex / 3)
    const emptyCol = emptyIndex % 3

    const isAdjacent = (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
                      (Math.abs(col - emptyCol) === 1 && row === emptyRow)

    if (isAdjacent) {
      const newNumbers = [...puzzleNumbers]
      ;[newNumbers[index], newNumbers[emptyIndex]] = [newNumbers[emptyIndex], newNumbers[index]]
      setPuzzleNumbers(newNumbers)
      setEmptyIndex(index)
      setMoves(moves + 1)

      if (isSolved(newNumbers)) {
        saveActivity(`🧩 Solved puzzle in ${moves + 1} moves!`, 'fa-trophy')
        setTimeout(() => onClose(), 2000)
      }
    }
  }

  const isSolved = (numbers: (number | null)[]) => {
    for (let i = 0; i < numbers.length - 1; i++) {
      if (numbers[i] !== i + 1) return false
    }
    return numbers[numbers.length - 1] === null
  }

  return (
    <GameModal title="🧩 Number Puzzle" onClose={onClose}>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold text-primary">Moves: <span>{moves}</span></p>
          <button
            onClick={initGame}
            className="py-3 px-8 bg-gradient-primary text-white border-none rounded-full text-base font-semibold cursor-pointer transition-all duration-300 shadow-lg hover:-translate-y-1 hover:shadow-xl"
          >
            Reset
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2.5 w-full max-w-[400px] bg-primary/10 p-5 rounded-2xl mx-auto">
          {puzzleNumbers.map((num, index) => (
            <div
              key={index}
              onClick={() => movePiece(index)}
              className={`aspect-square rounded-xl flex items-center justify-center text-3xl font-bold cursor-pointer transition-all duration-300 shadow-md ${
                num === null
                  ? 'bg-transparent border-3 border-dashed border-primary/30 cursor-default'
                  : 'bg-gradient-primary text-white border-3 border-white/30 hover:scale-105'
              }`}
            >
              {num}
            </div>
          ))}
        </div>
      </div>
    </GameModal>
  )
}

