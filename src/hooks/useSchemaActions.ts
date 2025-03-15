import { Schema } from '../types/schema'

export function useSchemaActions(schema: Schema | null) {
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

  const copyJson = () => {
    if (!schema) return
    navigator.clipboard.writeText(JSON.stringify(schema, null, 2))
  }

  return {
    downloadJson,
    copyJson
  }
} 