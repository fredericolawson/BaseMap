import { useState, useEffect } from 'react'
import { Schema, Relationship, AirtableResponse, AirtableTable } from '../types/schema'

const AIRTABLE_API_BASE = 'https://api.airtable.com/v0/meta/bases'

const ERROR_MESSAGES = {
  401: 'Invalid Personal Access Token',
  403: 'Insufficient permissions. Make sure your PAT has access to this base',
  404: 'Base not found. Please check your Base ID',
  default: 'Failed to fetch schema'
} as const

export function useSchemaFetcher(initialPat: string, initialBaseId: string) {
  const [pat, setPat] = useState(initialPat)
  const [baseId, setBaseId] = useState(initialBaseId)
  const [schema, setSchema] = useState<Schema | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Update state when props change
  useEffect(() => {
    setPat(initialPat)
    setBaseId(initialBaseId)
  }, [initialPat, initialBaseId])

  const processRelationships = (tables: AirtableTable[]): { tables: AirtableTable[], relationships: Relationship[] } => {
    const relationships: Relationship[] = []
    
    const processedTables = tables.map(table => {
      const linkedFields = table.fields.filter(field => 
        field.type === 'multipleRecordLinks' || field.type === 'multipleLookupValues'
      )

      linkedFields.forEach(field => {
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
        fields: table.fields.map(field => ({
          id: field.id,
          name: field.name,
          type: field.type,
          description: field.description,
          options: field.options,
          linkedTableId: field.options?.linkedTableId
        }))
      }
    })

    return { tables: processedTables, relationships }
  }

  const fetchSchema = async () => {
    const currentPat = pat.trim()
    const currentBaseId = baseId.trim()

    if (!currentPat || !currentBaseId) {
      setError('Personal Access Token and Base ID are required')
      return
    }

    setLoading(true)
    setError('')

    try {
      const endpoint = `${AIRTABLE_API_BASE}/${currentBaseId}/tables`
      const response = await fetch(endpoint, {
        headers: { 'Authorization': `Bearer ${currentPat}` }
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.log('Airtable API error:', {
          endpoint,
          baseId: `${currentBaseId.substring(0, 3)}...`,
          status: response.status,
          statusText: response.statusText,
          error: errorData
        })
        throw new Error(ERROR_MESSAGES[response.status as keyof typeof ERROR_MESSAGES] || ERROR_MESSAGES.default)
      }

      const tablesData: AirtableResponse = await response.json()
      const { tables, relationships } = processRelationships(tablesData.tables)
      setSchema({ tables, relationships })
    } catch (err) {
      setError(err instanceof Error ? err.message : ERROR_MESSAGES.default)
    } finally {
      setLoading(false)
    }
  }

  return {
    pat,
    baseId,
    schema,
    loading,
    error,
    setPat,
    setBaseId,
    fetchSchema
  }
}