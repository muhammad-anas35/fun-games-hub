'use client'

import { useState, useEffect } from 'react'
import GameModal from './GameModal'

interface MemoryModalProps {
  onClose: () => void
  saveActivity: (message: string, icon: string) => void
  incrementGameCount: () => void
}

export default function MemoryModal({ onClose, saveActivity, incrementGameCount }: MemoryModalProps) {
  const [cards, setCards] = useState<string[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matches, setMatches] = useState(0)
  const [moves, setMoves] = useState(0)
  const [canFlip, setCanFlip] = useState(true)

  useEffect(() => {
    initGame()
  }, [])

  const shuffleArray = (array: string[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
  }

  const initGame = () => {
    const symbols = ['🎮', '🎲', '🎯', '🎨', '⭐', '🎪', '🎭', '🎸']
    const shuffled = [...symbols, ...symbols]
    shuffleArray(shuffled)
    setCards(shuffled)
    setFlippedCards([])
    setMatches(0)
    setMoves(0)
    setCanFlip(true)
  }

  const flipCard = (index: number) => {
    if (!canFlip || flippedCards.includes(index) || flippedCards.length >= 2) return

    const newFlipped = [...flippedCards, index]
    setFlippedCards(newFlipped)

    if (newFlipped.length === 2) {
      setCanFlip(false)
      setMoves(moves + 1)

      if (cards[newFlipped[0]] === cards[newFlipped[1]]) {
        setMatches(matches + 1)
        setTimeout(() => {
          setFlippedCards([])
          setCanFlip(true)
          if (matches + 1 === 8) {
            saveActivity(`🧠 Completed Memory Match in ${moves + 1} moves!`, 'fa-trophy')
            incrementGameCount()
            setTimeout(() => {
              alert(`🎉 Congratulations! You completed the game in ${moves + 1} moves!`)
              onClose()
            }, 500)
          }
        }, 500)
      } else {
        setTimeout(() => {
          setFlippedCards([])
          setCanFlip(true)
        }, 1500)
      }
    }
  }

  return (
    <GameModal title="🧠 Memory Match" onClose={onClose}>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold text-primary">Moves: {moves}</p>
          <p className="text-lg font-semibold text-primary">Pairs Found: {matches}/8</p>
          <button
            onClick={initGame}
            className="py-3 px-8 bg-gradient-primary text-white border-none rounded-full text-base font-semibold cursor-pointer transition-all duration-300 shadow-lg hover:-translate-y-1 hover:shadow-xl"
          >
            New Game
          </button>
        </div>
        <div className="grid grid-cols-4 gap-3 w-full max-w-[500px] mx-auto">
          {cards.map((symbol, index) => {
            const isFlipped = flippedCards.includes(index)
            return (
              <div
                key={index}
                onClick={() => flipCard(index)}
                className="aspect-square bg-gradient-primary rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 flex items-center justify-center text-4xl perspective-1000"
                style={{
                  transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(180deg)',
                  transformStyle: 'preserve-3d'
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center backface-hidden">
                  {isFlipped ? symbol : '?'}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </GameModal>
  )
}

