'use client'

import { useState, useEffect, ChangeEvent } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Schema } from '../types/schema'
import ErrorMessage from './ErrorMessage'
import { EyeIcon, EyeOffIcon, Download, Copy, Loader2 } from "lucide-react"

const DEFAULT_PROMPT = "Analyze the provided schema and provide a detailed report on its structure and content.";

interface GeminiAnalysisProps {
  schema: Schema | null
  geminiApiKey: string
  analyzing: boolean
  analysis: string | null
  error: string
  setGeminiApiKey: (key: string) => void
  analyzeSchema: (schema: Schema | null, prompt: string) => Promise<void>
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
  const [showPromptCustomization, setShowPromptCustomization] = useState(false)
  const [customPrompt, setCustomPrompt] = useState(DEFAULT_PROMPT)
  const elapsedSeconds = useAnalysisTimer(analyzing)

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault()
    if (useJsonInput && jsonInput) {
      try {
        const parsedSchema = JSON.parse(jsonInput)
        analyzeSchema(parsedSchema, customPrompt)
      } catch (err) {
        console.error('Invalid JSON input:', err)
      }
    } else {
      analyzeSchema(schema, customPrompt)
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
    <div className="pixel-container space-y-4">
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
              className="px-3 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              onClick={() => setShowApiKey(!showApiKey)}
            >
              {showApiKey ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-sm text-gray-500">
            Click <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">here</a> to get a Gemini API key.
            Your API key is stored locally in your browser and never sent to our servers.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700" htmlFor="customPrompt">
              Analysis Prompt
            </label>
            <button
              type="button"
              className="text-sm text-gray-500 hover:text-gray-700"
              onClick={() => setShowPromptCustomization(!showPromptCustomization)}
            >
              {showPromptCustomization ? 'Hide Prompt' : 'Customize Prompt'}
            </button>
          </div>
          
          {showPromptCustomization && (
            <div className="space-y-2">
              <textarea
                id="customPrompt"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-shadow"
                rows={4}
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setCustomPrompt(DEFAULT_PROMPT)}
                  className="text-sm text-blue-500 hover:text-blue-600"
                >
                  Reset to Default
                </button>
              </div>
            </div>
          )}
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
                className="px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500/20 transition-colors flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download as Markdown
              </button>
              <button
                onClick={copyAnalysis}
                className="px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500/20 transition-colors flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                Copy
              </button>
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 p-6">
            <article className="prose prose-gray prose-sm max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({node, ...props}) => (
                    <h1 className="text-2xl font-semibold mb-4 pb-2 border-b border-gray-200" {...props} />
                  ),
                  h2: ({node, ...props}) => (
                    <h2 className="text-xl font-medium mt-6 mb-3" {...props} />
                  ),
                  h3: ({node, ...props}) => (
                    <h3 className="text-lg font-medium mt-4 mb-2" {...props} />
                  ),
                  p: ({node, ...props}) => (
                    <p className="text-gray-600 leading-relaxed mb-4" {...props} />
                  ),
                  ul: ({node, ...props}) => (
                    <ul className="list-disc pl-6 mb-4 space-y-1" {...props} />
                  ),
                  li: ({node, ...props}) => (
                    <li className="text-gray-600" {...props} />
                  ),
                  code({node, inline, className, children, ...props}) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                      <SyntaxHighlighter
                        language={match[1]}
                        style={oneDark}
                        PreTag="div"
                        className="rounded-md !bg-gray-800 !p-4"
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm text-gray-800" {...props}>
                        {children}
                      </code>
                    )
                  }
                }}
              >
                {analysis}
              </ReactMarkdown>
            </article>
          </div>
        </div>
      )}
    </div>
  )
}

import { type CodeProps } from 'react-markdown/lib/ast-to-react'
