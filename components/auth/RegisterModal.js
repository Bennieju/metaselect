'use client'

import { useState } from 'react'
import { X, Mail, Lock, Eye, EyeOff, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }) {
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Validate form
      if (!formData.firstName || !formData.email || !formData.password) {
        setError('Please fill in all required fields')
        return
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        return
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long')
        return
      }

      const result = await register(formData.email, formData.password, formData.firstName, formData.lastName)
      
      if (result.success) {
        onClose()
        window.location.reload()
      } else {
        setError(result.error || 'Registration failed. Please try again.')
      }
    } catch (error) {
      setError('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    })
    setShowPassword(false)
    setShowConfirmPassword(false)
    setError('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="custom-modal-overlay">
      <div className="custom-modal">
        <div className="custom-modal-header">
          <h2 className="custom-font-bold">Create Account</h2>
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

          <div className="custom-input-group">
            <label className="custom-input-label">First Name *</label>
            <div className="custom-input-wrapper">
              <User size={16} className="custom-input-icon" />
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="custom-input"
                placeholder="Enter your first name"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="custom-input-group">
            <label className="custom-input-label">Last Name</label>
            <div className="custom-input-wrapper">
              <User size={16} className="custom-input-icon" />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="custom-input"
                placeholder="Enter your last name"
                disabled={loading}
              />
            </div>
          </div>

          <div className="custom-input-group">
            <label className="custom-input-label">Email *</label>
            <div className="custom-input-wrapper">
              <Mail size={16} className="custom-input-icon" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="custom-input"
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="custom-input-group">
            <label className="custom-input-label">Password *</label>
            <div className="custom-input-wrapper">
              <Lock size={16} className="custom-input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
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

          <div className="custom-input-group">
            <label className="custom-input-label">Confirm Password *</label>
            <div className="custom-input-wrapper">
              <Lock size={16} className="custom-input-icon" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="custom-input"
                placeholder="Confirm your password"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="custom-input-toggle"
                disabled={loading}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <Button type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>

          <div className="custom-modal-footer">
            <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
              Already have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="custom-link"
                disabled={loading}
              >
                Sign in
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
