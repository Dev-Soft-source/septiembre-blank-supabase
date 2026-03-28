
import React from "react";
import { Rocket } from "lucide-react";
import { ListSection } from "@/components/join-us/ListSection";
import { whyEmergeData } from "@/components/join-us/SectionData";

export function MindBehindSection() {
  return (
    <ListSection 
      icon={Rocket} 
      title="THE MIND BEHIND THE MOVEMENT" 
      intro={whyEmergeData.intro} 
      items={whyEmergeData.items} 
      outro={whyEmergeData.outro} 
    />
  );
}
