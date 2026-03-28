
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslationWithFallback } from "@/hooks/useTranslationWithFallback";

interface ThemesSectionProps {
  themes: any[];
  pagination: {
    page: number;
    totalThemes: number;
    hasMore: boolean;
    setPage: (page: number) => void;
    pageSize: number;
  };
}

export const ThemesSection = ({ themes, pagination }: ThemesSectionProps) => {
  const { page, totalThemes, hasMore, setPage, pageSize } = pagination;
  const { tAriaLabel } = useTranslationWithFallback();
  
  const startIndex = (page - 1) * pageSize + 1;
  const endIndex = Math.min(page * pageSize, totalThemes);
  
  if (themes.length === 0) {
    return <p className="text-center py-4">No theme preferences found for this user.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
        {themes.map((theme) => (
          <div key={theme.id} className="p-2 bg-white/10 rounded-md">
            <div className="font-medium">{theme.name}</div>
            <div className="text-xs text-muted-foreground">{theme.category}</div>
          </div>
        ))}
      </div>
      
      {totalThemes > pageSize && (
        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex}-{endIndex} of {totalThemes}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">{tAriaLabel('ui.navigation.previousPage')}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={!hasMore}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">{tAriaLabel('ui.navigation.nextPage')}</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
