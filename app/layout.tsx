import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Isle of Man Jobs Dashboard',
  description: 'Job market analytics and insights for Isle of Man',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-14 sm:h-16">
                <h1 className="text-lg sm:text-xl font-semibold">IOM Jobs</h1>
                <nav className="flex space-x-2 sm:space-x-4">
                  <a href="/" className="text-sm sm:text-base text-gray-700 hover:text-gray-900 px-2 py-1">Dashboard</a>
                  <a href="/jobs" className="text-sm sm:text-base text-gray-700 hover:text-gray-900 px-2 py-1">Jobs</a>
                </nav>
              </div>
            </div>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  )
}