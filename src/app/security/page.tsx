import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Lock, Database, Shield, Server, Key } from 'lucide-react';

export default function Security() {
  return (
    <div className="flex flex-col gap-4">
      <Link href="/">
        <Button variant="outline" size="sm">
          <ArrowLeft />
          Back to Dashboard
        </Button>
      </Link>

      <div>
        <h1>Security & Privacy</h1>
        <p>How Base Map protects your API keys and data</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock />
              Client-Side Only Architecture
            </CardTitle>
            <CardDescription className="text-accent">Your API keys never leave your browser</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Base Map is designed with a <strong>client-side only architecture</strong>, which means:
            </p>
            <ul>
              <li>All API keys are stored exclusively in your browser's local storage</li>
              <li>API requests to Airtable and Gemini are made directly from your browser</li>
              <li>No data or credentials ever pass through our servers</li>
              <li>Your browser communicates directly with the API providers</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database />
              Local Storage Security
            </CardTitle>
            <CardDescription className="text-accent">How your credentials are stored locally</CardDescription>
          </CardHeader>
          <CardContent>
            <p>When you enter your API keys:</p>
            <ul>
              <li>They are saved to your browser's local storage</li>
              <li>They remain on your device only</li>
              <li>They persist between sessions so you don't need to re-enter them</li>
              <li>They can be cleared at any time by using the purge function</li>
            </ul>
            <p>
              Local storage is isolated to your browser and device, making it a secure way to store credentials for client-side
              applications.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield />
              Data Flow Protection
            </CardTitle>
            <CardDescription className="text-accent">How your data moves securely</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2 bg-muted p-4 rounded-md">
                <h3 className="flex items-center gap-2">
                  <Key /> Airtable Flow
                </h3>
                <ol>
                  <li>You enter your Airtable Personal Access Token (PAT) and Base ID</li>
                  <li>Your browser stores these credentials locally</li>
                  <li>When you fetch a schema, your browser makes a direct API call to Airtable</li>
                  <li>The schema is returned directly to your browser</li>
                  <li>No data passes through Base Map servers</li>
                </ol>
              </div>

              <div className="flex flex-col gap-2 bg-muted p-4 rounded-md">
                <h3 className="flex items-center gap-2">
                  <Key /> Gemini Flow
                </h3>
                <ol>
                  <li>You enter your Gemini API key</li>
                  <li>Your browser stores the key locally</li>
                  <li>When analyzing a schema, your browser makes a direct API call to Gemini</li>
                  <li>The analysis is returned directly to your browser</li>
                  <li>No data passes through Base Map servers</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server />
              Best Practices
            </CardTitle>
            <CardDescription className="text-accent">Recommendations for API key security</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <ul>
              <li>Use API keys with the minimum required permissions</li>
              <li>For Airtable, create a PAT with access only to the bases you need</li>
              <li>For Gemini, consider using an API key with usage limits</li>
              <li>Clear your stored credentials when using shared or public devices</li>
              <li>Keep your browser updated to benefit from the latest security patches</li>
            </ul>
            <div className="bg-muted p-4 rounded-md">
              <p>Remember:</p>
              <p>
                While Base Map is designed to keep your API keys secure, you should always follow your organization's security policies when
                handling API credentials.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
