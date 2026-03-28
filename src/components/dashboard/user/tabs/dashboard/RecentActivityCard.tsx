
import React from "react";
import ActivityList from "./ActivityList";
import { RecentActivity } from "../../../types/dashboard";

interface RecentActivityCardProps {
  activities: RecentActivity[];
  isLoading: boolean;
}

export default function RecentActivityCard({ activities, isLoading }: RecentActivityCardProps) {
  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-fuchsia-900/20 bg-[#5c0869]">
        <h2 className="text-xl font-bold">Recent Activity</h2>
      </div>
      
      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-24 border-b border-fuchsia-900/20 p-4"></div>
          <div className="h-24 border-b border-fuchsia-900/20 p-4"></div>
          <div className="h-24 p-4"></div>
        </div>
      ) : (
        <ActivityList activities={activities} />
      )}
    </div>
  );
}
