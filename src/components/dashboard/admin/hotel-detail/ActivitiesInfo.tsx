
import React from "react";
import { Activity } from "lucide-react";
import { AdminHotelDetail } from "@/types/hotel";

interface ActivitiesInfoProps {
  activities: AdminHotelDetail['hotel_activities'];
}

export function ActivitiesInfo({ activities }: ActivitiesInfoProps) {
  console.log("ActivitiesInfo - Raw activities data:", activities);
  
  // Ensure activities is always an array and filter out any empty entries
  const validActivities = Array.isArray(activities) 
    ? activities.filter(activity => {
        console.log("ActivitiesInfo - Processing activity:", activity);
        // Check if activity has either activity_id or activities object
        const hasActivityId = activity?.activity_id;
        const hasActivitiesObject = activity?.activities;
        const isValid = hasActivityId || hasActivitiesObject;
        console.log("ActivitiesInfo - Activity validation:", { hasActivityId, hasActivitiesObject, isValid });
        return isValid;
      })
    : [];
  
  console.log("ActivitiesInfo - Valid activities after filtering:", validActivities);

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
    <div className="rounded-xl p-6 bg-[#5A0080]">
      <h3 className="text-xl font-semibold mb-4 border-b pb-2 border-purple-700 flex items-center gap-2">
        <Activity className="w-5 h-5 text-purple-400" />
        Activities
      </h3>
      {validActivities && validActivities.length > 0 ? (
        <div className="space-y-4">
          {Object.entries(groupedActivities).map(([category, categoryActivities]) => (
            <div key={category}>
              <h4 className="text-lg font-medium text-purple-300 mb-3 uppercase tracking-wide">
                {category}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-4">
                {Array.isArray(categoryActivities) && categoryActivities.map((activity, index) => {
                  console.log("ActivitiesInfo - Rendering activity:", activity);
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
        <div className="text-center py-4">
          <p className="text-gray-400">No activities associated with this hotel.</p>
          <p className="text-xs text-gray-500 mt-2">Activities count: {activities?.length || 0}</p>
        </div>
      )}
    </div>
  );
}
