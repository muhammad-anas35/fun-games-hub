'use client'

import { useState, useEffect } from 'react'
import GameModal from './GameModal'

interface TicTacToeModalProps {
  onClose: () => void
  saveActivity: (message: string, icon: string) => void
  incrementGameCount: () => void
}

export default function TicTacToeModal({ onClose, saveActivity, incrementGameCount }: TicTacToeModalProps) {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState('X')
  const [gameOver, setGameOver] = useState(false)
  const [scores, setScores] = useState({ player: 0, computer: 0 })

  useEffect(() => {
    loadScores()
  }, [])

  const loadScores = () => {
    if (typeof window === 'undefined') return
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      const user = JSON.parse(currentUser)
      const scoresKey = `tictactoe_scores_${user.email}`
      const stored = JSON.parse(localStorage.getItem(scoresKey) || '{"player":0,"computer":0}')
      setScores(stored)
    }
  }

  const saveScores = (playerScore: number, computerScore: number) => {
    if (typeof window === 'undefined') return
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      const user = JSON.parse(currentUser)
      const scoresKey = `tictactoe_scores_${user.email}`
      localStorage.setItem(scoresKey, JSON.stringify({ player: playerScore, computer: computerScore }))
    }
  }

  const checkWinner = (board: (string | null)[]) => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ]

    for (const pattern of winPatterns) {
      if (pattern.every(index => board[index] === 'X')) return pattern
      if (pattern.every(index => board[index] === 'O')) return pattern
    }
    return null
  }

  const handleClick = (index: number) => {
    if (board[index] || gameOver || currentPlayer !== 'X') return

    const newBoard = [...board]
    newBoard[index] = 'X'
    setBoard(newBoard)

    const winner = checkWinner(newBoard)
    if (winner) {
      setGameOver(true)
      const newScore = scores.player + 1
      setScores({ ...scores, player: newScore })
      saveScores(newScore, scores.computer)
      saveActivity('🏆 Won Tic-Tac-Toe game!', 'fa-trophy')
      incrementGameCount()
      return
    }

    if (newBoard.every(cell => cell !== null)) {
      setGameOver(true)
      return
    }

    setCurrentPlayer('O')
    setTimeout(() => computerMove(newBoard), 800)
  }

  const computerMove = (currentBoard: (string | null)[]) => {
    let move = -1

    // Try to win
    for (let i = 0; i < 9; i++) {
      if (!currentBoard[i]) {
        const testBoard = [...currentBoard]
        testBoard[i] = 'O'
        if (checkWinner(testBoard)) {
          move = i
          break
        }
      }
    }

    // Block player
    if (move === -1) {
      for (let i = 0; i < 9; i++) {
        if (!currentBoard[i]) {
          const testBoard = [...currentBoard]
          testBoard[i] = 'X'
          if (checkWinner(testBoard)) {
            move = i
            break
          }
        }
      }
    }

    // Random move
    if (move === -1) {
      const available = currentBoard.map((cell, idx) => cell === null ? idx : -1).filter(idx => idx !== -1)
      move = available[Math.floor(Math.random() * available.length)]
    }

    const newBoard = [...currentBoard]
    newBoard[move] = 'O'
    setBoard(newBoard)

    const winner = checkWinner(newBoard)
    if (winner) {
      setGameOver(true)
      const newScore = scores.computer + 1
      setScores({ ...scores, computer: newScore })
      saveScores(scores.player, newScore)
      return
    }

    if (newBoard.every(cell => cell !== null)) {
      setGameOver(true)
      return
    }

    setCurrentPlayer('X')
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setCurrentPlayer('X')
    setGameOver(false)
  }

  return (
    <GameModal title="❌ Tic-Tac-Toe" onClose={onClose}>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">❌</span>
            <span>You: {scores.player}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">⭕</span>
            <span>Computer: {scores.computer}</span>
          </div>
        </div>
        <div className="text-center text-lg font-semibold text-primary">
          {gameOver ? 'Game Over!' : currentPlayer === 'X' ? 'Your turn (❌)' : 'Computer thinking...'}
        </div>
        <div className="grid grid-cols-3 gap-2 w-full max-w-[400px] mx-auto">
          {board.map((cell, index) => (
            <div
              key={index}
              onClick={() => handleClick(index)}
              className="aspect-square bg-background-light border-3 border-primary/20 rounded-xl flex items-center justify-center text-4xl font-bold cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-primary/10 hover:border-primary"
            >
              {cell === 'X' ? '❌' : cell === 'O' ? '⭕' : ''}
            </div>
          ))}
        </div>
        <button
          onClick={resetGame}
          className="py-3 px-8 bg-gradient-primary text-white border-none rounded-full text-base font-semibold cursor-pointer transition-all duration-300 shadow-lg hover:-translate-y-1 hover:shadow-xl mx-auto"
        >
          New Game
        </button>
      </div>
    </GameModal>
  )
}

