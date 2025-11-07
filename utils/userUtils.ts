export const loadUsers = async () => {
  if (typeof window === 'undefined') return
  
  try {
    const response = await fetch('/db.json')
    const data = await response.json()
    data.users.forEach((user: any) => {
      if (!localStorage.getItem(user.email)) {
        localStorage.setItem(user.email, JSON.stringify({
          username: user.username,
          password: user.password
        }))
      }
    })
  } catch (error) {
    console.error('Error loading users from db.json:', error)
  }
}

export const getAllUsersFromLocalStorage = () => {
  if (typeof window === 'undefined') return []
  
  const users: any[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.includes('@')) {
      const user = JSON.parse(localStorage.getItem(key) || '{}')
      users.push({
        email: key,
        username: user.username,
        password: user.password
      })
    }
  }
  return users
}

