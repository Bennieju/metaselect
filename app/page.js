'use client'

import { useState, useEffect } from 'react'
import { useUser, SignOutButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Upload, FileText, ArrowRight, Target, Plus, ArrowLeft, Download, RefreshCw, AlertCircle } from 'lucide-react'
import AuthWrapper from '@/components/auth-wrapper'
import { api } from '@/lib/api'

export default function Home() {
  const { user } = useUser()
  const [selectedFile, setSelectedFile] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState(null)
  const [apiStatus, setApiStatus] = useState({ connected: false, loading: true })
  const [error, setError] = useState(null)

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  // Check API status on component mount
  useEffect(() => {
    checkApiStatus()
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

  const handleAnalyze = async () => {
    if (!selectedFile) return
    
    setIsAnalyzing(true)
    setError(null)
    
    try {
      const predictionResults = await api.predictImage(selectedFile)
      setResults(predictionResults)
    } catch (error) {
      setError(error.message || 'Analysis failed. Please try again.')
      console.error('Prediction error:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gray-900">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                    <span className="text-gray-900 font-bold text-lg">M</span>
                  </div>
                  <span className="text-white font-bold text-xl">MOBLLE</span>
                </div>
                <nav className="hidden md:flex space-x-8">
                  <a href="#" className="text-white border-b-2 border-green-400 pb-1">Home</a>
                  <a href="#" className="text-gray-300 hover:text-white">Models</a>
                  <a href="#" className="text-gray-300 hover:text-white">Documentation</a>
                </nav>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-300">Welcome, {user?.firstName || user?.emailAddresses[0]?.emailAddress}</span>
                <Button variant="ghost" className="text-white">
                  Results
                </Button>
                <Button className="bg-black text-white hover:bg-gray-800">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <SignOutButton>
                  <Button variant="outline" className="text-white border-gray-600 hover:bg-gray-700">
                    Sign Out
                  </Button>
                </SignOutButton>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* API Status Indicator */}
          {!apiStatus.loading && (
            <div className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
              apiStatus.connected 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              <div className={`w-3 h-3 rounded-full ${
                apiStatus.connected ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className="text-sm font-medium">
                {apiStatus.connected ? 'API Connected' : 'API Disconnected'}
              </span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-800">{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2">
              <h1 className="text-4xl font-bold text-white mb-8">
                Breast Cancer<br />Classification
              </h1>
              
              {/* Upload Panel */}
              <div className="glass-dark rounded-2xl p-8 gradient-panel">
                <h2 className="text-2xl font-semibold text-white mb-6">Upload image</h2>
                
                <div className="glass rounded-xl p-6 mb-6">
                  <div className="flex items-center justify-center space-x-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-6 h-6 text-white" />
                      <div className="w-8 h-1 bg-white rounded-full"></div>
                      <ArrowRight className="w-6 h-6 text-white" />
                      <div className="w-8 h-1 bg-white rounded-full"></div>
                      <Target className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileSelect}
                    />
                    <label htmlFor="file-upload">
                      <Button className="bg-white text-gray-900 hover:bg-gray-100">
                        <Upload className="w-4 h-4 mr-2" />
                        Browse
                      </Button>
                    </label>
                    {selectedFile && (
                      <p className="text-white mt-2 text-sm">{selectedFile.name}</p>
                    )}
                  </div>
                </div>
                
                <div className="text-center">
                  <Button 
                    className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 text-lg"
                    onClick={handleAnalyze}
                    disabled={!selectedFile || isAnalyzing || !apiStatus.connected}
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Classify'}
                  </Button>
                  {!apiStatus.connected && !apiStatus.loading && (
                    <p className="text-red-400 text-sm mt-2">API not connected. Please start the backend server.</p>
                  )}
                </div>
                
                {/* Navigation Dots */}
                <div className="flex justify-center space-x-2 mt-6">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full flex items-center justify-center">
                    <Plus className="w-2 h-2 text-white" />
                  </div>
                  <div className="w-3 h-3 bg-gray-500 rounded-full flex items-center justify-center">
                    <ArrowLeft className="w-2 h-2 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Results */}
            <div className="space-y-6">
              {/* Probability Panel */}
              {results && (
                <div className="bg-white rounded-xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Probability: {results.probability}%</h3>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-4xl font-bold text-gray-900">{results.probability}%</span>
                    <div className={`rounded-lg px-3 py-1 ${
                      results.diagnosis === 'Malignant' 
                        ? 'bg-purple-100' 
                        : 'bg-green-100'
                    }`}>
                      <p className={`text-sm font-medium ${
                        results.diagnosis === 'Malignant' 
                          ? 'text-purple-800' 
                          : 'text-green-800'
                      }`}>
                        {results.diagnosis === 'Malignant' ? 'POSITIVE' : 'NEGATIVE'}
                      </p>
                      <p className={`text-xs ${
                        results.diagnosis === 'Malignant' 
                          ? 'text-purple-600' 
                          : 'text-green-600'
                      }`}>
                        {results.diagnosis}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Diagnosis Panel */}
              {results && (
                <div className="bg-white rounded-xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Diagnosis: {results.diagnosis}</h3>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="space-y-3">
                    <div className="w-full h-2 bg-gradient-to-r from-black via-yellow-400 to-red-500 rounded-full"></div>
                    <p className="text-sm text-gray-600">
                      <span className={`font-medium ${
                        results.diagnosis === 'Malignant' 
                          ? 'text-purple-600' 
                          : 'text-green-600'
                      }`}>
                        {results.diagnosis}
                      </span> tissue detected
                    </p>
                    <div className="w-full h-2 bg-gray-300 rounded-full"></div>
                    <p className="text-sm text-gray-600">
                      {results.diagnosis === 'Malignant' ? 'Benign' : 'Malignant'} probability: {results.diagnosis === 'Malignant' ? results.benign_probability : results.malignant_probability}%
                    </p>
                  </div>
                </div>
              )}

              {/* XAI Explanation Panel */}
              {results && (
                <div className="bg-gray-800 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white">XAI Explanation</h3>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="relative">
                    <div className="w-full h-48 bg-gray-700 rounded-lg flex items-center justify-center">
                      <div className="relative">
                        <div className="w-32 h-32 bg-gray-600 rounded-lg"></div>
                        <div className="absolute inset-0 rounded-lg border-4 border-yellow-400"></div>
                        <div className="absolute inset-2 rounded-lg border-2 border-orange-400"></div>
                        <div className="absolute inset-4 rounded-lg border border-purple-400"></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-sm text-gray-300">Heat map analysis</span>
                      <RefreshCw className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </AuthWrapper>
  )
}
