'use client'

import { useState, useEffect } from 'react'
import GameModal from './GameModal'

interface QuizModalProps {
  onClose: () => void
  saveActivity: (message: string, icon: string) => void
  incrementGameCount: () => void
}

const allQuestions = [
  { question: "What is the capital of France?", options: ["London", "Berlin", "Paris", "Madrid"], correct: 2 },
  { question: "How many continents are there?", options: ["5", "6", "7", "8"], correct: 2 },
  { question: "What is 15 × 3?", options: ["35", "40", "45", "50"], correct: 2 },
  { question: "What is the largest planet in our solar system?", options: ["Earth", "Mars", "Jupiter", "Saturn"], correct: 2 },
  { question: "What year did World War II end?", options: ["1943", "1944", "1945", "1946"], correct: 2 },
  { question: "Which ocean is the largest?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], correct: 3 },
  { question: "How many legs does a spider have?", options: ["6", "8", "10", "12"], correct: 1 },
  { question: "What is the fastest land animal?", options: ["Lion", "Cheetah", "Tiger", "Leopard"], correct: 1 },
  { question: "What is the chemical symbol for gold?", options: ["Go", "Gd", "Au", "Ag"], correct: 2 },
  { question: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Mercury"], correct: 1 }
]

export default function QuizModal({ onClose, saveActivity, incrementGameCount }: QuizModalProps) {
  const [questions, setQuestions] = useState<any[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  useEffect(() => {
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5).slice(0, 5)
    setQuestions(shuffled)
  }, [])

  const selectAnswer = (index: number) => {
    if (answered) return
    setAnswered(true)
    setSelectedIndex(index)

    if (index === questions[currentQuestion].correct) {
      setScore(score + 1)
    }
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setAnswered(false)
      setSelectedIndex(null)
    } else {
      const percentage = Math.round((score / questions.length) * 100)
      saveActivity(`❓ Quiz completed: ${score}/${questions.length} correct!`, 'fa-trophy')
      incrementGameCount()
      setTimeout(() => onClose(), 3000)
    }
  }

  if (questions.length === 0) return null

  const question = questions[currentQuestion]

  return (
    <GameModal title="❓ Trivia Quiz" onClose={onClose}>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between">
          <p>Question {currentQuestion + 1}/{questions.length}</p>
          <p>Score: {score}/{questions.length}</p>
        </div>
        <div className="text-2xl font-bold text-primary mb-5">{question.question}</div>
        <div className="flex flex-col gap-3">
          {question.options.map((option: string, index: number) => (
            <button
              key={index}
              onClick={() => selectAnswer(index)}
              disabled={answered}
              className={`p-4 text-left rounded-xl border-2 transition-all duration-300 ${
                answered && index === question.correct
                  ? 'bg-green-500 text-white border-green-600'
                  : answered && index === selectedIndex && index !== question.correct
                  ? 'bg-red-500 text-white border-red-600'
                  : 'bg-background-light border-primary/20 hover:bg-primary/10 hover:border-primary'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        {answered && (
          <button
            onClick={nextQuestion}
            className="py-3 px-8 bg-gradient-primary text-white border-none rounded-full text-base font-semibold cursor-pointer transition-all duration-300 shadow-lg hover:-translate-y-1 hover:shadow-xl mx-auto"
          >
            {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}
          </button>
        )}
      </div>
    </GameModal>
  )
}

