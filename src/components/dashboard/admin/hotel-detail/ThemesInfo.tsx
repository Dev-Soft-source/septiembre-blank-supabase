
import React from "react";
import { Tag } from "lucide-react";
import { AdminHotelDetail } from "@/types/hotel";

interface ThemesInfoProps {
  themes: AdminHotelDetail['hotel_themes'];
}

export function ThemesInfo({ themes }: ThemesInfoProps) {
  // Ensure themes is always an array and filter out any empty entries
  const validThemes = Array.isArray(themes) 
    ? themes.filter(theme => theme && theme.theme_id && theme.themes)
    : [];
  
  // Group themes by category for better display
  const groupedThemes = validThemes.reduce((acc, theme) => {
    const category = theme.themes?.category || "Uncategorized";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(theme);
    return acc;
  }, {} as Record<string, typeof validThemes>);

  return (
    <div className="rounded-xl p-6 bg-[#5A0080]">
      <h3 className="text-xl font-semibold mb-4 border-b pb-2 border-purple-700 flex items-center gap-2">
        <Tag className="w-5 h-5 text-purple-400" />
        Affinities
      </h3>
      {validThemes && validThemes.length > 0 ? (
        <div className="space-y-4">
          {Object.entries(groupedThemes).map(([category, categoryThemes]) => (
            <div key={category}>
              <h4 className="text-lg font-medium text-purple-300 mb-2 uppercase tracking-wide">
                {category}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-4">
                {categoryThemes.map((theme) => (
                  <div key={theme.theme_id} className="p-3 border border-purple-700/30 rounded-lg bg-purple-900/20">
                    <p className="font-medium text-purple-200">
                      {theme.themes?.name || "Unknown Affinity"}
                    </p>
                    {theme.themes?.description && (
                      <p className="text-sm text-gray-400 mt-1">{theme.themes.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No affinities associated with this hotel.</p>
      )}
    </div>
  );
}
