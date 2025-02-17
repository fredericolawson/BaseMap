import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'BaseMap - Airtable Schema Visualizer',
  description: 'A clean and simple Airtable schema visualization tool',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
