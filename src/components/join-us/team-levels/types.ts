
import { ReactNode } from "react";

export interface TeamLevel {
  id: string;
  name: string;
  tier: string;
  shortName: string;
  color: string;
  content: {
    description: string;
    responsibilities: string[];
    qualifications: string[];
    benefits: string[];
  };
}
