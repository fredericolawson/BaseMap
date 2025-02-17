import Link from 'next/link'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg">
          <p className="mb-6">
            Basemap is simple and secure. It doesn&apos;t collect, store, or process any access tokens, base IDs, or personal information.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Data Collection</h2>
          <p className="mb-6">
            Basemap does not collect or store any access tokens, base IDs, or personal data. All operations are performed directly in your browser, and no information is transmitted to or stored on our servers.
          </p>

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