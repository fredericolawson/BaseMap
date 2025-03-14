'use client'

import { useState, useEffect, ChangeEvent } from 'react'
import ReactMarkdown from 'react-markdown'
import { Schema } from '../types/schema'
import ErrorMessage from './ErrorMessage'
import { EyeIcon, EyeOffIcon, Download, Copy, Loader2 } from "lucide-react"

interface GeminiAnalysisProps {
  schema: Schema | null
  geminiApiKey: string
  analyzing: boolean
  analysis: string | null
  error: string
  setGeminiApiKey: (key: string) => void
  analyzeSchema: (schema: Schema | null) => Promise<void>
}

function useAnalysisTimer(analyzing: boolean) {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    if (!analyzing) {
      setSeconds(0)
      return
    }

    const timer = setInterval(() => {
      setSeconds(prev => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [analyzing])

  return seconds
}

export default function GeminiAnalysis({
  schema,
  geminiApiKey,
  analyzing,
  analysis,
  error,
  setGeminiApiKey,
  analyzeSchema
}: GeminiAnalysisProps) {
  const [showApiKey, setShowApiKey] = useState(false)
  const [jsonInput, setJsonInput] = useState('')
  const [useJsonInput, setUseJsonInput] = useState(false)
  const elapsedSeconds = useAnalysisTimer(analyzing)

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault()
    if (useJsonInput && jsonInput) {
      try {
        const parsedSchema = JSON.parse(jsonInput)
        analyzeSchema(parsedSchema)
      } catch (err) {
        console.error('Invalid JSON input:', err)
      }
    } else {
      analyzeSchema(schema)
    }
  }

  const copyAnalysis = () => {
    if (analysis) {
      navigator.clipboard.writeText(analysis)
    }
  }

  const downloadAnalysis = () => {
    if (analysis) {
      const blob = new Blob([analysis], { type: 'text/markdown' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      a.href = url
      a.download = `schema-analysis-${timestamp}.md`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="border p-4 rounded-lg">
      <h2 className="font-medium mb-2">Gemini Schema Analysis</h2>
      
      <form onSubmit={handleAnalyze} className="space-y-4" autoComplete="off">
        <div className="space-y-2">
          <label className="block mb-2" htmlFor="geminiApiKey">Gemini API Key</label>
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <input
                id="geminiApiKey"
                name="geminiApiKey"
                type={showApiKey ? "text" : "password"}
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                placeholder="Enter your Gemini API key"
                required
                autoComplete="new-password"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                className="border rounded-md px-3 py-2 w-full"
              />
            </div>
            <button
              type="button"
              className="bg-gray-200 text-gray-600 px-4 py-2 rounded-md"
              onClick={() => setShowApiKey(!showApiKey)}
            >
              {showApiKey ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-sm text-muted-foreground">
            Click <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">here</a> to get a Gemini API key.
            Your API key is stored locally in your browser and never sent to our servers.
          </p>
        </div>

        {!schema && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                id="useJsonInput"
                type="checkbox"
                checked={useJsonInput}
                onChange={(e) => setUseJsonInput(e.target.checked)}
                className="mr-2"
              />
              <label className="text-sm text-muted-foreground" htmlFor="useJsonInput">
                Manually paste in schema JSON
              </label>
            </div>
            
            {useJsonInput && (
              <textarea
                value={jsonInput}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setJsonInput(e.target.value)}
                placeholder="Paste your schema JSON here"
                required={useJsonInput}
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                className="border rounded-md px-3 py-2 w-full mt-2"
              />
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={analyzing || (!schema && (!useJsonInput || !jsonInput)) || !geminiApiKey}
          className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
        >
          {analyzing ? (
            <div className="flex items-center justify-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Analyzing... ({elapsedSeconds}s)</span>
            </div>
          ) : (
            'Analyze Schema with Gemini'
          )}
        </button>
      </form>

      {error && <ErrorMessage message={error} />}

      {analysis && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Analysis Results</h3>
            <div className="flex space-x-2">
              <button
                onClick={downloadAnalysis}
                className="bg-gray-200 text-gray-600 px-4 py-2 rounded-md"
              >
                <Download className="mr-2 h-4 w-4" />
                Download as Markdown
              </button>
              <button
                onClick={copyAnalysis}
                className="bg-gray-200 text-gray-600 px-4 py-2 rounded-md"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </button>
            </div>
          </div>
          <div className="prose prose-sm max-w-none overflow-auto rounded-md border bg-muted p-4">
            <ReactMarkdown>
              {analysis}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  )
}
