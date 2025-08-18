import { memo, useMemo } from 'react';
import { Table as ShadTable, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Table, Schema, Field } from '../types/schema';
import TableRelationship from './TableRelationship';

interface TableAccordionItemProps {
  table: Table;
  baseId: string;
  filteredFields: Field[];
  activeSearchFilter: string;
  sortedTables: Record<string, boolean>;
  schema: Schema;
  getTableById: (id: string) => Table | undefined;
}

function TableAccordionItem({
  table,
  baseId,
  filteredFields,
  activeSearchFilter,
  sortedTables,
  schema,
  getTableById,
}: TableAccordionItemProps) {
  const sortedFields = useMemo(() => {
    return sortedTables[table.id]
      ? filteredFields
      : [...filteredFields].sort((a, b) => {
          const typeCompare = a.type.localeCompare(b.type);
          return typeCompare !== 0 ? typeCompare : a.name.localeCompare(b.name);
        });
  }, [filteredFields, sortedTables, table.id]);

  const tableRelationships = useMemo(() => {
    return schema.relationships.filter(rel => rel.from === table.id || rel.to === table.id);
  }, [schema.relationships, table.id]);

  return (
    <AccordionItem key={table.id} value={table.id}>
      <AccordionTrigger className="px-6">
        <div className="flex justify-between items-center w-full pr-4">
          <h2 className="text-md font-semibold text-card-foreground">{table.name}</h2>
          <span className="text-sm text-accent">
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
              {sortedFields.map(field => (
                <TableRow key={field.id} className="text-xs">
                  <TableCell className="">{field.name}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 text-xs text-secondary-foreground bg-secondary rounded-full">{field.type}</span>
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
                  <TableCell className="text-muted-foreground">{field.description || '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </ShadTable>
          <Separator />
          <div className="text-center text-sm font-semibold">Table Relationships</div>
          <div className="space-y-2">
            {tableRelationships.map(rel => (
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
}

export default memo(TableAccordionItem);