import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Agent Computer - Autonomous Automation System',
  description: 'Advanced AI-powered computer automation using natural language',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 min-h-screen">
        {children}
      </body>
    </html>
  )
}
