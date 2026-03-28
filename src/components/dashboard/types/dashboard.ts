
import { ReactNode } from "react";

export interface DashboardTab {
  id: string;
  label: string;
  icon: ReactNode;
}

export interface RecentActivity {
  iconName: string;
  title: string;
  description: string;
  time: string;
  created_at?: string;
}

export interface UpcomingStay {
  hotelId: string;
  hotelName: string;
  location: string;
  checkIn: string;
  checkOut: string;
  days: number;
}
