
import React from "react";
import { Tag, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ThemesActivitiesProps {
  hotel: any;
}

export function ThemesActivities({ hotel }: ThemesActivitiesProps) {
  const themes = hotel.hotel_themes || [];
  const activities = hotel.hotel_activities || [];
  
  const validThemes = Array.isArray(themes) 
    ? themes.filter(theme => theme && theme.theme_id && theme.themes) 
    : [];
  
  const validActivities = Array.isArray(activities) 
    ? activities.filter(activity => {
        const hasActivityId = activity?.activity_id;
        const hasActivitiesObject = activity?.activities;
        return hasActivityId || hasActivitiesObject;
      }) 
    : [];

  // Group themes by category for hierarchical display
  const groupedThemes = validThemes.reduce((acc, theme) => {
    const category = theme.themes?.category || "Uncategorized";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(theme);
    return acc;
  }, {} as Record<string, typeof validThemes>);

  // Group activities by category for hierarchical display
  const groupedActivities = validActivities.reduce((acc, activity) => {
    const category = activity.activities?.category || "Uncategorized";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(activity);
    return acc;
  }, {} as Record<string, typeof validActivities>);

  return (
    <div className="space-y-6">
      <div>
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
                  {Array.isArray(categoryThemes) && categoryThemes.map((theme) => (
                    <div key={theme.theme_id} className="p-3 border border-purple-700/30 rounded-lg bg-purple-900/20">
                      <p className="font-medium text-purple-300">
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
          <p className="text-gray-400">No affinities associated with this hotel.</p>
        )}
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4 border-b pb-2 border-purple-700 flex items-center gap-2">
          <Activity className="w-5 h-5 text-purple-400" />
          Activities
        </h3>
        {validActivities && validActivities.length > 0 ? (
          <div className="space-y-4">
            {Object.entries(groupedActivities).map(([category, categoryActivities]) => (
              <div key={category}>
                <h4 className="text-lg font-medium text-purple-300 mb-2 uppercase tracking-wide">
                  {category}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-4">
                  {Array.isArray(categoryActivities) && categoryActivities.map((activity, index) => {
                    const activityName = activity.activities?.name || `Activity ID: ${activity.activity_id}` || `Activity ${index + 1}`;
                    
                    return (
                      <div key={activity.activity_id || index} className="p-3 border border-purple-700/30 rounded-lg bg-purple-900/20">
                        <p className="font-medium text-purple-300">
                          {activityName}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No activities associated with this hotel.</p>
        )}
      </div>
    </div>
  );
}
