import { Inter } from "next/font/google"
import "./globals.css"
import { ClerkProvider } from '@clerk/nextjs'

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "MetaSelect - Breast Cancer Classification",
  description: "AI-powered breast cancer classification tool",
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} bg-gray-900 text-white min-h-screen`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
