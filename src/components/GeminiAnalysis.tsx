'use client';

import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Download, Copy } from 'lucide-react';
import { Button } from './ui/button';
import { copyToClipboard, downloadAsText, generateTimestampedFilenameDetailed } from '../utils/fileOperations';

interface GeminiAnalysisProps {
  analysis: string | null;
}


export default function GeminiAnalysis({ analysis }: GeminiAnalysisProps) {
  return (
    <div className="bg-card rounded-lg border-border p-6 shadow-sm space-y-4">
      <h2 className="font-medium mb-2">Gemini Schema Analysis</h2>

      {analysis && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Analysis Results</h3>
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                onClick={() => {
                  if (analysis) {
                    const filename = generateTimestampedFilenameDetailed('schema-analysis', 'md');
                    downloadAsText(analysis, filename, 'text/markdown');
                  }
                }}
              >
                <Download className="h-4 w-4" />
                Download as Markdown
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  if (analysis) {
                    copyToClipboard(analysis);
                  }
                }}
              >
                <Copy className="h-4 w-4" />
                Copy
              </Button>
            </div>
          </div>
          <div className="rounded-lg border border-accent p-6 bg-accent/20">
            <article className="prose prose-foreground prose-sm max-w-none ">
              <ReactMarkdown
                components={{
                  h1: ({ ...props }) => <h1 className="text-2xl font-semibold mb-4 pb-2 border-b border-gray-200" {...props} />,
                  h2: ({ ...props }) => <h2 className="text-xl font-medium mt-6 mb-3" {...props} />,
                  h3: ({ ...props }) => <h3 className="text-lg font-medium mt-4 mb-2" {...props} />,
                  p: ({ ...props }) => <p className="leading-relaxed mb-4" {...props} />,
                  ul: ({ ...props }) => <ul className="list-disc pl-6 mb-4 space-y-1" {...props} />,
                  li: ({ ...props }) => <li className="" {...props} />,
                  code: ({ children, className, ...props }) => {
                    const match = /language-(\w+)/.exec(className || '');
                    if (match) {
                      return (
                        <SyntaxHighlighter language={match[1]} style={oneDark} PreTag="div" className="rounded-md !bg-gray-800 !p-4">
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      );
                    }
                    return (
                      <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm text-gray-800" {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {analysis}
              </ReactMarkdown>
            </article>
          </div>
        </div>
      )}
    </div>
  );
}
