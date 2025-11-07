'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import AuthContainer from '@/components/AuthContainer'
import LandingPage from '@/components/LandingPage'
import Footer from '@/components/Footer'
import { loadUsers } from '@/utils/userUtils'

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('Player')

  useEffect(() => {
    // Load seed users from db.json
    loadUsers()
    
    // Check if user is already logged in
    if (typeof window !== 'undefined') {
      const currentUser = localStorage.getItem('currentUser')
      if (currentUser) {
        const user = JSON.parse(currentUser)
        const userData = localStorage.getItem(user.email)
        if (userData) {
          const userInfo = JSON.parse(userData)
          setUsername(userInfo.username)
          setIsLoggedIn(true)
        }
      }
    }
  }, [])

  const handleLogin = (userUsername: string) => {
    setUsername(userUsername)
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser')
    }
    setIsLoggedIn(false)
  }

  const handleNavigation = (section: string) => {
    // Navigation is handled in the Navbar component
    console.log(`Navigating to ${section}`)
  }

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} onNavigate={handleNavigation} />
      <main className="flex-1 pt-20">
        {!isLoggedIn ? (
          <AuthContainer onLogin={handleLogin} />
        ) : (
          <LandingPage username={username} onLogout={handleLogout} />
        )}
      </main>
      <Footer />
    </>
  )
}

