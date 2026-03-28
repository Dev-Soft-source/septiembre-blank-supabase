
import React from "react";
import { Wrench } from "lucide-react";
import { TextSection } from "@/components/join-us/TextSection";

// SaaS application section data
const saasApplicationData = {
  paragraphs: [
    "⚡ FULLY SCALABLE SAAS",
    "📈 Profit margins nearly equal to total revenue",
    "🌎 Deployable instantly in any country",
    "",
    "💚 WE DON'T BREAK SYSTEMS",
    "🚫 We're not Uber or Airbnb: we don't disrupt and wait years to scale",
    "✅ We enhance existing systems through smart, seamless innovation",
    "",
    "🤝 OUR CORE MISSION:",
    "Connecting two urgent needs:",
    "1. 🏨 Hospitality businesses losing millions on unused capacity",
    "2. 👥 People seeking better, meaningful lifes",
    "________________________________________",
    "💡 We are not just a platform — but a complete ecosystem, progressively unfolding to redefine lodging worldwide."
  ]
};

export function SaasApplicationSection() {
  return (
    <TextSection icon={Wrench} title="WE ARE A SaaS APPLICATION" paragraphs={saasApplicationData.paragraphs} />
  );
}
