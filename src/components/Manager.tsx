import { useEffect } from 'react';
import { Schema } from '@/types/schema';
import { useSchemaFetcher } from '@/hooks/useSchemaFetcher';
import { useGeminiAnalysis } from '@/hooks/useGeminiAnalysis';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import AirtableCredentials from './AirtableCredentials';
import GeminiCredentials from './GeminiCredentials';

export default function Manager({
  schema,
  setSchema,
  setGeminiAnalysis,
  setBaseId: setParentBaseId,
}: {
  schema: Schema | null;
  setSchema: (schema: Schema | null) => void;
  geminiAnalysis: string | null;
  setGeminiAnalysis: (analysis: string | null) => void;
  baseId: string;
  setBaseId: (baseId: string) => void;
}) {
  // Use localStorage to persist credentials
  const { pat, setPat, baseId, setBaseId, geminiApiKey, setGeminiApiKey, geminiPrompt, setGeminiPrompt, resetGeminiPrompt } =
    useLocalStorage();

  // Use hooks for fetching data
  const { fetchSchema, loading: schemaLoading, schemaLoaded } = useSchemaFetcher(pat, baseId);
  const { analyzeSchema, analyzing } = useGeminiAnalysis(geminiApiKey);

  // Sync baseId with parent component
  useEffect(() => {
    setParentBaseId(baseId);
  }, [baseId, setParentBaseId]);

  // Handler for fetching schema
  const handleFetchSchema = async () => {
    const result = await fetchSchema();
    if (result?.schema) {
      setSchema(result.schema);
    }
  };

  // Handler for analyzing schema
  const handleAnalyzeSchema = async () => {
    if (schema) {
      const result = await analyzeSchema(schema, geminiPrompt);
      if (result?.analysis) {
        setGeminiAnalysis(result.analysis);
      }
    }
  };

  return (
    <div className="flex gap-4 justify-center">
      <AirtableCredentials
        pat={pat}
        setPat={setPat}
        baseId={baseId}
        setBaseId={setBaseId}
        onFetchSchema={handleFetchSchema}
        loading={schemaLoading}
        schemaLoaded={schemaLoaded}
      />
      <GeminiCredentials
        geminiApiKey={geminiApiKey}
        setGeminiApiKey={setGeminiApiKey}
        geminiPrompt={geminiPrompt}
        setGeminiPrompt={setGeminiPrompt}
        resetGeminiPrompt={resetGeminiPrompt}
        schemaLoaded={schema !== null}
        analyzeSchema={handleAnalyzeSchema}
        analyzing={analyzing}
      />
    </div>
  );
}
