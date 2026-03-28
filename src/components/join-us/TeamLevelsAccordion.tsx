
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TeamLevelTabs } from "./team-levels/TeamLevelTabs";
import { TeamLevelContent } from "./team-levels/TeamLevelContent";
import { teamLevelsData } from "./team-levels/teamLevelsData";

export function TeamLevelsAccordion() {
  const [activeLevel, setActiveLevel] = useState<string>("glow");
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const handleSelectLevel = (levelId: string) => {
    setActiveLevel(levelId);
  };

  return (
    <div className="mb-8 bg-[#8017B0]/90 p-5 rounded-xl border border-[#3300B0]/30 shadow-lg">
      <Accordion 
        type="single" 
        collapsible 
        defaultValue={isOpen ? "team-levels" : undefined} 
        onValueChange={(value) => setIsOpen(!!value)}
      >
        <AccordionItem value="team-levels" className="border-none">
          <AccordionTrigger className="flex items-center py-0">
            <div className="flex items-center justify-center w-full">
              <ChevronDown className="h-4 w-4 text-yellow-300 mr-2 transition-transform" />
              <h2 className="text-lg md:text-xl font-bold text-yellow-300">EXPLORE OUR TEAM LEVELS – CHOOSE YOUR IMPACT</h2>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-white leading-relaxed mb-6 text-center text-sm">
              Explore the different levels of our team structure:
            </p>
            
            {/* Horizontal Tabs */}
            <TeamLevelTabs 
              teamLevels={teamLevelsData}
              activeLevel={activeLevel}
              onSelectLevel={handleSelectLevel}
            />
            
            {/* Content Display */}
            {teamLevelsData.map((level) => (
              activeLevel === level.id && (
                <TeamLevelContent
                  key={level.id}
                  id={level.id}
                  name={level.name}
                  tier={level.tier}
                  color={level.color}
                  content={level.content}
                />
              )
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
