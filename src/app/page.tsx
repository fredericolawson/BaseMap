'use client'

import { useState } from 'react'

import Header from '@/components/Header'
import SchemaViewer from '@/components/SchemaViewer'
import GeminiAnalysis from '@/components/GeminiAnalysis'
import Manager from '@/components/Manager'
import PurgeStorage from '@/components/PurgeStorage'
import { useSchemaActions } from '@/hooks/useSchemaActions'
import { Schema } from '@/types/schema'

export default function Home() {
  // State for schema and analysis data
  const [schema, setSchema] = useState<Schema | null>(null)
  const [geminiAnalysis, setGeminiAnalysis] = useState<string | null>(null)
  
  // Actions for schema data
  const { downloadJson, copyJson } = useSchemaActions(schema)

  return (
    <main className="max-w-3xl mx-auto py-12 px-4 min-h-screen bg-gray-50">
      <Header />

      <section className="space-y-8">
        <PurgeStorage />

        <Manager
          schema={schema}
          setSchema={setSchema}
          geminiAnalysis={geminiAnalysis}
          setGeminiAnalysis={setGeminiAnalysis}
        />
                {geminiAnalysis && (
          <div className="border-t border-gray-200 pt-6">
            <GeminiAnalysis
              analysis={geminiAnalysis}
            />
          </div>
        )}

        {schema && (
          <div className="border-t border-gray-200 pt-6">
            <SchemaViewer
              schema={schema}
              onCopyJson={copyJson}
              onDownloadJson={downloadJson}
            />
          </div>
        )}


      </section>
    </main>
  )
}
