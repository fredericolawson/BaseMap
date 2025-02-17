import './globals.css'
import type { Metadata } from 'next'
import { Analytics } from "@vercel/analytics/react"
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'BaseMap - Airtable Schema Visualizer',
  description: 'A simple Airtable schema visualization tool',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <main className="flex-grow">
          {children}
        </main>
        <footer className="py-4 px-4 border-t border-gray-200">
          <div className="max-w-7xl mx-auto flex justify-center text-sm text-gray-600">
            <Link href="/privacy" className="hover:text-gray-900 transition-colors">
              Privacy Policy
            </Link>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  )
}
