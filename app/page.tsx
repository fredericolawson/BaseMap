'use client'

import { useState } from 'react'
import { Schema, Relationship, AirtableResponse, AirtableTable, AirtableField } from './types/schema'
import Header from './components/Header'
import SchemaForm from './components/SchemaForm'
import SchemaViewer from './components/SchemaViewer'

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
      const response = await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables`, {
        headers: {
          'Authorization': `Bearer ${pat}`
        }
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid Personal Access Token')
        } else if (response.status === 404) {
          throw new Error('Base not found. Please check your Base ID')
        } else if (response.status === 403) {
          throw new Error('Insufficient permissions. Make sure your PAT has access to this base')
        }
        throw new Error('Failed to fetch schema')
      }

      const tablesData: AirtableResponse = await response.json()
      
      // Process relationships
      const relationships: Relationship[] = []
      const tables = tablesData.tables.map((table: AirtableTable) => {
        const linkedFields = table.fields.filter((field: AirtableField) => 
          field.type === 'multipleRecordLinks' || 
          field.type === 'multipleLookupValues'
        )

        linkedFields.forEach((field: AirtableField) => {
          if (field.type === 'multipleRecordLinks' && field.options?.linkedTableId) {
            relationships.push({
              from: table.id,
              to: field.options.linkedTableId,
              fieldId: field.id,
              type: field.options.prefersSingleRecordLink ? 'oneToOne' : 'oneToMany'
            })
          }
        })

        return {
          id: table.id,
          name: table.name,
          primaryFieldId: table.primaryFieldId,
          fields: table.fields.map((field: AirtableField) => ({
            id: field.id,
            name: field.name,
            type: field.type,
            description: field.description,
            options: field.options,
            linkedTableId: field.options?.linkedTableId
          }))
        }
      })

      setSchema({
        tables,
        relationships
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const downloadJson = () => {
    if (!schema) return
    
    const blob = new Blob([JSON.stringify(schema, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const timestamp = new Date().toISOString().split('T')[0]
    
    link.href = url
    link.download = `basemap-schema-${timestamp}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleCopyJson = () => {
    if (!schema) return
    navigator.clipboard.writeText(JSON.stringify(schema, null, 2))
  }

  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <Header />

      <section className="space-y-8">
        <SchemaForm
          pat={pat}
          baseId={baseId}
          loading={loading}
          setPat={setPat}
          setBaseId={setBaseId}
          onSubmit={(e) => {
            e.preventDefault()
            fetchSchema()
          }}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-600">
            <p>{error}</p>
          </div>
        )}

        {schema && (
          <SchemaViewer
            schema={schema}
            onCopyJson={handleCopyJson}
            onDownloadJson={downloadJson}
          />
        )}
      </section>
    </main>
  )
}
