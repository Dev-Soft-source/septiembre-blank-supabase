
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HotelActivitiesProps {
  activities: string[];
}

export function HotelActivities({ activities }: HotelActivitiesProps) {
  if (!activities || activities.length === 0) {
    return null;
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-fuchsia-950/40 pb-4">
        <CardTitle className="text-xl font-bold">Activities</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-wrap gap-2">
          {activities.map((activity, index) => (
            <span 
              key={index} 
              className="px-3 py-1 bg-fuchsia-900/20 rounded-full text-sm"
            >
              {activity}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
