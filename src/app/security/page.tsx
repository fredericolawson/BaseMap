import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Lock, Database, Shield, Server, Key } from "lucide-react"

export default function Security() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Link href="/">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Security & Privacy</h1>
        <p className="text-gray-600">How Base Map protects your API keys and data</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Client-Side Only Architecture
            </CardTitle>
            <CardDescription>Your API keys never leave your browser</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Base Map is designed with a <strong>client-side only architecture</strong>, which means:
            </p>
            <ul className="list-disc pl-5 space-y-2">
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
              <Database className="h-5 w-5" />
              Local Storage Security
            </CardTitle>
            <CardDescription>How your credentials are stored locally</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              When you enter your API keys:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>They are saved to your browser's local storage</li>
              <li>They remain on your device only</li>
              <li>They persist between sessions so you don't need to re-enter them</li>
              <li>They can be cleared at any time by using the purge function</li>
            </ul>
            <p className="mt-4 text-sm text-gray-600">
              Local storage is isolated to your browser and device, making it a secure way to store credentials for client-side applications.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Data Flow Protection
            </CardTitle>
            <CardDescription>How your data moves securely</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <Key className="h-4 w-4" /> Airtable Flow
                </h3>
                <ol className="list-decimal pl-5 space-y-1 text-sm">
                  <li>You enter your Airtable Personal Access Token (PAT) and Base ID</li>
                  <li>Your browser stores these credentials locally</li>
                  <li>When you fetch a schema, your browser makes a direct API call to Airtable</li>
                  <li>The schema is returned directly to your browser</li>
                  <li>No data passes through Base Map servers</li>
                </ol>
              </div>
              
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <Key className="h-4 w-4" /> Gemini Flow
                </h3>
                <ol className="list-decimal pl-5 space-y-1 text-sm">
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
              <Server className="h-5 w-5" />
              Best Practices
            </CardTitle>
            <CardDescription>Recommendations for API key security</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Use API keys with the minimum required permissions</li>
              <li>For Airtable, create a PAT with access only to the bases you need</li>
              <li>For Gemini, consider using an API key with usage limits</li>
              <li>Clear your stored credentials when using shared or public devices</li>
              <li>Keep your browser updated to benefit from the latest security patches</li>
            </ul>
            <div className="mt-4 p-3 bg-blue-50 rounded-md text-sm">
              <p className="font-medium text-blue-700">Remember:</p>
              <p className="text-blue-600">While Base Map is designed to keep your API keys secure, you should always follow your organization's security policies when handling API credentials.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}