
import * as React from "react";

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

// Re-export THEMES for type checking
const THEMES = { light: "", dark: ".dark" } as const;

// Export all chart components
export { ChartContainer } from "./ChartContainer";
export { ChartTooltip, ChartTooltipContent } from "./ChartTooltip";
export { ChartLegend, ChartLegendContent } from "./ChartLegend";
export { ChartStyle } from "./ChartStyle";
export { useChart } from "./ChartContext";
