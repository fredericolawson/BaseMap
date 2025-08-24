import './globals.css';
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import Link from 'next/link';
import { Toaster } from 'sonner';
import { SupabaseDebug } from '@/components/supabase-debug';
import { Footer } from '@/components/footer';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'),
  title: 'BaseMap - Airtable Schema Advisor',
  description: 'Let AI analyse your schema and suggest improvements',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'BaseMap - Airtable Schema Advisor',
    description: 'Let AI analyse your schema and suggest improvements',
    type: 'website',
    images: [
      {
        url: '/pencil.png',
        width: 512, // adjust based on actual image dimensions
        height: 512, // adjust based on actual image dimensions
        alt: 'BaseMap Icon',
      },
    ],
  },
  twitter: {
    card: 'summary', // using 'summary' since we're using an icon
    title: 'BaseMap - Airtable Schema Advisor',
    description: 'Let AI analyse your schema and suggest improvements',
    images: ['/pencil.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground flex flex-col min-h-screen">
        <SupabaseDebug />
        <Header />
        <main className="flex-grow flex py-8 px-4 md:px-8">{children}</main>
        <Footer />
        <Analytics />
        <Toaster position="bottom-center" richColors />
      </body>
    </html>
  );
}

function Header() {
  return (
    <header className="text-center my-8 flex flex-col gap-2 items-center justify-center">
      <Link href="/">
        <h1 className="font-mono text-center tracking-tight text-foreground text-3xl font-bold mb-2">BaseMap</h1>
        <p className="text-muted-foreground">Airtable Schema Analysis</p>
      </Link>
    </header>
  );
}
