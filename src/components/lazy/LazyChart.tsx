
import React, { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ChartContainer = React.lazy(() => 
  import("@/components/ui/chart").then(module => ({ 
    default: module.ChartContainer 
  }))
);

const ChartTooltip = React.lazy(() => 
  import("@/components/ui/chart").then(module => ({ 
    default: module.ChartTooltip 
  }))
);

const ChartTooltipContent = React.lazy(() => 
  import("@/components/ui/chart").then(module => ({ 
    default: module.ChartTooltipContent 
  }))
);

const ChartLegend = React.lazy(() => 
  import("@/components/ui/chart").then(module => ({ 
    default: module.ChartLegend 
  }))
);

const ChartLegendContent = React.lazy(() => 
  import("@/components/ui/chart").then(module => ({ 
    default: module.ChartLegendContent 
  }))
);

interface LazyChartProps {
  children: React.ReactNode;
  config: any;
  className?: string;
}

const ChartLoadingFallback = () => (
  <div className="flex aspect-video justify-center items-center">
    <div className="space-y-2 w-full">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-32 w-full" />
    </div>
  </div>
);

export function LazyChartContainer({ children, config, className }: LazyChartProps) {
  return (
    <Suspense fallback={<ChartLoadingFallback />}>
      <ChartContainer config={config} className={className}>
        {children as any}
      </ChartContainer>
    </Suspense>
  );
}

export function LazyChartTooltip(props: any) {
  return (
    <Suspense fallback={null}>
      <ChartTooltip {...props} />
    </Suspense>
  );
}

export function LazyChartTooltipContent(props: any) {
  return (
    <Suspense fallback={null}>
      <ChartTooltipContent {...props} />
    </Suspense>
  );
}

export function LazyChartLegend(props: any) {
  return (
    <Suspense fallback={null}>
      <ChartLegend {...props} />
    </Suspense>
  );
}

export function LazyChartLegendContent(props: any) {
  return (
    <Suspense fallback={null}>
      <ChartLegendContent {...props} />
    </Suspense>
  );
}
