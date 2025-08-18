import { memo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface SchemaSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeSearchFilter: string;
  onSearch: () => void;
  onClear: () => void;
}

function SchemaSearch({
  searchTerm,
  setSearchTerm,
  activeSearchFilter,
  onSearch,
  onClear,
}: SchemaSearchProps) {
  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search fields..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="pl-10"
          onKeyDown={e => e.key === 'Enter' && onSearch()}
        />
      </div>
      <Button onClick={onSearch} variant="default">
        Search
      </Button>
      {activeSearchFilter && (
        <Button onClick={onClear} variant="secondary">
          Clear
        </Button>
      )}
    </div>
  );
}

export default memo(SchemaSearch);