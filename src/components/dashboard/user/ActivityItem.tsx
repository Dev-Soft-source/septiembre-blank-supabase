
import React from "react";
import ActivityIcon from "./icons/ActivityIcon";

interface ActivityItemProps {
  iconName: string;
  title: string;
  description: string;
  time: string;
}

export default function ActivityItem({
  iconName,
  title,
  description,
  time
}: ActivityItemProps) {
  return (
    <div className="p-4 flex items-start gap-3 bg-[#5c0869]">
      <div className="w-8 h-8 rounded-full bg-fuchsia-500/20 flex items-center justify-center flex-shrink-0">
        <ActivityIcon iconName={iconName} />
      </div>
      <div className="flex-1">
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-foreground/70">{description}</p>
      </div>
      <div className="text-xs text-muted-foreground">{time}</div>
    </div>
  );
}
