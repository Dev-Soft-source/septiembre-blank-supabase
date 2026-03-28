
import React from "react";
import { AccordionMenuItem } from "../AccordionMenuItem";

export interface SpecialMenuItemsProps {
  startingNumber: number;
  preventScroll?: boolean;
}

export function SpecialMenuItems({ startingNumber = 5, preventScroll = true }: SpecialMenuItemsProps) {
  return (
    <>
      {/* What are affinities-hotels? - Updated title and formatting */}
      <AccordionMenuItem 
        value="specialized-hotels" 
        title={`${startingNumber}-   What are affinities-hotels?`} 
        className="mt-0 hover:bg-[#5D0478]/20 transition-all duration-300 rounded-md"
        titleClassName="text-xl font-medium"
        preventScroll={preventScroll}
      >
        <div className="space-y-3 text-left py-4">
          <p className="text-lg font-semibold">EXAMPLE 1</p>
          <p className="text-base flex items-start pl-4">- Imagine a hotel focused on sports - cycling, golf, tennis, etc.</p>
          <p className="text-base flex items-start pl-4">- People interested in that sport book together</p>
          <p className="text-base flex items-start pl-4">- Community forms around common interests</p>
          <p className="text-base flex items-start pl-4">- No gaps between stays. No losses</p>
          
          <p className="text-lg font-semibold mt-6">EXAMPLE 2</p>
          <p className="text-base flex items-start pl-4">- Consider a hotel themed around cooking</p>
          <p className="text-base flex items-start pl-4">- Chefs, cooking classes, wine pairings, etc.</p>
          <p className="text-base flex items-start pl-4">- Premium rates for specialized experiences</p>
          <p className="text-base flex items-start pl-4">- Full occupancy with longer average stays</p>
          
          <p className="text-lg font-semibold mt-6">EXAMPLE 3</p>
          <p className="text-base flex items-start pl-4">- Language immersion hotels</p>
          <p className="text-base flex items-start pl-4">- Similar language level guests grouped together</p>
          <p className="text-base flex items-start pl-4">- Staff speaks target language</p>
          <p className="text-base flex items-start pl-4">- Complete linguistic experience</p>
          
          <p className="text-base italic mt-4">These specialized hotels create powerful communal experiences while maintaining steady, predictable revenue</p>
        </div>
      </AccordionMenuItem>
      
      {/* Our technology section */}
      <AccordionMenuItem 
        value="our-technology" 
        title={`${startingNumber + 1}-   Our technology does what others cannot`} 
        className="mt-0 hover:bg-[#5D0478]/20 transition-all duration-300 rounded-md"
        titleClassName="text-xl font-medium"
        preventScroll={preventScroll}
      >
        <div className="space-y-4 text-left py-4">
          <p className="text-base flex items-start"><span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span> Matches people with shared interests</p>
          <p className="text-base flex items-start"><span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span> Coordinates arrivals & departures for zero gaps</p>
          <p className="text-base flex items-start"><span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span> Optimizes stays for maximum profitability</p>
          <p className="text-base flex items-start"><span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span> Single platform. Multiple revenue streams</p>
        </div>
      </AccordionMenuItem>
      
      {/* Targeted marketing section */}
      <AccordionMenuItem 
        value="targeted-marketing" 
        title={`${startingNumber + 2}-   Targeted marketing no one else can match`} 
        className="mt-0 hover:bg-[#5D0478]/20 transition-all duration-300 rounded-md" 
        titleClassName="text-xl font-medium"
        preventScroll={preventScroll}
      >
        <div className="space-y-4 text-left py-4">
          <p className="text-base flex items-start"><span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span> Precision targeting by interest & affinity</p>
          <p className="text-base flex items-start"><span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span> Market to motivated communities, not random travelers</p>
          <p className="text-base flex items-start"><span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span> Global reach with hyper-specific focus</p>
          <p className="text-base flex items-start"><span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span> Higher conversion rates. Lower acquisition costs</p>
        </div>
      </AccordionMenuItem>
      
      {/* Themed hotels section - Updated title */}
      <AccordionMenuItem 
        value="themed-hotels" 
        title={`${startingNumber + 3}-   Affinities hotels = Perfect Social Networks`} 
        className="mt-0 hover:bg-[#5D0478]/20 transition-all duration-300 rounded-md"
        titleClassName="text-xl font-medium"
        preventScroll={preventScroll}
      >
        <div className="space-y-4 text-left py-4">
          <p className="text-base flex items-start"><span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span> Shared interests create instant connections</p>
          <p className="text-base flex items-start"><span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span> Group psychology drives longer stays & returns</p>
          <p className="text-base flex items-start"><span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span> Themed activities boost engagement & loyalty</p>
          <p className="text-base flex items-start"><span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span> Community belonging becomes addictive</p>
        </div>
      </AccordionMenuItem>
    </>
  );
}
