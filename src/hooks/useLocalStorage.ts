import { useState, useEffect } from 'react'

const DEFAULT_GEMINI_PROMPT = "Analyze the following airtable base schema. Provide me an elegant and succinct explanation of the tables, how they relate to eachother, and their purpose. Focus on maximally meaningful insights for someone looking to truly make sense of the base"

export function useLocalStorage() {
  const [mounted, setMounted] = useState(false)
  const [pat, setPat] = useState('')
  const [baseId, setBaseId] = useState('')
  const [geminiApiKey, setGeminiApiKey] = useState('')
  const [geminiPrompt, setGeminiPrompt] = useState(DEFAULT_GEMINI_PROMPT)

  useEffect(() => {
    setMounted(true)
    const storedPat = localStorage.getItem('pat')
    const storedBaseId = localStorage.getItem('baseId')
    const storedGeminiApiKey = localStorage.getItem('geminiApiKey')
    const storedGeminiPrompt = localStorage.getItem('geminiPrompt')
    
    if (storedPat) setPat(storedPat)
    if (storedBaseId) setBaseId(storedBaseId)
    if (storedGeminiApiKey) setGeminiApiKey(storedGeminiApiKey)
    if (storedGeminiPrompt) setGeminiPrompt(storedGeminiPrompt)
  }, [])

  // Return empty values during SSR to match initial render
  if (!mounted) {
    return {
      pat: '',
      baseId: '',
      geminiApiKey: '',
      geminiPrompt: DEFAULT_GEMINI_PROMPT,
      setPat: () => {},
      setBaseId: () => {},
      setGeminiApiKey: () => {},
      setGeminiPrompt: () => {},
      resetGeminiPrompt: () => {},
      purgeStorage: () => {}
    }
  }

  const updatePat = (value: string) => {
    setPat(value)
    try {
      localStorage.setItem('pat', value)
    } catch (error) {
      console.error('Failed to save PAT to localStorage:', error)
    }
  }

  const updateBaseId = (value: string) => {
    setBaseId(value)
    try {
      localStorage.setItem('baseId', value)
    } catch (error) {
      console.error('Failed to save Base ID to localStorage:', error)
    }
  }

  const updateGeminiApiKey = (value: string) => {
    setGeminiApiKey(value)
    try {
      localStorage.setItem('geminiApiKey', value)
    } catch (error) {
      console.error('Failed to save Gemini API key to localStorage:', error)
    }
  }

  const updateGeminiPrompt = (value: string) => {
    setGeminiPrompt(value)
    try {
      localStorage.setItem('geminiPrompt', value)
    } catch (error) {
      console.error('Failed to save Gemini prompt to localStorage:', error)
    }
  }

  const resetGeminiPrompt = () => {
    setGeminiPrompt(DEFAULT_GEMINI_PROMPT)
    try {
      localStorage.setItem('geminiPrompt', DEFAULT_GEMINI_PROMPT)
    } catch (error) {
      console.error('Failed to reset Gemini prompt in localStorage:', error)
    }
  }

  const purgeStorage = () => {
    setPat('')
    setBaseId('')
    setGeminiApiKey('')
    setGeminiPrompt(DEFAULT_GEMINI_PROMPT)
    try {
      localStorage.removeItem('pat')
      localStorage.removeItem('baseId')
      localStorage.removeItem('geminiApiKey')
      localStorage.removeItem('geminiPrompt')
    } catch (error) {
      console.error('Failed to purge localStorage:', error)
    }
  }

  return {
    pat,
    baseId,
    geminiApiKey,
    geminiPrompt,
    setPat: updatePat,
    setBaseId: updateBaseId,
    setGeminiApiKey: updateGeminiApiKey,
    setGeminiPrompt: updateGeminiPrompt,
    resetGeminiPrompt,
    purgeStorage
  }
}
