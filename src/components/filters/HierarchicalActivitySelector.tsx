
import React, { useState, useMemo } from "react";
import { useHierarchicalActivities } from "@/hooks/useHierarchicalActivities";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

interface HierarchicalActivitySelectorProps {
  selectedActivities: string[];
  onActivitySelect: (activityId: string, isSelected: boolean) => void;
  allowMultiple?: boolean;
  className?: string;
  searchQuery?: string;
}

export const HierarchicalActivitySelector: React.FC<HierarchicalActivitySelectorProps> = ({
  selectedActivities,
  onActivitySelect,
  allowMultiple = true,
  className = "",
  searchQuery = ""
}) => {
  const { activities, loading, error } = useHierarchicalActivities();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedSubcategories, setExpandedSubcategories] = useState<Set<string>>(new Set());

  // Filter activities based on search query
  const filteredActivities = useMemo(() => {
    if (!searchQuery.trim()) {
      return activities;
    }

    const lowercaseQuery = searchQuery.toLowerCase();
    
    // Function to check if an activity matches the query
    const activityMatches = (activity: any) => {
      return activity.name.toLowerCase().includes(lowercaseQuery);
    };

    // Recursively filter activities while maintaining hierarchy
    const filterActivityHierarchy = (activityList: any[]): any[] => {
      return activityList
        .map(activity => {
          const hasMatchingChildren = activity.children && activity.children.length > 0;
          let filteredChildren: any[] = [];
          
          if (hasMatchingChildren) {
            filteredChildren = filterActivityHierarchy(activity.children);
          }
          
          // Include activity if it matches or has matching children
          if (activityMatches(activity) || filteredChildren.length > 0) {
            return {
              ...activity,
              children: filteredChildren
            };
          }
          
          return null;
        })
        .filter(Boolean);
    };

    return filterActivityHierarchy(activities);
  }, [searchQuery, activities]);

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleSubcategory = (subcategoryId: string) => {
    const newExpanded = new Set(expandedSubcategories);
    if (newExpanded.has(subcategoryId)) {
      newExpanded.delete(subcategoryId);
    } else {
      newExpanded.add(subcategoryId);
    }
    setExpandedSubcategories(newExpanded);
  };

  const handleActivitySelect = (activityId: string) => {
    const isCurrentlySelected = selectedActivities.includes(activityId);
    
    if (!allowMultiple && !isCurrentlySelected) {
      // Clear all other selections for single selection mode
      selectedActivities.forEach(id => {
        if (id !== activityId) {
          onActivitySelect(id, false);
        }
      });
    }
    
    onActivitySelect(activityId, !isCurrentlySelected);
  };

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <Spinner size="sm" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-sm p-4">
        Error loading activities: {error}
      </div>
    );
  }

  if (!filteredActivities || filteredActivities.length === 0) {
    return (
      <div className="text-gray-500 text-sm p-4">
        {searchQuery ? "No activities found matching your search." : "No activities available"}
      </div>
    );
  }

  const renderActivity = (activity: any, depth: number = 0) => {
    const isExpanded = expandedCategories.has(activity.id);
    const isSubcategoryExpanded = expandedSubcategories.has(activity.id);
    const isSelected = selectedActivities.includes(activity.id);
    const hasChildren = activity.children && activity.children.length > 0;
    
    // Level 1 items should have no left padding to align under filter title
    // Level 2+ items get appropriate indentation
    const paddingLeft = activity.level === 1 ? 0 : activity.level === 2 ? 12 : 24;

    return (
      <div key={activity.id} className="w-full">
        <div 
          className={`flex items-center py-1.5 px-1 rounded-md cursor-pointer hover:bg-fuchsia-900/20 ${
            isSelected ? 'bg-fuchsia-700/30 text-white' : ''
          }`}
          style={{ paddingLeft: `${paddingLeft}px` }}
          onClick={() => {
            if (hasChildren && activity.level === 1) {
              toggleCategory(activity.id);
            } else if (hasChildren && activity.level === 2) {
              toggleSubcategory(activity.id);
            } else if (activity.level === 3) {
              handleActivitySelect(activity.id);
            }
          }}
        >
          {hasChildren && (activity.level === 1 || activity.level === 2) && (
            <div className="mr-1.5">
              {(activity.level === 1 ? isExpanded : isSubcategoryExpanded) ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </div>
          )}
          
          {!hasChildren && activity.level === 3 && (
            <input
              type={allowMultiple ? "checkbox" : "radio"}
              checked={isSelected}
              onChange={() => handleActivitySelect(activity.id)}
              className="mr-1.5 h-3 w-3 rounded border-fuchsia-800/50 text-fuchsia-600 focus:ring-0"
              onClick={(e) => e.stopPropagation()}
            />
          )}
          
          <span className={`text-sm ${activity.level === 1 ? 'font-medium uppercase' : activity.level === 2 ? 'font-medium' : ''}`}>
            {activity.name}
          </span>
        </div>

        {hasChildren && (
          <div className="mt-1" style={{ display: (activity.level === 1 ? isExpanded : activity.level === 2 ? isSubcategoryExpanded : true) ? 'block' : 'none' }}>
            {activity.children.map((child: any) => renderActivity(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`space-y-1 ${className}`}>
      {filteredActivities.map(activity => renderActivity(activity))}
    </div>
  );
};
