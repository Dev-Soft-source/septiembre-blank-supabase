
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Star, Calendar, DollarSign } from 'lucide-react';

interface ExpertFiltersProps {
  activeFilters: {
    fiveAffinityMatches?: boolean;
    next60DaysOnly?: boolean;
    bestValueSort?: boolean;
  };
  onFilterChange: (filterType: string, value: boolean) => void;
}

export const ExpertFilters: React.FC<ExpertFiltersProps> = ({
  activeFilters,
  onFilterChange
}) => {
  return (
    <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-400/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-2 text-sm">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          Expert Filters
          <Badge variant="secondary" className="bg-yellow-400/20 text-yellow-200 text-xs">
            🌟
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="fiveAffinityMatches"
            checked={activeFilters.fiveAffinityMatches || false}
            onCheckedChange={(checked) => 
              onFilterChange('fiveAffinityMatches', checked as boolean)
            }
            className="border-yellow-400/50 data-[state=checked]:bg-yellow-500"
          />
          <label 
            htmlFor="fiveAffinityMatches" 
            className="text-sm text-white cursor-pointer flex items-center gap-1"
          >
            <Star className="w-3 h-3" />
            5+ Affinity Matches
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="next60DaysOnly"
            checked={activeFilters.next60DaysOnly || false}
            onCheckedChange={(checked) => 
              onFilterChange('next60DaysOnly', checked as boolean)
            }
            className="border-yellow-400/50 data-[state=checked]:bg-yellow-500"
          />
          <label 
            htmlFor="next60DaysOnly" 
            className="text-sm text-white cursor-pointer flex items-center gap-1"
          >
            <Calendar className="w-3 h-3" />
            Next 60 Days Available
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="bestValueSort"
            checked={activeFilters.bestValueSort || false}
            onCheckedChange={(checked) => 
              onFilterChange('bestValueSort', checked as boolean)
            }
            className="border-yellow-400/50 data-[state=checked]:bg-yellow-500"
          />
          <label 
            htmlFor="bestValueSort" 
            className="text-sm text-white cursor-pointer flex items-center gap-1"
          >
            <DollarSign className="w-3 h-3" />
            Best Value Sort
          </label>
        </div>
      </CardContent>
    </Card>
  );
};
