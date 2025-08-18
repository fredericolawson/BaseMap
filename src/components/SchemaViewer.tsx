import { Schema } from '../types/schema';
import { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Accordion } from '@/components/ui/accordion';
import { copyToClipboard, downloadAsJson, generateTimestampedFilename } from '../utils/fileOperations';
import { useSchemaFilter } from '../hooks/useSchemaFilter';
import SchemaSearch from './SchemaSearch';
import TableAccordionItem from './TableAccordionItem';


interface SchemaViewerProps {
  schema: Schema;
  baseId: string;
}

export default function SchemaViewer({ schema, baseId }: SchemaViewerProps) {
  const [sortedTables] = useState<Record<string, boolean>>({});
  const {
    searchTerm,
    setSearchTerm,
    activeSearchFilter,
    handleSearch,
    clearSearch,
    getFilteredSchema,
    getFilteredFields,
  } = useSchemaFilter();

  const handleCopyJson = useCallback(() => {
    const filteredSchema = getFilteredSchema(schema);
    copyToClipboard(JSON.stringify(filteredSchema, null, 2));
  }, [schema, getFilteredSchema]);

  const handleDownloadJson = useCallback(() => {
    const filteredSchema = getFilteredSchema(schema);
    const filename = generateTimestampedFilename('basemap-schema', 'json');
    downloadAsJson(filteredSchema, filename);
  }, [schema, getFilteredSchema]);

  const getTableById = useMemo(() => {
    return (id: string) => schema.tables.find(table => table.id === id);
  }, [schema.tables]);

  return (
    <div className="space-y-6">
      <div className="flex justify-center space-x-4">
        <Button onClick={handleCopyJson} variant="secondary">
          Copy as JSON{activeSearchFilter && ' (filtered)'}
        </Button>
        <Button onClick={handleDownloadJson} variant="secondary">
          Download as JSON{activeSearchFilter && ' (filtered)'}
        </Button>
      </div>

      <SchemaSearch
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeSearchFilter={activeSearchFilter}
        onSearch={handleSearch}
        onClear={clearSearch}
      />

      <Accordion type="multiple" className="w-full bg-card rounded-lg border">
        {schema.tables.map(table => {
          const filteredFields = getFilteredFields(table.fields, activeSearchFilter);

          return (
            <TableAccordionItem
              key={table.id}
              table={table}
              baseId={baseId}
              filteredFields={filteredFields}
              activeSearchFilter={activeSearchFilter}
              sortedTables={sortedTables}
              schema={schema}
              getTableById={getTableById}
            />
          );
        })}
      </Accordion>
    </div>
  );
}
