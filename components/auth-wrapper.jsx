'use client'

import { useUser } from '@clerk/nextjs'
import { SignInButton } from '@clerk/nextjs'

export default function AuthWrapper({ children }) {
  const { isSignedIn, isLoaded } = useUser()

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-400"></div>
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center space-x-2 mb-8">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <span className="text-gray-900 font-bold text-2xl">M</span>
            </div>
            <span className="text-white font-bold text-3xl">MOBLLE</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Breast Cancer<br />Classification
          </h1>
          <p className="text-gray-400 mb-8 text-lg">
            AI-powered breast cancer classification tool. Sign in to get started.
          </p>
          <SignInButton>
            <button className="bg-green-400 text-gray-900 hover:bg-green-300 px-8 py-3 text-lg rounded-lg font-medium transition-colors">
              Sign In to Continue
            </button>
          </SignInButton>
        </div>
      </div>
    )
  }

  return children
}


