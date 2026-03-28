
import React from "react";
import { Clock } from "lucide-react";

export default function NoActivity() {
  return (
    <div className="text-center py-8">
      <Clock className="w-8 h-8 mx-auto mb-3 text-fuchsia-400/50" />
      <h3 className="text-lg font-bold mb-2">No recent activity</h3>
      <p className="text-muted-foreground">Your recent actions will appear here.</p>
    </div>
  );
}
