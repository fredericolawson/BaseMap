'use client'

import { useState } from 'react'

interface Field {
  id: string
  name: string
  type: string
  description?: string
  options?: {
    linkedTableId?: string
    prefersSingleRecordLink?: boolean
    isReversed?: boolean
    choices?: Array<{
      id: string
      name: string
      color?: string
    }>
  }
  linkedTableId?: string
}

interface Table {
  id: string
  name: string
  primaryFieldId: string
  fields: Field[]
}

interface Relationship {
  from: string
  to: string
  fieldId: string
  type: 'oneToMany' | 'manyToOne' | 'oneToOne'
}

interface Schema {
  tables: Table[]
  relationships: Relationship[]
}

export default function Home() {
  const [pat, setPat] = useState('')
  const [baseId, setBaseId] = useState('')
  const [schema, setSchema] = useState<Schema | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchSchema = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`/api/schema?baseId=${baseId}`, {
        headers: {
          'Authorization': `Bearer ${pat}`
        }
      })
      if (!response.ok) {
        throw new Error('Failed to fetch schema')
      }
      const data = await response.json()
      setSchema(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getTableById = (id: string) => {
    return schema?.tables.find(table => table.id === id)
  }

  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <header className="text-center mb-12">
        <h1 className="title text-3xl font-bold mb-2">BaseMap</h1>
        <p className="text-gray-600 dark:text-gray-400">Airtable Schema Visualizer</p>
      </header>

      <section className="space-y-8">
        <form onSubmit={(e) => {
          e.preventDefault()
          fetchSchema()
        }} className="space-y-6">
          <div>
            <label htmlFor="pat" className="block text-sm font-medium mb-2">Personal Access Token</label>
            <input
              id="pat"
              type="password"
              value={pat}
              onChange={(e) => setPat(e.target.value)}
              className="pixel-input"
              placeholder="pat..."
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

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-600">
            <p>{error}</p>
          </div>
        )}

        {schema && (
          <div className="space-y-8">
            {schema.tables.map(table => (
              <div key={table.id} className="pixel-container">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="title text-lg font-medium">{table.name}</h2>
                  <span className="text-sm text-gray-500">{table.fields.length} fields</span>
                </div>

                <div className="space-y-4">
                  {/* Fields */}
                  <div className="space-y-2">
                    {table.fields.map(field => (
                      <div key={field.id} className="text-sm">
                        <span className="font-medium">{field.name}</span>
                        <span className="text-gray-500 ml-2">{field.type}</span>
                        {field.description && (
                          <p className="text-gray-600 text-xs mt-1">{field.description}</p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Relationships */}
                  {schema.relationships
                    .filter(rel => rel.from === table.id || rel.to === table.id)
                    .map(rel => {
                      const isSource = rel.from === table.id
                      const otherTable = getTableById(isSource ? rel.to : rel.from)
                      if (!otherTable) return null

                      return (
                        <div key={rel.fieldId} className="text-sm bg-gray-50 p-3 rounded-md">
                          <span className="text-gray-600">
                            {isSource ? 'Links to' : 'Linked from'}{' '}
                            <span className="font-medium">{otherTable.name}</span>
                            {' via '}
                            {isSource
                              ? table.fields.find(f => f.id === rel.fieldId)?.name
                              : otherTable.fields.find(f => f.id === rel.fieldId)?.name}
                            {' '}
                            ({rel.type})
                          </span>
                        </div>
                      )
                    })}
                </div>
              </div>
            ))}

            <div className="text-center">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(schema, null, 2))
                }}
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md transition-colors"
              >
                Copy Raw JSON
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}
