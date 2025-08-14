import { Schema, Table, Relationship } from '../types/schema';
import { useState } from 'react';
import { Table as ShadTable, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ExternalLink, Search } from 'lucide-react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

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
    <div className="text-xs bg-gray-50 p-2 rounded-md border border-gray-200 hover:bg-gray-100 transition-colors">
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
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearchFilter, setActiveSearchFilter] = useState('');

  const sortFieldsByType = (tableId: string) => {
    setSortedTables(prev => ({
      ...prev,
      [tableId]: !prev[tableId],
    }));
  };

  const handleSearch = () => {
    setActiveSearchFilter(searchTerm);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setActiveSearchFilter('');
  };

  const getFilteredSchema = (): Schema => {
    if (!activeSearchFilter) return schema;
    
    return {
      ...schema,
      tables: schema.tables.map(table => ({
        ...table,
        fields: table.fields.filter(field =>
          field.name.toLowerCase().includes(activeSearchFilter.toLowerCase())
        )
      }))
    };
  };

  const handleCopyJson = () => {
    const filteredSchema = getFilteredSchema();
    navigator.clipboard.writeText(JSON.stringify(filteredSchema, null, 2));
  };

  const handleDownloadJson = () => {
    const filteredSchema = getFilteredSchema();
    const blob = new Blob([JSON.stringify(filteredSchema, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().split('T')[0];
    
    link.href = url;
    link.download = `basemap-schema-${timestamp}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center space-x-4">
        <Button onClick={handleCopyJson} variant="outline">
          Copy as JSON{activeSearchFilter && ' (filtered)'}
        </Button>
        <Button onClick={handleDownloadJson} variant="outline">
          Download as JSON{activeSearchFilter && ' (filtered)'}
        </Button>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search fields..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10"
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch} variant="outline">
          Search
        </Button>
        {activeSearchFilter && (
          <Button onClick={clearSearch} variant="outline">
            Clear
          </Button>
        )}
      </div>

      <Accordion type="multiple" className="w-full bg-white rounded-lg border">
        {schema.tables.map(table => {
          const filteredFields = table.fields.filter(field => 
            activeSearchFilter === '' || field.name.toLowerCase().includes(activeSearchFilter.toLowerCase())
          );
          
          return (
            <AccordionItem key={table.id} value={table.id}>
              <AccordionTrigger className="px-6">
                <div className="flex justify-between items-center w-full pr-4">
                  <h2 className="text-md font-semibold text-gray-900">{table.name}</h2>
                  <span className="text-sm text-gray-500">
                    {activeSearchFilter ? `${filteredFields.length} of ${table.fields.length}` : `${table.fields.length}`} fields
                  </span>
                </div>
              </AccordionTrigger>
            <AccordionContent className="px-6">
              <div className="space-y-4">
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
                      ? filteredFields
                      : [...filteredFields].sort((a, b) => {
                          const typeCompare = a.type.localeCompare(b.type);
                          return typeCompare !== 0 ? typeCompare : a.name.localeCompare(b.name);
                        })
                    ).map(field => (
                        <TableRow key={field.id} className="text-xs">
                          <TableCell className="">{field.name}</TableCell>
                          <TableCell>
                            <span className="px-2 py-1 text-xs text-gray-800 bg-gray-100 rounded-full">{field.type}</span>
                          </TableCell>
                          <TableCell>
                            <Link
                              href={`https://airtable.com/${baseId}/${table.id}/?blocks=hide&fieldManager=true`}
                              target="_blank"
                              className="flex items-center gap-1 text-xs bg-secondary text-secondary-foreground px-2 py-1.5 rounded-md hover:bg-secondary/80"
                            >
                              <ExternalLink size={12} />
                              Edit
                            </Link>
                          </TableCell>
                          <TableCell className="text-gray-500">{field.description || '—'}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </ShadTable>
                <Separator />
                <div className="text-center text-sm font-semibold">Table Relationships</div>
                <div className="space-y-2">
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
              </div>
            </AccordionContent>
          </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
