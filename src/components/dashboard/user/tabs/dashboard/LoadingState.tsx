
import React from "react";
import { Loader2 } from "lucide-react";

export default function LoadingState() {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-fuchsia-500" />
        <p>Loading your dashboard...</p>
      </div>
    </div>
  );
}
