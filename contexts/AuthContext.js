'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

// Dummy users for testing
const DUMMY_USERS = [
  {
    id: '1',
    email: 'demo@metaselect.com',
    password: 'demo123',
    firstName: 'Demo',
    lastName: 'User',
    role: 'user',
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: '2',
    email: 'admin@metaselect.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00.000Z'
  }
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing user session in localStorage
    const savedUser = localStorage.getItem('metaselect_user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error parsing saved user:', error)
        localStorage.removeItem('metaselect_user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      // Check against dummy users
      const dummyUser = DUMMY_USERS.find(u => u.email === email && u.password === password)
      
      if (dummyUser) {
        const userData = {
          id: dummyUser.id,
          email: dummyUser.email,
          firstName: dummyUser.firstName,
          lastName: dummyUser.lastName,
          role: dummyUser.role,
          createdAt: dummyUser.createdAt
        }
        
        setUser(userData)
        localStorage.setItem('metaselect_user', JSON.stringify(userData))
        return { success: true }
      } else {
        // For demo purposes, also accept any email/password combination
        const userData = {
          id: Date.now().toString(),
          email,
          firstName: email.split('@')[0],
          lastName: '',
          role: 'user',
          createdAt: new Date().toISOString()
        }
        
        setUser(userData)
        localStorage.setItem('metaselect_user', JSON.stringify(userData))
        return { success: true }
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const register = async (email, password, firstName, lastName) => {
    try {
      // Validate form
      if (!email || !password || !firstName) {
        throw new Error('Email, password, and first name are required')
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long')
      }

      // Check if user already exists
      const existingUser = DUMMY_USERS.find(u => u.email === email)
      if (existingUser) {
        throw new Error('User with this email already exists')
      }

      const userData = {
        id: Date.now().toString(),
        email,
        firstName,
        lastName: lastName || '',
        role: 'user',
        createdAt: new Date().toISOString()
      }
      
      setUser(userData)
      localStorage.setItem('metaselect_user', JSON.stringify(userData))
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('metaselect_user')
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    dummyUsers: DUMMY_USERS
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
