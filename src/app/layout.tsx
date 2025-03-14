import './globals.css'
import type { Metadata } from 'next'
import { Analytics } from "@vercel/analytics/react"
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'BaseMap - Airtable Schema Visualizer',
  description: 'A simple Airtable schema visualization tool',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'BaseMap - Airtable Schema Visualizer',
    description: 'A simple Airtable schema visualization tool',
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
    title: 'BaseMap - Airtable Schema Visualizer',
    description: 'A simple Airtable schema visualization tool',
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
      <body className="bg-gray-50">
        <main>
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  )
}
