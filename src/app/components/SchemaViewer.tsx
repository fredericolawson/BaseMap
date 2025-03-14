import { Schema, Table, Relationship } from '../types/schema'

interface TableRelationshipProps {
  relationship: Relationship
  table: Table
  getTableById: (id: string) => Table | undefined
  isSource: boolean
}

function TableRelationship({ relationship, table, getTableById, isSource }: TableRelationshipProps) {
  const otherTable = getTableById(isSource ? relationship.to : relationship.from)
  if (!otherTable) return null

  return (
    <div className="text-sm bg-gray-50 p-3 rounded-md">
      <span className="text-gray-600">
        {isSource ? 'Links to' : 'Linked from'}{' '}
        <span className="font-medium">{otherTable.name}</span>
        {' via '}
        {isSource
          ? table.fields.find(f => f.id === relationship.fieldId)?.name
          : otherTable.fields.find(f => f.id === relationship.fieldId)?.name}
        {' '}
        ({relationship.type})
      </span>
    </div>
  )
}

interface SchemaViewerProps {
  schema: Schema
  onCopyJson: () => void
  onDownloadJson: () => void
}

export default function SchemaViewer({ schema, onCopyJson, onDownloadJson }: SchemaViewerProps) {
  const getTableById = (id: string) => schema.tables.find(table => table.id === id)

  return (
    <div className="space-y-8">
      <div className="text-center space-x-4">
        <button
          onClick={onCopyJson}
          className="btn-secondary"
        >
          Copy JSON
        </button>
        <button
          onClick={onDownloadJson}
          className="btn-secondary"
        >
          Download JSON
        </button>
      </div>
      
      {schema.tables.map(table => (
        <div key={table.id} className="pixel-container">
          <div className="flex justify-between  mb-4">
            <h2 className="title text-lg font-medium">{table.name}</h2>
            <div className="flex flex-col gap-2">
              <button className="btn-secondary">Sort Fields by Type</button>
              <span className="text-sm text-gray-500">{table.fields.length} fields</span>
            </div>
          </div>

          <div className="space-y-4">
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

            {schema.relationships
              .filter(rel => rel.from === table.id || rel.to === table.id)
              .map(rel => (
                <TableRelationship
                  key={rel.fieldId}
                  relationship={rel}
                  table={table}
                  getTableById={getTableById}
                  isSource={rel.from === table.id}
                />
              ))}
          </div>
        </div>
      ))}

      
    </div>
  )
} 