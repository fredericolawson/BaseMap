import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useTimer } from '@/hooks/useTimer';

interface GeminiCredentialsProps {
  geminiApiKey: string;
  setGeminiApiKey: (geminiApiKey: string) => void;
  geminiPrompt: string;
  setGeminiPrompt: (prompt: string) => void;
  resetGeminiPrompt: () => void;
  schemaLoaded: boolean;
  analyzeSchema: () => void;
  analyzing: boolean;
}

export default function GeminiCredentials({
  geminiApiKey,
  setGeminiApiKey,
  geminiPrompt,
  setGeminiPrompt,
  resetGeminiPrompt,
  schemaLoaded,
  analyzeSchema,
  analyzing,
}: GeminiCredentialsProps) {
  const [isPromptDialogOpen, setIsPromptDialogOpen] = useState(false);
  const [tempPrompt, setTempPrompt] = useState(geminiPrompt);
  const timer = useTimer(analyzing);

  useEffect(() => {
    setTempPrompt(geminiPrompt);
  }, [geminiPrompt]);

  const handleSavePrompt = () => {
    setGeminiPrompt(tempPrompt);
    setIsPromptDialogOpen(false);
  };

  if (!schemaLoaded) return null;
  
  return (
    <Card className="w-1/2">
      <CardHeader>
        <CardTitle>Analyse Schema</CardTitle>
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
            className={schemaLoaded ? 'border-accent bg-accent/20' : ''}
            onChange={e => setGeminiApiKey(e.target.value)}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Click{' '}
          <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="hover:underline">
            here
          </a>{' '}
          to get a Gemini API Key. Your key is stored locally in your browser and never sent to our server.
        </p>
        <p className="text-sm text-muted-foreground">
          The default prompt will be sent to Gemini to analyse your base. Alternatively, modify it so it gives you an the kind of analysis
          you're looking for.
        </p>
      </CardContent>
      <CardFooter className="mt-auto">
        <div className="flex gap-2 w-full">
          <Button onClick={analyzeSchema} disabled={!schemaLoaded || analyzing}>
            {analyzing ? `Analyzing... (${timer}s)` : 'Analyse Schema'}
          </Button>

          <Dialog open={isPromptDialogOpen} onOpenChange={setIsPromptDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary">Modify Gemini Prompt</Button>
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
                <p className="text-xs text-gray-500 mt-2">The schema JSON will be appended to this prompt automatically.</p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={resetGeminiPrompt}>
                  Reset to Default
                </Button>
                <Button onClick={handleSavePrompt}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardFooter>
    </Card>
  );
}