'use client'

import { useState, useEffect } from 'react'
import GameModal from './GameModal'

interface HistoryModalProps {
  onClose: () => void
}

export default function HistoryModal({ onClose }: HistoryModalProps) {
  const [stats, setStats] = useState<any>({})
  const [activities, setActivities] = useState<any[]>([])

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const currentUser = localStorage.getItem('currentUser')
    if (!currentUser) return
    
    const user = JSON.parse(currentUser)
    const userEmail = user.email
    const userStatsKey = `userStats_${userEmail}`
    const statsData = JSON.parse(localStorage.getItem(userStatsKey) || '{}')
    setStats(statsData)

    const activitiesKey = `activities_${userEmail}`
    const activitiesData = JSON.parse(localStorage.getItem(activitiesKey) || '[]')
    setActivities(activitiesData.slice(0, 10))
  }, [])

  const getGameScore = (gameType: string, type: string) => {
    if (typeof window === 'undefined') return 0
    const currentUser = localStorage.getItem('currentUser')
    if (!currentUser) return 0
    
    const user = JSON.parse(currentUser)
    const scoresKey = `${gameType}_scores_${user.email}`
    const scores = JSON.parse(localStorage.getItem(scoresKey) || '{}')
    return scores[type] || 0
  }

  return (
    <GameModal title="📊 Game History" onClose={onClose}>
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-5">
          <div className="bg-primary/10 p-5 rounded-xl">
            <h3 className="text-xl font-bold text-primary mb-3">📊 Overall Stats</h3>
            <p>Games Played: <strong>{stats.games || 0}</strong></p>
            <p>Achievements: <strong>{stats.achievements || 0}</strong></p>
            <p>Day Streak: <strong>{stats.streak || 1}</strong></p>
          </div>
          <div className="bg-primary/10 p-5 rounded-xl">
            <h3 className="text-xl font-bold text-primary mb-3">🎮 Game Scores</h3>
            <p>Tic-Tac-Toe Wins: <strong>{getGameScore('tictactoe', 'player')}</strong></p>
            <p>Rock Paper Scissors Wins: <strong>{getGameScore('rps', 'player')}</strong></p>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold text-primary mb-3">📜 Recent Game Activities</h3>
          {activities.length === 0 ? (
            <p>No game activities yet. Start playing games!</p>
          ) : (
            <div className="flex flex-col gap-3">
              {activities.map((activity, idx) => (
                <div key={idx} className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl">
                  <i className={`fas ${activity.icon || 'fa-info-circle'} text-primary text-xl`}></i>
                  <div>
                    <p className="font-bold m-0">{activity.message}</p>
                    <span className="text-sm text-gray-600">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </GameModal>
  )
}

