import { AlertTriangle, ExternalLink } from 'lucide-react';
import { Schema } from '@/types/schema';
import { cn } from '@/lib/utils';

interface BrokenFieldsAlertProps {
  schema: Schema;
  baseId: string;
}

export default function BrokenFieldsAlert({ schema, baseId }: BrokenFieldsAlertProps) {
  // Find all broken fields across all tables
  const brokenFields = schema.tables.flatMap(table =>
    table.fields
      .filter(field => field.isValid === false)
      .map(field => ({
        tableName: table.name,
        fieldName: field.name,
        fieldType: field.type,
        tableId: table.id,
        fieldId: field.id,
      }))
  );

  // Don't render if no broken fields
  if (brokenFields.length === 0) {
    return null;
  }

  return (
    <div className={cn('bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6', 'shadow-sm')}>
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">Configuration Issues Detected</h3>
          <p className="text-xs text-blue-700 mb-3">
            {brokenFields.length} field{brokenFields.length !== 1 ? 's' : ''} in your Airtable base
            {brokenFields.length === 1 ? ' has' : ' have'} invalid configuration that may affect functionality:
          </p>
          <div className="space-y-2">
            {brokenFields.map(field => {
              const airtableUrl = `https://airtable.com/${baseId}/${field.tableId}/?blocks=hide&fieldManager=true`;

              return (
                <div key={`${field.tableId}-${field.fieldId}`} className="bg-white rounded-md px-3 py-2 border border-blue-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-900">{field.tableName}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-700">{field.fieldName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{field.fieldType}</span>
                      <a
                        href={airtableUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          'inline-flex items-center gap-1 px-2 py-1',
                          'text-xs text-blue-700 hover:text-blue-800',
                          'bg-blue-50 hover:bg-blue-100',
                          'border border-blue-200 hover:border-blue-300',
                          'rounded-md transition-colors'
                        )}
                      >
                        <ExternalLink className="h-3 w-3" />
                        Fix in Airtable
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 pt-3 border-t border-blue-200">
            <p className="text-xs text-blue-600">
              💡 These issues should be resolved in your Airtable base to ensure proper functionality.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
