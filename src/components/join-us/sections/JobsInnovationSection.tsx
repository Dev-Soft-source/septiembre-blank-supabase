
import React from "react";
import { BarChart3 } from "lucide-react";
import { ListSection } from "@/components/join-us/ListSection";

// Jobs innovation data with added spacing
const jobsInnovationData = {
  intro: "Hotel Living is a revolution of alignment between available unused resources and massive social needs. A revolution of humanity, new jobs and shared wealth. For the first time in history: Living in hotels is no longer just for millionaires and royalty. We've come to democratize the concept of hotel living — the very idea of making a hotel, multiples hotels, your home for longer, logical, accessible, meaningful stays.",
  items: [
    "💼 Massive job creation — especially in the hotel industry, where total occupancy levels will require expanded and diversified staff.",
    
    "👥 Group facilitators and social connectors – professionals trained to promote interaction, guide affinity-based communities, and host themed encounters.",
    
    "🎯 Experience coordinators and lifestyle managers – individuals who curate local events, workshops, and micro-experiences tailored to each property's theme.",
    
    "🏨 Hospitality professionals in evolving roles – from traditional front desk and housekeeping to long-stay client liaisons, concierge-services, and resident relations managers.",
    
    "🔗 Cross-sector employment – new demand in real estate, logistics, entertainment, wellness, food services, and cultural programming — all revolving around a more fluid, longer-term guest.",
    
    "🛠️ Technological roles – IT support for smart rooms, app-based guest management, CRM integration, and digital onboarding.",
    
    "📦 Local service providers – increased demand for laundry, food supply chains, mobility services, medical professionals, and local guides, stimulating local economies.",
    
    "🌍 A new class of global citizens – professionals empowered to work from anywhere, live affordably, and form meaningful social bonds, reducing the precarity of urban living.",
    
    "🏘️ New real estate roles and models – operators, hybrid building managers, and consultants for mixed-use lodging that blends hospitality and long-stay living.",
    
    "🧱 Construction and renovation workers – as demand grows for properties adapted to longer stays and thematic experiences.",
    
    "📈 A parallel service economy – flourishing around long-stay guests: gyms, cafes, co-working hubs, learning centers, wellness providers."
  ],
  outro: "Hotel Living is more than a business model — it's a new ecosystem of opportunity for workers, communities, and cities."
};

export function JobsInnovationSection() {
  return (
    <ListSection 
      icon={BarChart3} 
      title="JOBS, INNOVATION, FUTURE" 
      intro={jobsInnovationData.intro} 
      items={jobsInnovationData.items} 
      outro={jobsInnovationData.outro} 
    />
  );
}
