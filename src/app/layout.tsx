import './globals.css';
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import Link from 'next/link';
import { Toaster } from 'sonner';
import { createClient } from '@/lib/supabase/server';

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

async function Footer() {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();

  return (
    <footer className="py-6 border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center text-sm text-muted-foreground">
          {user?.user && (
            <>
              <Link href="/account" className="hover:text-foreground transition-colors">
                {user.user?.email}
              </Link>
              <div className="mx-2">•</div>
            </>
          )}
          <p>&copy; {new Date().getFullYear()} BaseMap</p>
          <div className="mx-2">•</div>
          <Link href="/security" className="hover:text-foreground transition-colors">
            Security
          </Link>
        </div>
      </div>
    </footer>
  );
}
