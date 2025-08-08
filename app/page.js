'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import LoginModal from '@/components/auth/LoginModal'
import RegisterModal from '@/components/auth/RegisterModal'
import Dashboard from '@/components/dashboard/Dashboard'

export default function Home() {
  const { user } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)

  // If user is authenticated, show dashboard
  if (user) {
    return <Dashboard />
  }

  // If user is not authenticated, show auth prompt
  return (
    <div className="custom-container">
      <div className="custom-flex-center" style={{ minHeight: '100vh' }}>
        <div className="custom-card" style={{ maxWidth: '400px', textAlign: 'center' }}>
          <h1 className="custom-font-bold custom-mb-4" style={{ fontSize: '32px' }}>
            Welcome to MetaSelect AI
          </h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
            Advanced breast cancer classification powered by AI
          </p>
          <div className="custom-flex-col">
            <Button onClick={() => setShowLoginModal(true)} style={{ width: '100%' }}>
              Sign In
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => setShowRegisterModal(true)}
              style={{ width: '100%' }}
            >
              Create Account
            </Button>
          </div>
        </div>
      </div>

      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={() => {
          setShowLoginModal(false)
          setShowRegisterModal(true)
        }}
      />

      <RegisterModal 
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={() => {
          setShowRegisterModal(false)
          setShowLoginModal(true)
        }}
      />
    </div>
  )
}
