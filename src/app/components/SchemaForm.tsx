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

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-row items-center justify-between pb-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Schema Configuration</h2>
          {schema && (
            <button
              type="button"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </button>
          )}
        </div>
        
        <div className={`transition-all duration-300 ease-in-out ${!isExpanded ? 'h-0 opacity-0 overflow-hidden' : 'mt-6'}`}>
          <form onSubmit={onSubmit} className="space-y-6" autoComplete="off">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700" htmlFor="pat">Personal Access Token</label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <input
                    id="pat"
                    name="pat"
                    type={showPat ? "text" : "password"}
                    value={pat}
                    onChange={(e) => setPat(e.target.value)}
                    placeholder="pat_..."
                    required
                    autoComplete="new-password"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-shadow"
                  />
                </div>
                <button
                  type="button"
                  className="px-3 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  onClick={() => setShowPat(!showPat)}
                >
                  {showPat ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-sm text-gray-500">
                Click <a href="https://airtable.com/create/tokens" target="_blank" rel="noopener noreferrer" className="hover:underline">here</a> to get an Airtable Personal Access Token.
                Your token is stored locally in your browser and never sent to our servers.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700" htmlFor="baseId">Base ID</label>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-shadow"
              />
              <p className="text-sm text-gray-500">
                Find your Base ID in the Airtable API documentation for your base.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Loading...' : 'View Schema'}
            </button>
          </form>
        </div>
      </div>

  )
}