
import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Flame, Lightbulb, Star } from "lucide-react";
import { Container } from "@/components/ui/container";
import { HotelStarfield } from "@/components/hotels/HotelStarfield";
import { JoinUsForm } from "@/components/join-us/JoinUsForm";
import { TextSection } from "@/components/join-us/TextSection";
import { Section } from "@/components/join-us/Section";
import { JoinUsTestHeader } from "@/components/join-us-test/JoinUsTestHeader";
import { ProblemsSection } from "@/components/join-us-test/ProblemsSection";
import { FoundersSection } from "@/components/join-us-test/FoundersSection";
import { JoinRevolutionSection } from "@/components/join-us-test/JoinRevolutionSection";

import {
  marketOwnershipData,
  problemsData,
  solutionData,
  businessData,
  foundersOpportunityData,
  joinRevolutionData
} from "@/components/join-us-test/SectionData";

export default function JoinUsTest() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <HotelStarfield />
      <Navbar />
      
      <main className="flex-1 py-12">
        <Container>
          <div className="max-w-4xl mx-auto">
            <JoinUsTestHeader />
            
            {/* Market Ownership Section */}
            <Section icon={Star} title="🟣">
              <div className="space-y-4">
                {marketOwnershipData.paragraphs.map((paragraph, index) => (
                  <p key={index} className={`text-white leading-relaxed ${index === 0 ? "text-xl font-semibold text-[#FFF9B0]" : ""}`}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </Section>
            
            {/* Problems Section */}
            <ProblemsSection 
              title={problemsData.title} 
              sections={problemsData.sections}
              icon={Flame}
            />
            
            {/* Solution Section */}
            <ProblemsSection 
              title={solutionData.title} 
              sections={solutionData.sections}
              icon={Lightbulb} 
            />
            
            {/* Business Section */}
            <ProblemsSection 
              title={businessData.title} 
              sections={businessData.sections}
              icon={Star}
            />
            
            {/* Founders Opportunity Section */}
            <FoundersSection
              title={foundersOpportunityData.title}
              sections={foundersOpportunityData.sections}
              extraItems={foundersOpportunityData.extraItems}
            />
            
            {/* Join Revolution Section */}
            <JoinRevolutionSection
              paragraphs={joinRevolutionData.paragraphs}
              contactInfo={joinRevolutionData.contactInfo}
            />
            
            {/* Join Us Form */}
            <JoinUsForm />
          </div>
        </Container>
      </main>
      
      <Footer />
    </div>
  );
}
