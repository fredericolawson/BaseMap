import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"

import { Schema } from "@/types/schema"
import { useSchemaFetcher } from "@/hooks/useSchemaFetcher"
import { useGeminiAnalysis } from "@/hooks/useGeminiAnalysis"
import { useLocalStorage } from "@/hooks/useLocalStorage"

export default function Manager({  
  schema,
  setSchema,
  geminiAnalysis,
  setGeminiAnalysis,
}: {
  schema: Schema | null
  setSchema: (schema: Schema | null) => void
  geminiAnalysis: string | null
  setGeminiAnalysis: (analysis: string | null) => void
}) {
  // Use localStorage to persist credentials
  const { 
    pat, 
    setPat, 
    baseId, 
    setBaseId,
    geminiApiKey,
    setGeminiApiKey,
    geminiPrompt,
    setGeminiPrompt,
    resetGeminiPrompt
  } = useLocalStorage()

  // Use hooks for fetching data
  const { fetchSchema, loading: schemaLoading, schemaLoaded } = useSchemaFetcher(pat, baseId)
  const { analyzeSchema, analyzing, analysisLoaded } = useGeminiAnalysis(geminiApiKey)

  // Handler for fetching schema
  const handleFetchSchema = async () => {
    const result = await fetchSchema()
    if (result?.schema) {
      setSchema(result.schema)
    }
  }

  // Handler for analyzing schema
  const handleAnalyzeSchema = async () => {
    if (schema) {
      const result = await analyzeSchema(schema, geminiPrompt)
      if (result?.analysis) {
        setGeminiAnalysis(result.analysis)
      }
    }
  }

  return (
    <div className="flex gap-4">
      <Airtable
        pat={pat}
        setPat={setPat}
        baseId={baseId}
        setBaseId={setBaseId}
        onFetchSchema={handleFetchSchema}
        loading={schemaLoading}
        schemaLoaded={schemaLoaded}
      />
      <Gemini
        geminiApiKey={geminiApiKey}
        setGeminiApiKey={setGeminiApiKey}
        geminiPrompt={geminiPrompt}
        setGeminiPrompt={setGeminiPrompt}
        resetGeminiPrompt={resetGeminiPrompt}
        schemaLoaded={schema !== null}
        analyzeSchema={handleAnalyzeSchema}
        analyzing={analyzing}
        analysisLoaded={analysisLoaded}
      />
    </div>
  )
}

function Airtable({
  pat,
  setPat,
  baseId,
  setBaseId,
  onFetchSchema,
  loading,
  schemaLoaded
}: {
  pat: string
  setPat: (pat: string) => void
  baseId: string
  setBaseId: (baseId: string) => void
  onFetchSchema: () => void
  loading: boolean
  schemaLoaded: boolean
}) {
  return (
    <Card className="w-1/2">
    <CardHeader>
      <CardTitle>Airtable</CardTitle>
      <CardDescription>Manage your credentials for Airtable.</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="baseId">Airtable Base ID</Label>
      <Input
        type="text"
        id="baseId"
        placeholder="app.."
        autoComplete="off"
        data-form-type="other"
        value={baseId}
        className={schemaLoaded ? 'bg-gray-100' : ''}
        onChange={(e) => setBaseId(e.target.value)}
      />
    </div>
      <div className="space-y-2">
        <Label htmlFor="pat">Airtable Personal Access Token</Label>
        <div className="flex space-x-2 items-center">
          <Input
            type="text"
            id="pat"
            placeholder="pat..."
            autoComplete="off"
            data-form-type="other"
            value={pat}
            className={schemaLoaded ? 'bg-gray-100' : ''}
            onChange={(e) => setPat(e.target.value)}
          />
        </div>
        <p className="text-sm text-gray-500">
          Click <a href="https://airtable.com/create/tokens" target="_blank" rel="noopener noreferrer" className="hover:underline">here</a> to get an Airtable Personal Access Token.
          Your token is stored locally in your browser and never sent to our server.
        </p>
      </div>
    </CardContent>
    <CardFooter>
      <div className="flex gap-2">
        <Button onClick={onFetchSchema} disabled={!baseId || !pat || loading}>
          {loading ? "Loading..." : "Fetch Base Schema"}
        </Button>
      </div>
    </CardFooter>
  </Card>
  )
}

function Gemini({
  geminiApiKey,
  setGeminiApiKey,
  geminiPrompt,
  setGeminiPrompt,
  resetGeminiPrompt,
  schemaLoaded,
  analyzeSchema,
  analyzing,
  analysisLoaded
}: {
  geminiApiKey: string  
  setGeminiApiKey: (geminiApiKey: string) => void
  geminiPrompt: string
  setGeminiPrompt: (prompt: string) => void
  resetGeminiPrompt: () => void
  schemaLoaded: boolean
  analyzeSchema: () => void
  analyzing: boolean
  analysisLoaded: boolean
}) {
  const [isPromptDialogOpen, setIsPromptDialogOpen] = useState(false)
  const [tempPrompt, setTempPrompt] = useState(geminiPrompt)

  // Update tempPrompt when geminiPrompt changes
  useEffect(() => {
    setTempPrompt(geminiPrompt)
  }, [geminiPrompt])

  const handleSavePrompt = () => {
    setGeminiPrompt(tempPrompt)
    setIsPromptDialogOpen(false)
  }

  return (
    <Card className="w-1/2">
    <CardHeader>
      <CardTitle>Gemini</CardTitle>
      <CardDescription>Manage your credentials for Gemini.</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="geminiApiKey">Gemini API Key</Label>
        <Input
          type="text"
          id="geminiApiKey"
          placeholder="gemini..."
          autoComplete="off"
          data-form-type="other"
          value={geminiApiKey}
          className={schemaLoaded ? 'bg-gray-100' : ''}
          onChange={(e) => setGeminiApiKey(e.target.value)}
        />
      </div>
      <p className="text-sm text-gray-500">
        Click <a href="https://platform.gemini.com/" target="_blank" rel="noopener noreferrer" className="hover:underline">here</a> to get a Gemini API Key.
        Your key is stored locally in your browser and never sent to our server.
      </p>
    </CardContent>
    <CardFooter className="mt-auto">
      <div className="flex gap-2 ">
        <Button onClick={analyzeSchema} disabled={!schemaLoaded || analyzing}>
          {analyzing ? "Analyzing..." : "Analyse Schema"}
        </Button>
        
        <Dialog open={isPromptDialogOpen} onOpenChange={setIsPromptDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Modify Gemini Prompt</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Customize Gemini Prompt</DialogTitle>
              <DialogDescription>
                Modify the prompt used to analyze your schema with Gemini. Your changes will be saved to your browser's local storage.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Textarea 
                value={tempPrompt} 
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTempPrompt(e.target.value)}
                className="min-h-[150px]"
                placeholder="Enter your custom prompt here..."
              />
              <p className="text-xs text-gray-500 mt-2">
                The schema JSON will be appended to this prompt automatically.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={resetGeminiPrompt}>Reset to Default</Button>
              <Button onClick={handleSavePrompt}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </CardFooter>
  </Card>
  )
}