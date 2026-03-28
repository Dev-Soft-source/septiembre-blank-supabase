
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function HotelSkeletonLoader() {
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <Skeleton className="h-10 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-4" />
        <Skeleton className="h-72 w-full rounded-xl mb-4" />
        <Skeleton className="h-4 w-1/3 mb-2" />
        <Skeleton className="h-4 w-2/3 mb-2" />
      </div>
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
        <div>
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
