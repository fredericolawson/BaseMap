'use client'

import React from 'react';

import { EyeIcon, EyeOffIcon } from "lucide-react"
import { Schema } from '../types/schema'

interface SchemaFormProps {
  pat: string
  baseId: string
  loading: boolean
  schema: Schema | null
  setPat: (value: string) => void
  setBaseId: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
}

export default function SchemaForm({ pat, baseId, loading, schema, setPat, setBaseId, onSubmit }: SchemaFormProps) {
  const [showPat, setShowPat] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(true);

  return (
    <div className="border p-4 rounded-lg">
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h2 className="text-lg font-bold">Schema Configuration</h2>
        {schema && (
          <button
            type="button"
            className="text-sm text-muted-foreground"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        )}
      </div>
      
      <div className={`transition-all duration-300 ease-in-out ${!isExpanded ? 'h-0 opacity-0 overflow-hidden' : ''}`}>
        <form onSubmit={onSubmit} className="space-y-6" autoComplete="off">
          <div className="space-y-2">
            <label className="block mb-2" htmlFor="pat">Personal Access Token</label>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <input
                  id="pat"
                  name="pat"
                  type={showPat ? "text" : "password"}
                  value={pat}
                  onChange={(e) => setPat(e.target.value)}
                  placeholder=""
                  required
                  autoComplete="new-password"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  className="border rounded-md px-3 py-2 w-full"
                />
              </div>
              <button
                type="button"
                className="bg-gray-200 text-gray-600 px-4 py-2 rounded-md"
                onClick={() => setShowPat(!showPat)}
              >
                {showPat ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-sm text-muted-foreground">
              Click <a href="https://airtable.com/create/tokens" target="_blank" rel="noopener noreferrer" className="underline">here</a> to get an Airtable Personal Access Token.
              Your token is stored locally in your browser and never sent to our servers.
            </p>
          </div>

          <div className="space-y-2">
            <label className="block mb-2" htmlFor="baseId">Base ID</label>
            <input
              id="baseId"
              name="baseId"
              type="text"
              value={baseId}
              onChange={(e) => setBaseId(e.target.value)}
              placeholder="app..."
              required
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              className="border rounded-md px-3 py-2 w-full"
            />
            <p className="text-sm text-muted-foreground">
              Find your Base ID in the Airtable API documentation for your base.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
          >
            {loading ? 'Loading...' : 'View Schema'}
          </button>
        </form>
      </div>
    </div>
  )
}