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
    <main className="max-w-3xl mx-auto py-8 px-4 bg-gray-50">

      <section className="space-y-8">
        <Explainer />
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

function Explainer() {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="border border-gray-200 rounded-lg p-4 w-full">
        <h2 className="text-md font-semibold mb-2">How it works</h2>
        <p className="text-gray-500 text-xs">
          BaseMap does two things: it extracts the schema of your Airtable base in JSON format, 
          and it lets you send that schema file into Google Gemini with an analysis prompt of your choosing.
          Gemini is the chosen LLM for this task, as it has a very large context window (it can handle a large schema file).
        </p>
      </div>
      <div className="border border-gray-200 rounded-lg p-4 w-full">
        <h2 className="text-md font-semibold mb-2">Security</h2>
        <p className="text-gray-500 text-xs">
          BaseMap runs entirely in your browser. 
          Your access tokens and schema file are used locally to make direct API calls to Airtable and Gemini - nothing is sent through to the server.
          <br />
          <a href="/security" className="hover:underline text-gray-700">Read more</a>
        </p>
      </div>
    </div>
  )
}