import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface AirtableCredentialsProps {
  pat: string;
  setPat: (pat: string) => void;
  baseId: string;
  setBaseId: (baseId: string) => void;
  onFetchSchema: () => void;
  loading: boolean;
  schemaLoaded: boolean;
}

export default function AirtableCredentials({
  pat,
  setPat,
  baseId,
  setBaseId,
  onFetchSchema,
  loading,
  schemaLoaded,
}: AirtableCredentialsProps) {
  return (
    <Card className="w-1/2">
      <CardHeader>
        <CardTitle>Airtable</CardTitle>
        <CardDescription>Set your Airtable credentials</CardDescription>
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
            className={schemaLoaded ? 'border-accent bg-accent/20' : ''}
            onChange={e => setBaseId(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">Enter the ID of the base you want to analyse.</p>
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
              className={schemaLoaded ? 'border-accent bg-accent/20' : ''}
              onChange={e => setPat(e.target.value)}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Click{' '}
            <a
              href="https://airtable.com/create/tokens"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-muted-foreground"
            >
              here
            </a>{' '}
            to get an Airtable Personal Access Token. Set its scope to{' '}
            <span className=" text-muted-foreground px-1">schema.bases:read</span> only. Your token is stored locally in your browser and
            never sent to our server.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex gap-2">
          <Button onClick={onFetchSchema} disabled={!baseId || !pat || loading}>
            {loading ? 'Loading...' : 'Fetch Base Schema'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}