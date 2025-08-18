'use client'

import React from 'react';

import { Schema } from '../types/schema'

interface SchemaFormProps {
  loading: boolean
  schema: Schema | null
  onSubmit: (e: React.FormEvent) => void
}

export default function SchemaForm({ loading, schema, onSubmit }: SchemaFormProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);

  return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
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
          {!schema && (
            <p className="text-gray-600 mb-4">
              Enter your credentials in the "Edit Credentials" dialog above, then click the button below to fetch your Airtable schema.
            </p>
          )}
          {schema && (
            <p className="text-gray-600 mb-4">
              Your schema has been successfully loaded. You can now analyze it with Gemini or view the details below.
            </p>
          )}
          <form onSubmit={onSubmit} className="space-y-6" autoComplete="off">
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 text-white bg-blue-600 rounded-md focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? 'Loading Schema...' : schema ? 'Refresh Schema' : 'View Schema'}
            </button>
          </form>
        </div>
      </div>
  )
}