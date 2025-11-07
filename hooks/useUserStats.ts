'use client'

import { useState, useEffect } from 'react'

export function useUserStats() {
  const [stats, setStats] = useState({ games: 0, achievements: 0, streak: 1 })

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const currentUser = localStorage.getItem('currentUser')
    if (!currentUser) return
    
    const user = JSON.parse(currentUser)
    const userEmail = user.email
    const userStatsKey = `userStats_${userEmail}`
    
    const storedStats = JSON.parse(localStorage.getItem(userStatsKey) || '{}')
    const initialStats = {
      games: storedStats.games || 0,
      achievements: storedStats.achievements || 0,
      streak: storedStats.streak || 1
    }
    
    setStats(initialStats)
    updateDayStreak(userEmail)
  }, [])

  const updateDayStreak = (userEmail: string) => {
    const userStatsKey = `userStats_${userEmail}`
    const stats = JSON.parse(localStorage.getItem(userStatsKey) || '{}')
    
    const today = new Date().toDateString()
    const lastDate = stats.lastPlayDate ? new Date(stats.lastPlayDate).toDateString() : null
    
    if (lastDate === today) return
    
    if (lastDate) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toDateString()
      
      if (lastDate === yesterdayStr) {
        stats.streak = (stats.streak || 1) + 1
      } else {
        stats.streak = 1
      }
    }
    
    stats.lastPlayDate = new Date().toISOString()
    localStorage.setItem(userStatsKey, JSON.stringify(stats))
    setStats(prev => ({ ...prev, streak: stats.streak }))
  }

  const incrementGameCount = () => {
    if (typeof window === 'undefined') return
    
    const currentUser = localStorage.getItem('currentUser')
    if (!currentUser) return
    
    const user = JSON.parse(currentUser)
    const userEmail = user.email
    const userStatsKey = `userStats_${userEmail}`
    const storedStats = JSON.parse(localStorage.getItem(userStatsKey) || '{}')
    
    storedStats.games = (storedStats.games || 0) + 1
    localStorage.setItem(userStatsKey, JSON.stringify(storedStats))
    setStats(prev => ({ ...prev, games: storedStats.games }))
    
    checkAchievements(userEmail, storedStats)
  }

  const checkAchievements = (userEmail: string, statsData: any) => {
    const achievements = []
    if (statsData.games >= 1) achievements.push('First Game!')
    if (statsData.games >= 10) achievements.push('10 Games Played!')
    if (statsData.games >= 50) achievements.push('50 Games Master!')
    if (statsData.streak >= 7) achievements.push('Week Warrior!')
    if (statsData.streak >= 30) achievements.push('Monthly Champion!')
    
    const userStatsKey = `userStats_${userEmail}`
    const storedStats = JSON.parse(localStorage.getItem(userStatsKey) || '{}')
    
    storedStats.achievements = achievements.length
    localStorage.setItem(userStatsKey, JSON.stringify(storedStats))
    setStats(prev => ({ ...prev, achievements: achievements.length }))
  }

  return { stats, incrementGameCount }
}

