'use client';

import { useState } from 'react';

import SchemaViewer from '@/components/SchemaViewer';
import GeminiAnalysis from '@/components/GeminiAnalysis';
import Manager from '@/components/Manager';
import PurgeStorage from '@/components/PurgeStorage';
import BrokenFieldsAlert from '@/components/BrokenFieldsAlert';
import { useSchemaActions } from '@/hooks/useSchemaActions';
import { Schema } from '@/types/schema';

export default function Home() {
  // State for schema and analysis data
  const [schema, setSchema] = useState<Schema | null>(null);
  const [geminiAnalysis, setGeminiAnalysis] = useState<string | null>(null);
  const [baseId, setBaseId] = useState<string>('');

  return (
    <main className="max-w-3xl mx-auto py-8 px-4">
      <section className="space-y-8">
        <Explainer />
        <PurgeStorage />
        <Manager
          schema={schema}
          setSchema={setSchema}
          geminiAnalysis={geminiAnalysis}
          setGeminiAnalysis={setGeminiAnalysis}
          baseId={baseId}
          setBaseId={setBaseId}
        />
        {geminiAnalysis && (
          <div className="border-t border-border pt-6">
            <GeminiAnalysis analysis={geminiAnalysis} />
          </div>
        )}

        {schema && (
          <div className="border-t border-border pt-6">
            <BrokenFieldsAlert schema={schema} baseId={baseId} />
            <SchemaViewer schema={schema} baseId={baseId} />
          </div>
        )}
      </section>
    </main>
  );
}

function Explainer() {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="bg-card text-card-foreground border border-border rounded-lg p-4 w-full">
        <h2 className="text-md font-semibold mb-2">How it works</h2>
        <p className="text-muted-foreground text-xs">
          BaseMap does two things: it extracts the schema of your Airtable base in JSON format, and it lets you send that schema file into
          Google Gemini with an analysis prompt of your choosing. Gemini is the chosen LLM for this task, as it has a very large context
          window (it can handle a large schema file).
        </p>
      </div>
      <div className="bg-card text-card-foreground border border-border rounded-lg p-4 w-full">
        <h2 className="text-md font-semibold mb-2">Security</h2>
        <p className="text-muted-foreground text-xs">
          BaseMap runs entirely in your browser. Your access tokens and schema file are used locally to make direct API calls to Airtable
          and Gemini - nothing is sent through to the server.
          <br />
          <a href="/security" className="text-primary hover:text-primary/80 hover:underline transition-colors">
            Read more
          </a>
        </p>
      </div>
    </div>
  );
}
