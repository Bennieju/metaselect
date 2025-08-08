'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { 
  Upload, FileText, Target, Download, RefreshCw, AlertCircle, 
  LogOut, User, Settings, BarChart3, Activity, Shield, 
  TrendingUp, Clock, CheckCircle, XCircle, Info, Share
} from 'lucide-react'
import { api } from '@/lib/api'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [selectedFile, setSelectedFile] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState(null)
  const [apiStatus, setApiStatus] = useState({ connected: false, loading: true })
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('upload')
  const [analysisHistory, setAnalysisHistory] = useState([])

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  useEffect(() => {
    checkApiStatus()
    loadAnalysisHistory()
  }, [])

  const checkApiStatus = async () => {
    try {
      const health = await api.healthCheck()
      setApiStatus({ connected: health.status === 'healthy', loading: false })
    } catch (error) {
      setApiStatus({ connected: false, loading: false })
      console.error('API connection failed:', error)
    }
  }

  const loadAnalysisHistory = () => {
    const history = localStorage.getItem('analysis_history')
    if (history) {
      try {
        setAnalysisHistory(JSON.parse(history))
      } catch (error) {
        console.error('Error loading analysis history:', error)
      }
    }
  }

  const handleAnalyze = async () => {
    if (!selectedFile) return
    
    setIsAnalyzing(true)
    setError(null)
    
    try {
      const predictionResults = await api.predictImage(selectedFile)
      setResults(predictionResults)
      
      // Save to history
      const newAnalysis = {
        id: Date.now(),
        fileName: selectedFile.name,
        timestamp: new Date().toISOString(),
        prediction: predictionResults.prediction,
        confidence: predictionResults.confidence,
        results: predictionResults
      }
      
      const updatedHistory = [newAnalysis, ...analysisHistory.slice(0, 9)] // Keep last 10
      setAnalysisHistory(updatedHistory)
      localStorage.setItem('analysis_history', JSON.stringify(updatedHistory))
      
      // Switch to results tab after successful analysis
      setActiveTab('results')
    } catch (error) {
      setError(error.message || 'Analysis failed. Please try again.')
      console.error('Prediction error:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleLogout = () => {
    logout()
  }

  const handleDownloadReport = () => {
    if (!results) return
    
    // Create a simple report
    const report = `
MetaSelect AI - Analysis Report
==============================

File: ${selectedFile?.name}
Date: ${new Date().toLocaleString()}
Prediction: ${results.prediction}
Confidence: ${(results.confidence * 100).toFixed(1)}%

${results.explanations ? 'AI Explanations:\n' + results.explanations.map(e => `- ${e.title}: ${e.description}`).join('\n') : ''}
    `.trim()
    
    const blob = new Blob([report], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analysis-report-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleShareResults = () => {
    if (!results) return
    
    const shareText = `MetaSelect AI Analysis Results:
Prediction: ${results.prediction}
Confidence: ${(results.confidence * 100).toFixed(1)}%`
    
    if (navigator.share) {
      navigator.share({
        title: 'MetaSelect AI Analysis',
        text: shareText
      })
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Results copied to clipboard!')
      })
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Benign': return '#10b981'
      case 'Malignant': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Benign': return <CheckCircle size={16} style={{ color: '#10b981' }} />
      case 'Malignant': return <XCircle size={16} style={{ color: '#ef4444' }} />
      default: return <Info size={16} style={{ color: '#6b7280' }} />
    }
  }

  return (
    <div className="custom-container">
      {/* Header */}
      <header className="custom-header">
        <div className="custom-nav">
          <div className="custom-flex">
            <div className="custom-flex">
              <div className="custom-card custom-p-4" style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#111827', fontWeight: 'bold', fontSize: '18px' }}>M</span>
              </div>
              <span className="custom-font-bold" style={{ fontSize: '20px', marginLeft: '8px' }}>MetaSelect AI</span>
            </div>
            <nav className="custom-flex">
              <button 
                onClick={() => setActiveTab('upload')}
                className={`custom-nav-link ${activeTab === 'upload' ? 'custom-nav-active' : ''}`}
              >
                <Upload size={16} style={{ marginRight: '8px' }} />
                Upload
              </button>
              {results && (
                <button 
                  onClick={() => setActiveTab('results')}
                  className={`custom-nav-link ${activeTab === 'results' ? 'custom-nav-active' : ''}`}
                >
                  <Activity size={16} style={{ marginRight: '8px' }} />
                  Results
                </button>
              )}
              <button 
                onClick={() => setActiveTab('history')}
                className={`custom-nav-link ${activeTab === 'history' ? 'custom-nav-active' : ''}`}
              >
                <Clock size={16} style={{ marginRight: '8px' }} />
                History
              </button>
              <button 
                onClick={() => setActiveTab('analytics')}
                className={`custom-nav-link ${activeTab === 'analytics' ? 'custom-nav-active' : ''}`}
              >
                <BarChart3 size={16} style={{ marginRight: '8px' }} />
                Analytics
              </button>
            </nav>
          </div>
          <div className="custom-flex">
            <div className="custom-flex" style={{ marginRight: '16px' }}>
              <User size={16} style={{ color: 'var(--text-muted)' }} />
              <span style={{ color: '#d1d5db', fontSize: '14px' }}>
                {user.firstName} {user.lastName}
                {user.role === 'admin' && <span style={{ color: '#f59e0b', marginLeft: '8px' }}>(Admin)</span>}
              </span>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="custom-p-8">
        {/* API Status Indicator */}
        {!apiStatus.loading && (
          <div className={`custom-card custom-mb-4 custom-flex ${
            apiStatus.connected ? 'custom-status-success' : 'custom-status-error'
          }`}>
            {apiStatus.connected ? (
              <>
                <div style={{ width: '12px', height: '12px', backgroundColor: '#10b981', borderRadius: '50%' }}></div>
                <span>API Connected - Ready for Analysis</span>
              </>
            ) : (
              <>
                <AlertCircle style={{ width: '16px', height: '16px', color: '#ef4444' }} />
                <span>API Disconnected - Please check backend server</span>
              </>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="custom-card custom-mb-4 custom-status-error">
            <div className="custom-flex">
              <AlertCircle style={{ width: '20px', height: '20px', color: '#ef4444' }} />
              <span style={{ color: '#ef4444' }}>{error}</span>
            </div>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'upload' && (
          <div className="custom-grid">
            <div className="custom-card">
              <h2 className="custom-font-bold custom-mb-4" style={{ fontSize: '24px' }}>
                <Target style={{ width: '24px', height: '24px', marginRight: '12px', display: 'inline' }} />
                Upload Image for Analysis
              </h2>
              <div className="custom-flex-col">
                <div className="custom-upload-area">
                  <div className="custom-text-center">
                    <Upload style={{ width: '48px', height: '48px', margin: '0 auto 16px', color: '#9ca3af' }} />
                    <p style={{ color: '#9ca3af', marginBottom: '16px' }}>
                      Drag and drop your breast tissue image here, or click to browse
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="custom-input"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
                
                {selectedFile && (
                  <div className="custom-card">
                    <div className="custom-flex">
                      <FileText style={{ width: '20px', height: '20px', color: '#4ade80' }} />
                      <span>{selectedFile.name}</span>
                    </div>
                  </div>
                )}
                
                <Button 
                  onClick={handleAnalyze}
                  disabled={!selectedFile || isAnalyzing || !apiStatus.connected}
                  style={{ width: '100%' }}
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="custom-spinner" style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Target style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                      Analyze Image
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Quick Results Preview */}
            {results && (
              <div className="custom-card">
                <h2 className="custom-font-bold custom-mb-4" style={{ fontSize: '24px' }}>
                  <Activity style={{ width: '24px', height: '24px', marginRight: '12px', display: 'inline' }} />
                  Latest Results
                </h2>
                <div className="custom-card custom-status-success">
                  <div className="custom-text-center">
                    <h3 className="custom-font-bold custom-mb-2">Prediction</h3>
                    <p style={{ fontSize: '32px', fontWeight: 'bold', color: getStatusColor(results.prediction) }}>
                      {results.prediction}
                    </p>
                    <p style={{ color: '#9ca3af' }}>
                      Confidence: {(results.confidence * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={() => setActiveTab('results')}
                  style={{ width: '100%', marginTop: '16px' }}
                >
                  View Full Results
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'results' && results && (
          <div className="custom-card">
            <h2 className="custom-font-bold custom-mb-4" style={{ fontSize: '24px' }}>
              <Activity style={{ width: '24px', height: '24px', marginRight: '12px', display: 'inline' }} />
              Analysis Results
            </h2>
            <div className="custom-flex-col">
              <div className="custom-card custom-status-success">
                <div className="custom-text-center">
                  <h3 className="custom-font-bold custom-mb-2">Prediction</h3>
                  <p style={{ fontSize: '32px', fontWeight: 'bold', color: getStatusColor(results.prediction) }}>
                    {results.prediction}
                  </p>
                  <p style={{ color: '#9ca3af' }}>
                    Confidence: {(results.confidence * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
              
              {results.explanations && (
                <div className="custom-card">
                  <h3 className="custom-font-bold custom-mb-2">AI Explanations</h3>
                  <div className="custom-flex-col">
                    {results.explanations.map((explanation, index) => (
                      <div key={index} className="custom-card" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                        <p style={{ fontWeight: '600', marginBottom: '8px' }}>{explanation.title}</p>
                        <p style={{ color: '#9ca3af', fontSize: '14px' }}>{explanation.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="custom-flex">
                <Button variant="secondary" onClick={handleDownloadReport} style={{ flex: 1 }}>
                  <Download style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                  Download Report
                </Button>
                <Button variant="secondary" onClick={handleShareResults} style={{ flex: 1 }}>
                  <Share style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                  Share Results
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="custom-card">
            <h2 className="custom-font-bold custom-mb-4" style={{ fontSize: '24px' }}>
              <Clock style={{ width: '24px', height: '24px', marginRight: '12px', display: 'inline' }} />
              Analysis History
            </h2>
            {analysisHistory.length === 0 ? (
              <div className="custom-text-center" style={{ padding: '40px' }}>
                <Clock style={{ width: '48px', height: '48px', margin: '0 auto 16px', color: '#9ca3af' }} />
                <p style={{ color: '#9ca3af' }}>No analysis history yet. Upload an image to get started.</p>
              </div>
            ) : (
              <div className="custom-flex-col">
                {analysisHistory.map((analysis) => (
                  <div key={analysis.id} className="custom-card">
                    <div className="custom-flex-between">
                      <div className="custom-flex">
                        {getStatusIcon(analysis.prediction)}
                        <div>
                          <p style={{ fontWeight: '600' }}>{analysis.fileName}</p>
                          <p style={{ color: '#9ca3af', fontSize: '14px' }}>
                            {new Date(analysis.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="custom-flex">
                        <span style={{ 
                          color: getStatusColor(analysis.prediction),
                          fontWeight: '600',
                          marginRight: '16px'
                        }}>
                          {analysis.prediction}
                        </span>
                        <span style={{ color: '#9ca3af' }}>
                          {(analysis.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="custom-grid">
            <div className="custom-card">
              <h2 className="custom-font-bold custom-mb-4" style={{ fontSize: '24px' }}>
                <TrendingUp style={{ width: '24px', height: '24px', marginRight: '12px', display: 'inline' }} />
                Analysis Statistics
              </h2>
              <div className="custom-flex-col">
                <div className="custom-card" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                  <div className="custom-text-center">
                    <h3 style={{ color: '#10b981', fontSize: '32px', fontWeight: 'bold' }}>
                      {analysisHistory.length}
                    </h3>
                    <p style={{ color: '#9ca3af' }}>Total Analyses</p>
                  </div>
                </div>
                
                <div className="custom-card" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                  <div className="custom-text-center">
                    <h3 style={{ color: '#ef4444', fontSize: '32px', fontWeight: 'bold' }}>
                      {analysisHistory.filter(a => a.prediction === 'Malignant').length}
                    </h3>
                    <p style={{ color: '#9ca3af' }}>Malignant Cases</p>
                  </div>
                </div>
                
                <div className="custom-card" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                  <div className="custom-text-center">
                    <h3 style={{ color: '#10b981', fontSize: '32px', fontWeight: 'bold' }}>
                      {analysisHistory.filter(a => a.prediction === 'Benign').length}
                    </h3>
                    <p style={{ color: '#9ca3af' }}>Benign Cases</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="custom-card">
              <h2 className="custom-font-bold custom-mb-4" style={{ fontSize: '24px' }}>
                <Shield style={{ width: '24px', height: '24px', marginRight: '12px', display: 'inline' }} />
                System Information
              </h2>
              <div className="custom-flex-col">
                <div className="custom-card">
                  <h3 className="custom-font-bold custom-mb-2">User Information</h3>
                  <div className="custom-flex-col">
                    <div className="custom-flex-between">
                      <span style={{ color: '#9ca3af' }}>Name:</span>
                      <span>{user.firstName} {user.lastName}</span>
                    </div>
                    <div className="custom-flex-between">
                      <span style={{ color: '#9ca3af' }}>Email:</span>
                      <span>{user.email}</span>
                    </div>
                    <div className="custom-flex-between">
                      <span style={{ color: '#9ca3af' }}>Role:</span>
                      <span style={{ textTransform: 'capitalize' }}>{user.role}</span>
                    </div>
                    <div className="custom-flex-between">
                      <span style={{ color: '#9ca3af' }}>Member Since:</span>
                      <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
