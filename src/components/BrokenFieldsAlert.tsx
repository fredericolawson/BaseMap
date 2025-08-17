import { AlertTriangle, ExternalLink } from 'lucide-react';
import { Schema } from '@/types/schema';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

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
    <div className={cn('bg-card border rounded-lg p-4 mb-6', 'shadow-sm')}>
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="mb-2">Configuration Issues Detected</h3>
          <p className="text-xs mb-3">
            {brokenFields.length} field{brokenFields.length !== 1 ? 's' : ''} in your Airtable base
            {brokenFields.length === 1 ? ' has' : ' have'} invalid configuration that may affect functionality:
          </p>
          <div className="space-y-2">
            {brokenFields.map(field => {
              const airtableUrl = `https://airtable.com/${baseId}/${field.tableId}/?blocks=hide&fieldManager=true`;

              return (
                <div key={`${field.tableId}-${field.fieldId}`} className="bg-accent/20 rounded-md px-3 py-2 border border-accent">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">{field.tableName}</span>
                      <span className="text-xs">•</span>
                      <span className="text-xs">{field.fieldName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 bg-secondary rounded-full">{field.fieldType}</span>
                      <Button variant="outline" size="sm" asChild>
                        <a href={airtableUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3" />
                          Fix in Airtable
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 pt-3 border-t border-blue-200">
            <p className="text-xs">💡 These issues should be resolved in your Airtable base to ensure proper functionality.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
