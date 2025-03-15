'use client'

interface StorageManagerProps {
  pat: string
  baseId: string
  geminiApiKey: string
  onPurge: () => void
}

export default function StorageManager({ pat, baseId, geminiApiKey, onPurge }: StorageManagerProps) {
  const getStorageStatus = () => {
    const items = [
      { name: 'Personal Access Token', exists: !!pat },
      { name: 'Base ID', exists: !!baseId },
      { name: 'Gemini API Key', exists: !!geminiApiKey }
    ]
    return items
  }

  return (
    <div className="pixel-container">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Local Storage</h3>
        <button
          onClick={onPurge}
          className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-md text-sm transition-colors"
        >
          Clear Credentials
        </button>
      </div>
      <div className="space-y-2">
        {getStorageStatus().map((item) => (
          <div key={item.name} className="flex justify-between items-center text-sm">
            <span>{item.name}</span>
            <span className={item.exists ? 'text-green-600' : 'text-gray-400'}>
              {item.exists ? '✓ Stored' : 'Not stored'}
            </span>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-4">
        Click &ldquo;Allow&rdquo; to enable local storage for saving your API keys. 
        All data is stored securely in your browser&apos;s local storage and never sent to our servers. 
        It is strongly recommended to click &ldquo;Clear Credentials&rdquo; above when you have finished your analysis. 
      </p>
    </div>
  )
}
