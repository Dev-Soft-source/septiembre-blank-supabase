
import React from "react";
import { Badge } from "@/components/ui/badge";
import { ThemeTag } from "@/components/ThemeTag";

interface UserAffinitiesSectionProps {
  themes: any[];
  userPreferences: any;
}

export const UserAffinitiesSection: React.FC<UserAffinitiesSectionProps> = ({ themes, userPreferences }) => {
  // Check if user has any favorite themes
  const hasThemes = themes && themes.length > 0;
  
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground mb-2">User Affinities/Interests</h3>
      
      {hasThemes ? (
        <div className="flex flex-wrap gap-2">
          {themes.map(theme => (
            <ThemeTag key={theme.id} theme={theme} size="md" />
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">No affinities selected.</p>
      )}
      
      {userPreferences && userPreferences.favorite_themes && userPreferences.favorite_themes.length > 0 && themes.length === 0 && (
        <p className="text-sm text-amber-500">
          User has {userPreferences.favorite_themes.length} theme IDs that couldn't be matched to existing themes.
        </p>
      )}
    </div>
  );
};
