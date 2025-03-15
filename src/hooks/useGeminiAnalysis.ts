import { useState, useEffect } from 'react'
import { Schema } from '../types/schema'
import { GoogleGenerativeAI } from '@google/generative-ai'

const ERROR_MESSAGES = {
  noSchema: 'No schema available to analyze',
  noApiKey: 'Gemini API key is required',
  default: 'Failed to analyze schema'
} as const

export function useGeminiAnalysis(initialApiKey: string) {
  const [geminiApiKey, setGeminiApiKey] = useState(initialApiKey)
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState('')
  const [analysisLoaded, setAnalysisLoaded] = useState(false)

  // Update state when props change
  useEffect(() => {
    setGeminiApiKey(initialApiKey)
  }, [initialApiKey])

  // Save API key to localStorage when it changes
  const updateGeminiApiKey = (key: string) => {
    setGeminiApiKey(key)
    if (typeof window !== 'undefined') {
      localStorage.setItem('geminiApiKey', key)
    }
  }

  // Clear API key from localStorage
  const clearGeminiApiKey = () => {
    setGeminiApiKey('')
    if (typeof window !== 'undefined') {
      localStorage.removeItem('geminiApiKey')
    }
  }

  // Analyze schema with Gemini
  const analyzeSchema = async (schema: Schema | null, customPrompt?: string) => {
    if (!schema) {
      setError(ERROR_MESSAGES.noSchema)
      return { error: ERROR_MESSAGES.noSchema }
    }

    const currentApiKey = geminiApiKey.trim()
    if (!currentApiKey) {
      setError(ERROR_MESSAGES.noApiKey)
      return { error: ERROR_MESSAGES.noApiKey }
    }

    setAnalyzing(true)
    setAnalysisLoaded(false)
    setError('')
    
    try {
      // Initialize Gemini client directly
      const genAI = new GoogleGenerativeAI(currentApiKey)
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

      // Prepare the prompt
      const promptText = `
        ${customPrompt || "Analyse the following Airtable base schema. Provide me a very succinct explanation of the tables, how they relate to each other, and their purpose. recommend me improvements and simplifications to my schema, including fields that can be deleted. "}
        
        Schema JSON:
        ${JSON.stringify(schema, null, 2)}
      `

      // Generate content
      const result = await model.generateContent(promptText)
      const response = await result.response
      const analysisText = response.text()
      setAnalysis(analysisText)
      setAnalysisLoaded(true)
      return { analysis: analysisText }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.default
      console.error('Gemini analysis error:', errorMessage)
      setError(errorMessage)
      setAnalysis(null)
      return { error: errorMessage }
    } finally {
      setAnalyzing(false)
    }
  }

  return {
    geminiApiKey,
    setGeminiApiKey: updateGeminiApiKey,
    clearGeminiApiKey,
    analysis,
    analyzing,
    error,
    analyzeSchema
  }
}
