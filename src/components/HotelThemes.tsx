
import { HotelTheme } from "@/types/hotel";

interface HotelThemesDisplayProps {
  themes: HotelTheme[];
}

export function HotelThemesDisplay({ themes }: HotelThemesDisplayProps) {
  // Safety check for null or empty themes array
  if (!themes || themes.length === 0) {
    return null;
  }

  // Filter out any undefined or null themes
  const validThemes = themes.filter(theme => theme != null);
  
  if (validThemes.length === 0) {
    return null;
  }
  
  // Group valid themes by category
  const groupedThemes = validThemes.reduce((acc, theme) => {
    const category = theme.category || 'General';
    
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(theme);
    return acc;
  }, {} as Record<string, HotelTheme[]>);

  return (
    <div className="w-full bg-[#5A1876]/80 backdrop-blur-sm rounded-lg p-4 border border-[#5A1876]/20">
      <h3 className="text-sm uppercase tracking-wide text-fuchsia-300 font-medium mb-3">Hotel Affinities</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Object.entries(groupedThemes).map(([category, categoryThemes]) => (
          <div key={category} className="space-y-2">
            <h4 className="text-fuchsia-400 font-medium">{category}</h4>
            <ul className="space-y-1">
              {categoryThemes.map(theme => (
                <li key={theme.id} className="text-sm text-foreground/90 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-500"></span>
                  {theme.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
