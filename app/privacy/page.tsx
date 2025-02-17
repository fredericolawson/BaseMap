import Link from 'next/link'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg">
          <p className="mb-6">
            Basemap is simple and secure. All API calls are made directly from your browser to Airtable - your access tokens and data never touch our servers.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Data Collection</h2>
          <p className="mb-6">
            Basemap operates entirely in your browser. Your access tokens and base IDs are only used locally to make direct API calls to Airtable. No sensitive information ever passes through our servers.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Security Model</h2>
          <p className="mb-6">
            For maximum security and privacy, Basemap uses a client-side only approach. This means:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li className="mb-2">All Airtable API calls happen directly from your browser</li>
            <li className="mb-2">Your access tokens never leave your device</li>
            <li className="mb-2">No data is stored or processed on our servers</li>
            <li className="mb-2">The application code is open source and can be audited</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Your Privacy Rights</h2>
          <p className="mb-6">
            Since Basemap doesn&apos;t collect any personal information, there is no user data to access, modify, or delete. Your usage of Basemap is completely private.
          </p>
          <div className="mt-8">
            <Link 
              href="/"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              ← Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 