export interface Field {
  id: string
  name: string
  type: string
  description?: string
  linkedTableId?: string
  prefersSingleRecordLink?: boolean
  isReversed?: boolean
  choices?: Array<{
    id: string
    name: string
    color?: string
  }>
}

export interface Table {
  id: string
  name: string
  primaryFieldId: string
  fields: Field[]
}

export interface Relationship {
  from: string
  to: string
  fieldId: string
  type: 'oneToMany' | 'manyToOne' | 'oneToOne'
}

export interface Schema {
  tables: Table[]
  relationships: Relationship[]
}

// Airtable API Response Types
export interface AirtableFieldOptions {
  linkedTableId?: string
  prefersSingleRecordLink?: boolean
  isReversed?: boolean
  choices?: Array<{
    id: string
    name: string
    color?: string
  }>
}

export interface AirtableField {
  id: string
  name: string
  type: string
  description?: string
  options?: AirtableFieldOptions
}

export interface AirtableTable {
  id: string
  name: string
  primaryFieldId: string
  fields: AirtableField[]
}

export interface AirtableResponse {
  tables: AirtableTable[]
} 