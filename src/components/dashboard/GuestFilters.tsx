
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";

interface GuestFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterStatus: 'all' | 'flagged' | 'frequent' | 'new';
  setFilterStatus: (status: 'all' | 'flagged' | 'frequent' | 'new') => void;
}

export const GuestFilters: React.FC<GuestFiltersProps> = React.memo(({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search guests by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
          aria-label="Search guests by name"
        />
      </div>
      <div className="flex gap-2">
        {(['all', 'flagged', 'frequent', 'new'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-2 text-sm rounded capitalize ${
              filterStatus === status
                ? 'bg-fuchsia-500/30 text-fuchsia-200'
                : 'bg-fuchsia-500/10 text-fuchsia-300 hover:bg-fuchsia-500/20'
            }`}
            aria-label={`Filter guests by ${status} status`}
          >
            {status}
          </button>
        ))}
      </div>
    </div>
  );
});
