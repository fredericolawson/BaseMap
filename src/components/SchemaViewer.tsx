import { Schema, Table, Relationship } from "../types/schema";
import { useState } from "react";

interface TableRelationshipProps {
  relationship: Relationship;
  table: Table;
  getTableById: (id: string) => Table | undefined;
  isSource: boolean;
}

function TableRelationship({
  relationship,
  table,
  getTableById,
  isSource,
}: TableRelationshipProps) {
  const otherTable = getTableById(
    isSource ? relationship.to : relationship.from
  );
  if (!otherTable) return null;

  return (
    <div className="text-sm bg-gray-50 p-3 rounded-md border border-gray-200 hover:bg-gray-100 transition-colors">
      <span className="text-gray-600">
        {isSource ? "Links to" : "Linked from"}{" "}
        <span className="font-medium">{otherTable.name}</span>
        {" via "}
        {isSource
          ? table.fields.find((f) => f.id === relationship.fieldId)?.name
          : otherTable.fields.find((f) => f.id === relationship.fieldId)
              ?.name}{" "}
        ({relationship.type})
      </span>
    </div>
  );
}

interface SchemaViewerProps {
  schema: Schema;
  onCopyJson: () => void;
  onDownloadJson: () => void;
}

export default function SchemaViewer({
  schema,
  onCopyJson,
  onDownloadJson,
}: SchemaViewerProps) {
  const getTableById = (id: string) =>
    schema.tables.find((table) => table.id === id);
  const [sortedTables, setSortedTables] = useState<Record<string, boolean>>({});
  console.log(schema);

  const sortFieldsByType = (tableId: string) => {
    setSortedTables((prev) => ({
      ...prev,
      [tableId]: !prev[tableId],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center space-x-4">
        <button
          onClick={onCopyJson}
          className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500/20 transition-colors"
        >
          Copy as JSON
        </button>
        <button
          onClick={onDownloadJson}
          className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500/20 transition-colors"
        >
          Download as JSON
        </button>
      </div>

      {schema.tables.map((table) => (
        <div
          key={table.id}
          className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
        >
          <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              {table.name}
            </h2>
            <div className="flex flex-col items-end gap-2">
              <button
                onClick={() => sortFieldsByType(table.id)}
                className="px-3 py-1.5 text-sm text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
              >
                Sort Fields by Type
              </button>
              <span className="text-sm text-gray-500">
                {table.fields.length} fields
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="">
              {(sortedTables[table.id]
                ? [...table.fields].sort((a, b) => a.type.localeCompare(b.type))
                : table.fields
              ).map((field) => (
                <div
                  key={field.id}
                  className="group p-2 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900">
                      {field.name}
                    </span>
                    <span className="ml-2 px-2 py-0.5 text-xs text-gray-600 bg-gray-100 rounded-full">
                      {field.type}
                    </span>
                  </div>
                  {field.description && (
                    <p className="text-xs text-gray-500 mt-1">
                      {field.description}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {schema.relationships
              .filter((rel) => rel.from === table.id || rel.to === table.id)
              .map((rel) => (
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
      ))}
    </div>
  );
}
