'use client'

import { useState } from 'react'
import { X, Mail, Lock, Eye, EyeOff, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginModal({ isOpen, onClose, onSwitchToRegister }) {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await login(email, password)
      if (result.success) {
        onClose()
        // Don't reload the page, let React handle the state change
        window.location.reload()
      } else {
        setError(result.error || 'Login failed. Please try again.')
      }
    } catch (error) {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fillDemoCredentials = () => {
    setEmail('demo@metaselect.com')
    setPassword('demo123')
    setError('') // Clear any previous errors
  }

  const fillAdminCredentials = () => {
    setEmail('admin@metaselect.com')
    setPassword('admin123')
    setError('') // Clear any previous errors
  }

  const handleClose = () => {
    setEmail('')
    setPassword('')
    setError('')
    setShowPassword(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="custom-modal-overlay">
      <div className="custom-modal">
        <div className="custom-modal-header">
          <h2 className="custom-font-bold">Sign In</h2>
          <button onClick={handleClose} className="custom-modal-close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="custom-modal-content">
          {error && (
            <div className="custom-card custom-mb-4 custom-status-error">
              <span>{error}</span>
            </div>
          )}

          {/* Demo Credentials Info */}
          <div className="custom-card custom-mb-4" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', borderColor: '#3b82f6' }}>
            <div className="custom-flex">
              <Info size={16} style={{ color: '#3b82f6' }} />
              <span style={{ fontSize: '14px', color: '#3b82f6' }}>Demo Credentials Available</span>
            </div>
            <div className="custom-flex-col custom-mt-2" style={{ gap: '8px' }}>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="custom-link"
                style={{ fontSize: '12px', textAlign: 'left' }}
              >
                Demo User: demo@metaselect.com / demo123
              </button>
              <button
                type="button"
                onClick={fillAdminCredentials}
                className="custom-link"
                style={{ fontSize: '12px', textAlign: 'left' }}
              >
                Admin User: admin@metaselect.com / admin123
              </button>
            </div>
          </div>

          <div className="custom-input-group">
            <label className="custom-input-label">Email</label>
            <div className="custom-input-wrapper">
              <Mail size={16} className="custom-input-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="custom-input"
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="custom-input-group">
            <label className="custom-input-label">Password</label>
            <div className="custom-input-wrapper">
              <Lock size={16} className="custom-input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="custom-input"
                placeholder="Enter your password"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="custom-input-toggle"
                disabled={loading}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <Button type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>

          <div className="custom-modal-footer">
            <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="custom-link"
                disabled={loading}
              >
                Sign up
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
