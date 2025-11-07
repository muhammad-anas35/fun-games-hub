'use client'

import { useState, useEffect } from 'react'
import GameModal from './GameModal'

interface RPSModalProps {
  onClose: () => void
  saveActivity: (message: string, icon: string) => void
  incrementGameCount: () => void
}

export default function RPSModal({ onClose, saveActivity, incrementGameCount }: RPSModalProps) {
  const [scores, setScores] = useState({ player: 0, computer: 0 })
  const [playerChoice, setPlayerChoice] = useState('?')
  const [computerChoice, setComputerChoice] = useState('?')
  const [winner, setWinner] = useState('Choose your weapon!')
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    loadScores()
  }, [])

  const loadScores = () => {
    if (typeof window === 'undefined') return
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      const user = JSON.parse(currentUser)
      const scoresKey = `rps_scores_${user.email}`
      const stored = JSON.parse(localStorage.getItem(scoresKey) || '{"player":0,"computer":0}')
      setScores(stored)
    }
  }

  const saveScores = (playerScore: number, computerScore: number) => {
    if (typeof window === 'undefined') return
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      const user = JSON.parse(currentUser)
      const scoresKey = `rps_scores_${user.email}`
      localStorage.setItem(scoresKey, JSON.stringify({ player: playerScore, computer: computerScore }))
    }
  }

  const playRound = (choice: string) => {
    if (playing) return
    setPlaying(true)
    setPlayerChoice('?')
    setComputerChoice('?')
    setWinner('Get ready...')

    const choices = ['rock', 'paper', 'scissors']
    const computer = choices[Math.floor(Math.random() * choices.length)]
    const emojis: Record<string, string> = { rock: '🪨', paper: '📄', scissors: '✂️' }

    setTimeout(() => {
      setPlayerChoice(emojis[choice])
    }, 500)

    setTimeout(() => {
      setComputerChoice(emojis[computer])
    }, 1000)

    setTimeout(() => {
      let result = ''
      let newScores = { ...scores }

      if (choice === computer) {
        result = "It's a Tie!"
      } else if (
        (choice === 'rock' && computer === 'scissors') ||
        (choice === 'paper' && computer === 'rock') ||
        (choice === 'scissors' && computer === 'paper')
      ) {
        result = '🎉 You Win!'
        newScores.player++
      } else {
        result = '🤖 Computer Wins!'
        newScores.computer++
      }

      setWinner(result)
      setScores(newScores)
      saveScores(newScores.player, newScores.computer)
      incrementGameCount()
      setPlaying(false)
    }, 1500)
  }

  const resetScores = () => {
    setScores({ player: 0, computer: 0 })
    saveScores(0, 0)
  }

  return (
    <GameModal title="✂️ Rock Paper Scissors" onClose={onClose}>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between">
          <span>You: {scores.player}</span>
          <span>Computer: {scores.computer}</span>
        </div>
        <div className="flex justify-center gap-4">
          {['rock', 'paper', 'scissors'].map((choice) => (
            <div
              key={choice}
              onClick={() => playRound(choice)}
              className="px-8 py-4 bg-gradient-primary rounded-xl text-white text-lg font-semibold cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-xl"
            >
              {choice === 'rock' ? '🪨' : choice === 'paper' ? '📄' : '✂️'} {choice.charAt(0).toUpperCase() + choice.slice(1)}
            </div>
          ))}
        </div>
        <div className="flex justify-center items-center gap-8">
          <div className="text-6xl">{playerChoice}</div>
          <div className="text-2xl font-bold text-primary">VS</div>
          <div className="text-6xl">{computerChoice}</div>
        </div>
        <div className="text-center text-2xl font-bold text-primary min-h-[30px]">{winner}</div>
        <button
          onClick={resetScores}
          className="py-3 px-8 bg-gradient-primary text-white border-none rounded-full text-base font-semibold cursor-pointer transition-all duration-300 shadow-lg hover:-translate-y-1 hover:shadow-xl mx-auto"
        >
          Reset Score
        </button>
      </div>
    </GameModal>
  )
}

