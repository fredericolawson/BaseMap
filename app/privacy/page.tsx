import Link from 'next/link'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg">
          <p className="mb-6">
            At basemap, we take your privacy seriously. Our policy is simple: we do not collect, store, or process any personal information.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Data Collection</h2>
          <p className="mb-6">
            We do not collect or store any personal data. All operations are performed directly in your browser, and no information is transmitted to or stored on our servers.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Your Privacy Rights</h2>
          <p className="mb-6">
            Since we don't collect any personal information, there is no user data to access, modify, or delete. Your usage of basemap is completely private.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Contact</h2>
          <p className="mb-6">
            If you have any questions about our privacy policy, please feel free to contact us.
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