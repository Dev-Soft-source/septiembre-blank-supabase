
import React, { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load recharts components
const AreaChart = React.lazy(() => 
  import("recharts").then(module => ({ default: module.AreaChart }))
);

const BarChart = React.lazy(() => 
  import("recharts").then(module => ({ default: module.BarChart }))
);

const LineChart = React.lazy(() => 
  import("recharts").then(module => ({ default: module.LineChart }))
);

const PieChart = React.lazy(() => 
  import("recharts").then(module => ({ default: module.PieChart }))
);

const ResponsiveContainer = React.lazy(() => 
  import("recharts").then(module => ({ default: module.ResponsiveContainer }))
);

const XAxis = React.lazy(() => 
  import("recharts").then(module => ({ default: module.XAxis }))
);

const YAxis = React.lazy(() => 
  import("recharts").then(module => ({ default: module.YAxis }))
);

const CartesianGrid = React.lazy(() => 
  import("recharts").then(module => ({ default: module.CartesianGrid }))
);

const Tooltip = React.lazy(() => 
  import("recharts").then(module => ({ default: module.Tooltip }))
);

const Legend = React.lazy(() => 
  import("recharts").then(module => ({ default: module.Legend }))
);

const Area = React.lazy(() => 
  import("recharts").then(module => ({ default: module.Area }))
);

const Bar = React.lazy(() => 
  import("recharts").then(module => ({ default: module.Bar }))
);

const Line = React.lazy(() => 
  import("recharts").then(module => ({ default: module.Line }))
);

const Pie = React.lazy(() => 
  import("recharts").then(module => ({ default: module.Pie }))
);

const Cell = React.lazy(() => 
  import("recharts").then(module => ({ default: module.Cell }))
);

const ChartLoadingFallback = () => (
  <div className="flex aspect-video justify-center items-center">
    <div className="space-y-2 w-full">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-32 w-full" />
    </div>
  </div>
);

// Export lazy components with fallback
export function LazyAreaChart(props: any) {
  return (
    <Suspense fallback={<ChartLoadingFallback />}>
      <AreaChart {...props} />
    </Suspense>
  );
}

export function LazyBarChart(props: any) {
  return (
    <Suspense fallback={<ChartLoadingFallback />}>
      <BarChart {...props} />
    </Suspense>
  );
}

export function LazyLineChart(props: any) {
  return (
    <Suspense fallback={<ChartLoadingFallback />}>
      <LineChart {...props} />
    </Suspense>
  );
}

export function LazyPieChart(props: any) {
  return (
    <Suspense fallback={<ChartLoadingFallback />}>
      <PieChart {...props} />
    </Suspense>
  );
}

export function LazyResponsiveContainer(props: any) {
  return (
    <Suspense fallback={<ChartLoadingFallback />}>
      <ResponsiveContainer {...props} />
    </Suspense>
  );
}

export function LazyXAxis(props: any) {
  return (
    <Suspense fallback={null}>
      <XAxis {...props} />
    </Suspense>
  );
}

export function LazyYAxis(props: any) {
  return (
    <Suspense fallback={null}>
      <YAxis {...props} />
    </Suspense>
  );
}

export function LazyCartesianGrid(props: any) {
  return (
    <Suspense fallback={null}>
      <CartesianGrid {...props} />
    </Suspense>
  );
}

export function LazyTooltip(props: any) {
  return (
    <Suspense fallback={null}>
      <Tooltip {...props} />
    </Suspense>
  );
}

export function LazyLegend(props: any) {
  return (
    <Suspense fallback={null}>
      <Legend {...props} />
    </Suspense>
  );
}

export function LazyArea(props: any) {
  return (
    <Suspense fallback={null}>
      <Area {...props} />
    </Suspense>
  );
}

export function LazyBar(props: any) {
  return (
    <Suspense fallback={null}>
      <Bar {...props} />
    </Suspense>
  );
}

export function LazyLine(props: any) {
  return (
    <Suspense fallback={null}>
      <Line {...props} />
    </Suspense>
  );
}

export function LazyPie(props: any) {
  return (
    <Suspense fallback={null}>
      <Pie {...props} />
    </Suspense>
  );
}

export function LazyCell(props: any) {
  return (
    <Suspense fallback={null}>
      <Cell {...props} />
    </Suspense>
  );
}
