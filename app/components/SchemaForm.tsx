interface SchemaFormProps {
  pat: string
  baseId: string
  loading: boolean
  setPat: (value: string) => void
  setBaseId: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
}

export default function SchemaForm({ pat, baseId, loading, setPat, setBaseId, onSubmit }: SchemaFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label htmlFor="pat" className="block text-sm font-medium mb-2">Personal Access Token</label>
        <input
          id="pat"
          type="password"
          value={pat}
          onChange={(e) => setPat(e.target.value)}
          className="pixel-input"
          placeholder=""
          required
        />
      </div>

      <div>
        <label htmlFor="baseId" className="block text-sm font-medium mb-2">Base ID</label>
        <input
          id="baseId"
          type="text"
          value={baseId}
          onChange={(e) => setBaseId(e.target.value)}
          className="pixel-input"
          placeholder="app..."
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="pixel-button w-full"
      >
        {loading ? 'Loading...' : 'View Schema'}
      </button>
    </form>
  )
} 