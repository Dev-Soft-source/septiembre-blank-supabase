
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Activity {
  id: string;
  name: string;
  category?: string;
  parent_id?: string | null;
  level: 1 | 2 | 3;
  sort_order?: number;
  created_at?: string;
  children?: Activity[];
}

interface HierarchicalActivity extends Activity {
  children: HierarchicalActivity[];
}

export const useHierarchicalActivities = () => {
  const [activities, setActivities] = useState<HierarchicalActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data: activitiesData, error: activitiesError } = await supabase
          .from('activities')
          .select('*')
          .order('sort_order');
        
        if (activitiesError) {
          console.error("Error fetching activities:", activitiesError);
          setError(activitiesError.message);
          return;
        }

        // Transform the data to match our Activity interface with proper type casting
        const transformedActivities: Activity[] = (activitiesData || []).map(activity => ({
          id: activity.id,
          name: activity.name,
          category: activity.category || undefined,
          parent_id: activity.parent_id,
          level: activity.level as 1 | 2 | 3, // Type cast to ensure compatibility
          sort_order: activity.sort_order || undefined,
          created_at: activity.created_at,
        }));

        // Organize activities into hierarchy
        const organizedActivities = organizeActivitiesHierarchically(transformedActivities);
        setActivities(organizedActivities);
        
      } catch (err) {
        console.error("Error in fetchActivities:", err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return { activities, loading, error };
};

const organizeActivitiesHierarchically = (flatActivities: Activity[]): HierarchicalActivity[] => {
  const activityMap = new Map<string, HierarchicalActivity>();
  
  // Initialize all activities in the map
  flatActivities.forEach(activity => {
    activityMap.set(activity.id, {
      ...activity,
      children: []
    });
  });

  const rootActivities: HierarchicalActivity[] = [];

  // Build the hierarchy
  flatActivities.forEach(activity => {
    const activityNode = activityMap.get(activity.id)!;
    
    if (activity.parent_id && activityMap.has(activity.parent_id)) {
      // Add to parent's children
      const parent = activityMap.get(activity.parent_id)!;
      if (!parent.children) parent.children = [];
      parent.children.push(activityNode);
    } else if (activity.level === 1) {
      // Root level activity (category)
      rootActivities.push(activityNode);
    }
  });

  return rootActivities;
};
