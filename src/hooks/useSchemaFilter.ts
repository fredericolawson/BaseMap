import { useState } from 'react';
import { Schema, Field } from '../types/schema';

export function useSchemaFilter() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearchFilter, setActiveSearchFilter] = useState('');

  const handleSearch = () => {
    setActiveSearchFilter(searchTerm);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setActiveSearchFilter('');
  };

  const getFilteredSchema = (schema: Schema): Schema => {
    if (!activeSearchFilter) return schema;

    return {
      ...schema,
      tables: schema.tables.map(table => ({
        ...table,
        fields: table.fields.filter(field => field.name.toLowerCase().includes(activeSearchFilter.toLowerCase())),
      })),
    };
  };

  const getFilteredFields = (fields: Field[], searchFilter: string) => {
    if (!searchFilter) return fields;
    return fields.filter(field => field.name.toLowerCase().includes(searchFilter.toLowerCase()));
  };

  return {
    searchTerm,
    setSearchTerm,
    activeSearchFilter,
    handleSearch,
    clearSearch,
    getFilteredSchema,
    getFilteredFields,
  };
}