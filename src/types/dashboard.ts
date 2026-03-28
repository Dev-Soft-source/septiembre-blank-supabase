
import { ReactNode } from "react";

export interface DashboardTab {
  id: string;
  label: string | ReactNode;
  icon: ReactNode;
  group?: string;
}

export interface DashboardGroup {
  id: string;
  label: string;
  items: DashboardTab[];
  defaultExpanded?: boolean;
}
