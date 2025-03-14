'use client'

import Header from './components/Header'
import SchemaForm from './components/SchemaForm'
import SchemaViewer from './components/SchemaViewer'
import GeminiAnalysis from './components/GeminiAnalysis'
import ErrorMessage from './components/ErrorMessage'
import StorageManager from './components/StorageManager'
import { useSchemaFetcher } from './hooks/useSchemaFetcher'
import { useSchemaActions } from './hooks/useSchemaActions'
import { useGeminiAnalysis } from './hooks/useGeminiAnalysis'
import { useLocalStorage } from './hooks/useLocalStorage'

export default function Home() {
  const {
    pat,
    baseId,
    geminiApiKey,
    setPat,
    setBaseId,
    setGeminiApiKey,
    purgeStorage
  } = useLocalStorage()

  const {
    schema,
    loading,
    error,
    fetchSchema
  } = useSchemaFetcher(pat, baseId)
  
  const { downloadJson, copyJson } = useSchemaActions(schema)
  
  const {
    analysis,
    analyzing,
    error: geminiError,
    analyzeSchema
  } = useGeminiAnalysis(geminiApiKey)

  return (
    <main className="max-w-3xl mx-auto py-12 px-4 min-h-screen bg-gray-50">
      <Header />

      <section className="space-y-8">
        <StorageManager
          pat={pat}
          baseId={baseId}
          geminiApiKey={geminiApiKey}
          onPurge={purgeStorage}
        />

        <SchemaForm
          pat={pat}
          baseId={baseId}
          loading={loading}
          schema={schema}
          setPat={setPat}
          setBaseId={setBaseId}
          onSubmit={(e) => {
            e.preventDefault()
            fetchSchema()
          }}
        />

        <div className="border-t border-gray-200 pt-8">
          <GeminiAnalysis
            schema={schema}
            geminiApiKey={geminiApiKey}
            analyzing={analyzing}
            analysis={analysis}
            error={geminiError}
            setGeminiApiKey={setGeminiApiKey}
            analyzeSchema={analyzeSchema}
          />
        </div>

        {error && <ErrorMessage message={error} />}

        {schema && (

            <SchemaViewer
              schema={schema}
              onCopyJson={copyJson}
              onDownloadJson={downloadJson}
            />

        )}
      </section>
    </main>
  )
}
