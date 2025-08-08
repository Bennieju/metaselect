import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "MetaSelect AI- Breast Cancer Classification",
  description: "XAI-powered tool for breast cancer detection explanations",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} app-body`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
