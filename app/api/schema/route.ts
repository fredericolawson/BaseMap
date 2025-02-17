import { NextRequest, NextResponse } from 'next/server'

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

interface AirtableTable {
  id: string
  name: string
  primaryFieldId: string
  fields: Field[]
}

interface AirtableResponse {
  tables: AirtableTable[]
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const baseId = searchParams.get('baseId')
    const authHeader = request.headers.get('Authorization')

    if (!baseId) {
      return NextResponse.json({ error: 'Base ID is required' }, { status: 400 })
    }

    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header is required' }, { status: 401 })
    }

    // Fetch tables list
    const tablesResponse = await fetch(
      `https://api.airtable.com/v0/meta/bases/${baseId}/tables`,
      {
        headers: {
          'Authorization': authHeader,
        },
      }
    )

    if (!tablesResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch tables' },
        { status: tablesResponse.status }
      )
    }

    const tablesData: AirtableResponse = await tablesResponse.json()

    // Process relationships
    const relationships: Relationship[] = []
    const tables = tablesData.tables.map((table: AirtableTable) => {
      const linkedFields = table.fields.filter((field: Field) => 
        field.type === 'multipleRecordLinks' || 
        field.type === 'multipleLookupValues'
      )

      linkedFields.forEach((field: Field) => {
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
        fields: table.fields.map((field: Field) => ({
          id: field.id,
          name: field.name,
          type: field.type,
          description: field.description,
          options: field.options,
          linkedTableId: field.options?.linkedTableId
        }))
      }
    })

    const schema: Schema = {
      tables,
      relationships
    }

    return NextResponse.json(schema)
  } catch (error) {
    console.error('Error fetching schema:', error)
    return NextResponse.json(
      { error: 'Failed to fetch schema' },
      { status: 500 }
    )
  }
} 