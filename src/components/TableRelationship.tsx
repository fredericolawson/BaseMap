import { memo } from 'react';
import { Relationship, Table } from '../types/schema';

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
    <div className="text-xs bg-muted p-2 rounded-md border border-border hover:bg-muted/80 transition-colors">
      <span className="text-muted-foreground">
        {isSource ? 'Links to' : 'Linked from'} <span className="font-medium text-foreground">{otherTable.name}</span>
        {' via '}
        {isSource
          ? table.fields.find(f => f.id === relationship.fieldId)?.name
          : otherTable.fields.find(f => f.id === relationship.fieldId)?.name}{' '}
        ({relationship.type})
      </span>
    </div>
  );
}

export default memo(TableRelationship);