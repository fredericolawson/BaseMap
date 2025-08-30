import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Lock, Database, Shield, Server, Key, FileText, UserX, Eye, LogIn, CreditCard, ScrollText } from 'lucide-react';

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
        <p className="text-muted-foreground">How Base Map protects your API keys and data</p>
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
            <div className="bg-muted p-4 rounded-md text-accent text-sm">
              <p>Remember:</p>
              <p>
                While Base Map is designed to keep your API keys secure, you should always follow your organization's security policies when
                handling API credentials.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText />
              Privacy Policy
            </CardTitle>
            <CardDescription className="text-accent">How we handle your data</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div>
              <h3 className="font-semibold mb-2">Data Collection</h3>
              <p className="text-sm">
                Base Map does not collect, store, or transmit any personal data or API keys to our servers. All data processing occurs
                entirely within your browser.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Data Usage</h3>
              <ul className="text-sm list-disc pl-5 space-y-1">
                <li>API keys are stored only in your browser's local storage</li>
                <li>Schema data fetched from Airtable remains in your browser</li>
                <li>Analysis results from Gemini are displayed only in your browser</li>
                <li>No analytics or tracking cookies are used</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Third-Party Services</h3>
              <p className="text-sm">Your browser communicates directly with:</p>
              <ul className="text-sm list-disc pl-5 space-y-1">
                <li>
                  <strong>Airtable API:</strong> To fetch base schemas (requires your PAT)
                </li>
                <li>
                  <strong>Google Gemini API:</strong> To analyze schemas (requires your API key)
                </li>
              </ul>
              <p className="text-sm mt-2">These services have their own privacy policies and data handling practices.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserX />
              Data Deletion & Retention
            </CardTitle>
            <CardDescription className="text-accent">Control over your data</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div>
              <h3 className="font-semibold mb-2">Data Retention</h3>
              <p className="text-sm">
                All data (API keys, schemas, analysis results) is stored exclusively in your browser's local storage. Data persists until:
              </p>
              <ul className="text-sm list-disc pl-5 space-y-1 mt-2">
                <li>You manually clear it using the "Purge Storage" feature</li>
                <li>You clear your browser's local storage/cache</li>
                <li>You uninstall or reset your browser</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Data Deletion</h3>
              <p className="text-sm mb-2">You have complete control over your data:</p>
              <ul className="text-sm list-disc pl-5 space-y-1">
                <li>Use the "Purge Storage" button on the main page to instantly remove all stored data</li>
                <li>Clear individual API keys by removing them from the input fields</li>
                <li>No data exists on our servers to delete</li>
              </ul>
            </div>
            <div className="bg-muted p-4 rounded-md">
              <p className="text-sm font-semibold mb-1">Important:</p>
              <p className="text-sm">
                Since Base Map stores no data on servers, there is no account to delete or data to request. All data management happens in
                your browser.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LogIn />
              Google OAuth Authentication
            </CardTitle>
            <CardDescription className="text-accent">For user accounts and payments only</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div>
              <h3 className="font-semibold mb-2">Authentication Purpose</h3>
              <p className="text-sm mb-2">Base Map uses Google OAuth solely for:</p>
              <ul className="text-sm list-disc pl-5 space-y-1">
                <li>Creating and managing your user account</li>
                <li>Processing payments through Stripe</li>
                <li>Providing access to premium features</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Google OAuth Scopes</h3>
              <p className="text-sm mb-2">We request minimal Google account permissions:</p>
              <ul className="text-sm list-disc pl-5 space-y-1">
                <li>
                  <code className="bg-muted px-1 py-0.5 rounded">openid</code> - Authenticate your identity
                </li>
                <li>
                  <code className="bg-muted px-1 py-0.5 rounded">email</code> - Access your email address
                </li>
                <li>
                  <code className="bg-muted px-1 py-0.5 rounded">profile</code> - Access your basic profile info (name, picture)
                </li>
              </ul>
            </div>
            <div className="bg-muted p-4 rounded-md">
              <p className="text-sm font-semibold mb-1">Important:</p>
              <p className="text-sm">
                Google OAuth is ONLY used for user authentication. Your Airtable and Gemini API credentials are NEVER sent to our servers
                and remain exclusively in your browser.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye />
              API Credentials & Permissions
            </CardTitle>
            <CardDescription className="text-accent">How your API keys are handled</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div>
              <h3 className="font-semibold mb-2">Airtable Permissions</h3>
              <p className="text-sm mb-2">Base Map requires minimal Airtable permissions:</p>
              <ul className="text-sm list-disc pl-5 space-y-1">
                <li>
                  <code className="bg-muted px-1 py-0.5 rounded">schema.bases:read</code> - Read base schema only
                </li>
                <li>No access to actual record data</li>
                <li>No write permissions</li>
                <li>No user information access</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Google Gemini API Key</h3>
              <p className="text-sm mb-2">Your Gemini API key is used to:</p>
              <ul className="text-sm list-disc pl-5 space-y-1">
                <li>Send schema data for analysis directly from your browser</li>
                <li>Receive AI-generated insights</li>
                <li>Never stored in our database</li>
                <li>Remains in your browser's local storage only</li>
              </ul>
            </div>
            <div className="bg-muted p-4 rounded-md">
              <p className="text-sm font-semibold mb-1">Client-Side Security:</p>
              <p className="text-sm">Your API credentials (Airtable PAT and Gemini API key) are:</p>
              <ul className="text-sm list-disc pl-5 space-y-1 mt-2">
                <li>Never sent to our servers</li>
                <li>Never stored in our database</li>
                <li>Never associated with your user account</li>
                <li>Kept exclusively in your browser's local storage</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard />
              Payment Processing
            </CardTitle>
            <CardDescription className="text-accent">Secure payments through Stripe</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div>
              <h3 className="font-semibold mb-2">Payment Security</h3>
              <p className="text-sm mb-2">We use Stripe for secure payment processing:</p>
              <ul className="text-sm list-disc pl-5 space-y-1">
                <li>Payment information is processed directly by Stripe</li>
                <li>We never store credit card details</li>
                <li>All payment data is encrypted and PCI compliant</li>
                <li>Stripe handles all sensitive financial information</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Account Information</h3>
              <p className="text-sm">Your Google account is used only to:</p>
              <ul className="text-sm list-disc pl-5 space-y-1 mt-2">
                <li>Create a unique user ID for payment processing</li>
                <li>Associate your subscription with your account</li>
                <li>Send payment receipts to your email</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ScrollText />
              Terms of Service
            </CardTitle>
            <CardDescription className="text-accent">Your agreement with Base Map</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div>
              <h3 className="font-semibold mb-2">Service Usage</h3>
              <p className="text-sm">By using Base Map, you agree to:</p>
              <ul className="text-sm list-disc pl-5 space-y-1 mt-2">
                <li>Use the service in compliance with all applicable laws</li>
                <li>Not misuse or attempt to reverse-engineer the service</li>
                <li>Maintain the security of your own API credentials</li>
                <li>Accept responsibility for API usage costs with third-party providers</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Account Terms</h3>
              <p className="text-sm">When you create an account:</p>
              <ul className="text-sm list-disc pl-5 space-y-1 mt-2">
                <li>You must provide accurate account information</li>
                <li>You are responsible for maintaining account security</li>
                <li>You may cancel your subscription at any time</li>
                <li>Refunds are provided according to our refund policy</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Liability & Warranties</h3>
              <p className="text-sm">Base Map is provided "as is" without warranties. We are not liable for:</p>
              <ul className="text-sm list-disc pl-5 space-y-1 mt-2">
                <li>API costs incurred with Airtable or Google Gemini</li>
                <li>Data loss due to browser issues or user error</li>
                <li>Service interruptions or third-party API outages</li>
                <li>Indirect or consequential damages</li>
              </ul>
            </div>
            <div className="bg-muted p-4 rounded-md">
              <p className="text-sm font-semibold mb-1">Contact:</p>
              <p className="text-sm">For questions about these terms or to request account deletion, please contact support.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
