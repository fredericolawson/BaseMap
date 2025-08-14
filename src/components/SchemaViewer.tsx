import { Schema, Table, Relationship } from '../types/schema';
import { useState } from 'react';
import { Table as ShadTable, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface TableRelationshipProps {
  relationship: Relationship;
  table: Table;
  getTableById: (id: string) => Table | undefined;
  isSource: boolean;
}

function TableRelationship({ relationship, table, getTableById, isSource }: TableRelationshipProps) {
  const otherTable = getTableById(isSource ? relationship.to : relationship.from);
  if (!otherTable) return null;

  return (
    <div className="text-sm bg-gray-50 p-3 rounded-md border border-gray-200 hover:bg-gray-100 transition-colors">
      <span className="text-gray-600">
        {isSource ? 'Links to' : 'Linked from'} <span className="font-medium">{otherTable.name}</span>
        {' via '}
        {isSource
          ? table.fields.find(f => f.id === relationship.fieldId)?.name
          : otherTable.fields.find(f => f.id === relationship.fieldId)?.name}{' '}
        ({relationship.type})
      </span>
    </div>
  );
}

interface SchemaViewerProps {
  schema: Schema;
  onCopyJson: () => void;
  onDownloadJson: () => void;
  baseId: string;
}

export default function SchemaViewer({ schema, onCopyJson, onDownloadJson, baseId }: SchemaViewerProps) {
  const getTableById = (id: string) => schema.tables.find(table => table.id === id);
  const [sortedTables, setSortedTables] = useState<Record<string, boolean>>({});

  const sortFieldsByType = (tableId: string) => {
    setSortedTables(prev => ({
      ...prev,
      [tableId]: !prev[tableId],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center space-x-4">
        <Button onClick={onCopyJson} variant="outline">
          Copy as JSON
        </Button>
        <Button onClick={onDownloadJson} variant="outline">
          Download as JSON
        </Button>
      </div>

      <Accordion type="multiple" className="w-full bg-white rounded-lg border">
        {schema.tables.map(table => (
          <AccordionItem key={table.id} value={table.id}>
            <AccordionTrigger className="px-6">
              <div className="flex justify-between items-center w-full pr-4">
                <h2 className="text-lg font-semibold text-gray-900">{table.name}</h2>
                <span className="text-sm text-gray-500">{table.fields.length} fields</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6">
              <div className="space-y-6">
                <div className="flex justify-end">
                  <Button onClick={() => sortFieldsByType(table.id)} variant="secondary" size="sm">
                    {sortedTables[table.id] ? 'Original Order' : 'Default Sort'}
                  </Button>
                </div>

                <ShadTable>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Field Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Edit</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(sortedTables[table.id]
                      ? table.fields
                      : [...table.fields].sort((a, b) => {
                          const typeCompare = a.type.localeCompare(b.type);
                          return typeCompare !== 0 ? typeCompare : a.name.localeCompare(b.name);
                        })
                    ).map(field => (
                      <TableRow key={field.id}>
                        <TableCell className="font-medium">{field.name}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 text-xs text-gray-800 bg-gray-100 rounded-full">{field.type}</span>
                        </TableCell>
                        <TableCell>
                          <Button variant="secondary" size="sm" className="w-fulltext-xs mr-2 text-xs" asChild>
                            <Link
                              href={`https://airtable.com/${baseId}/${table.id}/?blocks=hide&fieldManager=true`}
                              target="_blank"
                              className="flex items-center gap-1"
                            >
                              <ExternalLink size={8} />
                              Edit
                            </Link>
                          </Button>
                        </TableCell>
                        <TableCell className="text-gray-500">{field.description || '—'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </ShadTable>

                {schema.relationships
                  .filter(rel => rel.from === table.id || rel.to === table.id)
                  .map(rel => (
                    <TableRelationship
                      key={rel.fieldId}
                      relationship={rel}
                      table={table}
                      getTableById={getTableById}
                      isSource={rel.from === table.id}
                    />
                  ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
