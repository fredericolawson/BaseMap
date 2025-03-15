'use client'

import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Schema } from '../types/schema'
import ErrorMessage from './ErrorMessage'
import { Download, Copy, Loader2 } from "lucide-react"

const DEFAULT_PROMPT = "Analyze the provided schema and provide a detailed explanation of the tables, how they relate to each other, and their purpose.";

interface GeminiAnalysisProps {
  analysis: string | null
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
  analysis
}: GeminiAnalysisProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4">
      <h2 className="font-medium mb-2">Gemini Schema Analysis</h2>

      {analysis && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Analysis Results</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => {
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
                }}
                className="px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500/20 transition-colors flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download as Markdown
              </button>
              <button
                onClick={() => {
                  if (analysis) {
                    navigator.clipboard.writeText(analysis)
                  }
                }}
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
                  code: ({children, className, ...props}) => {
                    const match = /language-(\w+)/.exec(className || '')
                    if (match) {
                      return (
                        <SyntaxHighlighter
                          language={match[1]}
                          style={oneDark}
                          PreTag="div"
                          className="rounded-md !bg-gray-800 !p-4"
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      )
                    }
                    return (
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
