
import React from "react";
import ActivityItem from "../../ActivityItem";
import { RecentActivity } from "../../../types/dashboard";
import NoActivity from "./NoActivity";

interface ActivityListProps {
  activities: RecentActivity[];
}

export default function ActivityList({ activities }: ActivityListProps) {
  if (activities.length === 0) {
    return <NoActivity />;
  }

  return (
    <div className="divide-y divide-fuchsia-900/10">
      {activities.map((activity, index) => (
        <ActivityItem 
          key={index}
          iconName={activity.iconName} 
          title={activity.title} 
          description={activity.description} 
          time={activity.time} 
        />
      ))}
    </div>
  );
}
