import './globals.css'
import type { Metadata } from 'next'
import { Analytics } from "@vercel/analytics/react"
import Link from 'next/link'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: 'BaseMap - Airtable Schema Advisor',
  description: 'Let AI analyse your schema and suggest improvements',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'BaseMap - Airtable Schema Advisor',
    description: 'Let AI analyse your schema and suggest improvements',
    type: 'website',
    images: [{
      url: '/pencil.png',
      width: 512,  // adjust based on actual image dimensions
      height: 512, // adjust based on actual image dimensions
      alt: 'BaseMap Icon'
    }],
  },
  twitter: {
    card: 'summary',  // using 'summary' since we're using an icon
    title: 'BaseMap - Airtable Schema Advisor',
    description: 'Let AI analyse your schema and suggest improvements',
    images: ['/pencil.png'],
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}

function Footer() {
  return (
    <footer className="py-6 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} BaseMap</p>
          <div className="mx-2">•</div>
          <Link href="/security" className="hover:text-gray-700 transition-colors">
            Security
          </Link>
        </div>
      </div>
    </footer>
  )
}