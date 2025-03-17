import Link from 'next/link'

export default function Header() {
  return (
    <header className="text-center my-8">
      <Link href="/">
        <h1 className="title text-3xl font-bold mb-2">BaseMap</h1>
        <p className="text-gray-600 dark:text-gray-400">Airtable Schema Analysis</p>
      </Link>
    </header>
  )
} 