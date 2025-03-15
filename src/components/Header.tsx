export default function Header() {
  return (
    <header className="text-center mb-8">
      <h1 className="title text-3xl font-bold mb-2">BaseMap</h1>
      <p className="text-gray-600 dark:text-gray-400">Airtable Schema Analysis</p>
      <p className="text-xs text-gray-400 mt-4 max-w-lg mx-auto">
        Basemap runs entirely in your browser. Your access tokens and data are used locally to make direct API calls to Airtable - nothing is sent through to the server.
      </p>
    </header>
  )
} 