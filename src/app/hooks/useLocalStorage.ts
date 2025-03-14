import { useState, useEffect } from 'react'

export function useLocalStorage() {
  const [mounted, setMounted] = useState(false)
  const [pat, setPat] = useState('')
  const [baseId, setBaseId] = useState('')
  const [geminiApiKey, setGeminiApiKey] = useState('')

  useEffect(() => {
    setMounted(true)
    const storedPat = localStorage.getItem('pat')
    const storedBaseId = localStorage.getItem('baseId')
    const storedGeminiApiKey = localStorage.getItem('geminiApiKey')
    
    if (storedPat) setPat(storedPat)
    if (storedBaseId) setBaseId(storedBaseId)
    if (storedGeminiApiKey) setGeminiApiKey(storedGeminiApiKey)
  }, [])

  // Return empty values during SSR to match initial render
  if (!mounted) {
    return {
      pat: '',
      baseId: '',
      geminiApiKey: '',
      setPat: () => {},
      setBaseId: () => {},
      setGeminiApiKey: () => {},
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

  const purgeStorage = () => {
    setPat('')
    setBaseId('')
    setGeminiApiKey('')
    try {
      localStorage.removeItem('pat')
      localStorage.removeItem('baseId')
      localStorage.removeItem('geminiApiKey')
    } catch (error) {
      console.error('Failed to purge localStorage:', error)
    }
  }

  return {
    pat,
    baseId,
    geminiApiKey,
    setPat: updatePat,
    setBaseId: updateBaseId,
    setGeminiApiKey: updateGeminiApiKey,
    purgeStorage
  }
}
