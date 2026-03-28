
import React from "react";
import { SaasApplicationSection } from "@/components/join-us/sections/SaasApplicationSection";
import { ProblemsWeSolveSection } from "@/components/join-us/sections/ProblemsWeSolveSection";
import { HotelLivingSolutionSection } from "@/components/join-us/sections/HotelLivingSolutionSection";
import { RevolutionSection } from "@/components/join-us/sections/RevolutionSection";
import { WhatWeOfferSection } from "@/components/join-us/sections/WhatWeOfferSection";
import { JobsInnovationSection } from "@/components/join-us/sections/JobsInnovationSection";
import { TechnologySection } from "@/components/join-us/sections/TechnologySection";
import { WelcomingTalentSection } from "@/components/join-us/sections/WelcomingTalentSection";
import { ImageSection } from "@/components/join-us/sections/ImageSection";
import { PartnershipsSection } from "@/components/join-us/sections/PartnershipsSection";
import { MindBehindSection } from "@/components/join-us/sections/MindBehindSection";
import { IntellectualPositioningSection } from "@/components/join-us/IntellectualPositioningSection";
import { TeamLevelsAccordion } from "@/components/join-us/TeamLevelsAccordion";
import { JoinUsFaq } from "@/components/join-us/faq/JoinUsFaq";
import { JoinMovementForm } from "@/components/join-us/JoinMovementForm";

export const JoinUsSections = () => {
  return (
    <>
      <SaasApplicationSection />
      <ProblemsWeSolveSection />
      <HotelLivingSolutionSection />
      <RevolutionSection />
      <WhatWeOfferSection />
      <JobsInnovationSection />
      <TechnologySection />
      <WelcomingTalentSection />
      
      <ImageSection />
      
      <PartnershipsSection />
      <MindBehindSection />
      <IntellectualPositioningSection />
      <TeamLevelsAccordion />
      <JoinUsFaq />
      
      {/* Add the new Join Movement Form */}
      <JoinMovementForm />
    </>
  );
};
