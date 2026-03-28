
import React from "react";
import { Lightbulb } from "lucide-react";
import { TextSection } from "@/components/join-us/TextSection";

// Welcoming new talent data
const welcomingTalentData = {
  paragraphs: [
    "🚀 This is just the beginning.",
    "We're actively building our founding team and opening unique opportunities for brilliant people who want to shape the future of how humans live, connect, and move.",
    "🌟 We need extraordinary people — not just workers but pioneers, creatives, strategists, connectors, dreamers.",
    "Builders of the new world.",
    "🧠 People who are excited to shape something bold, scalable, and deeply human from the very beginning.",
    "🔮 If you're someone who can see the future before others do...",
    "🌍 If you want to help create something meaningful and global...",
    "💎 We've designed a truly extraordinary benefit-sharing model that rewards those who help build the foundation of Hotel Living.",
    "📈 As the platform expands, so does the value of your role.",
    "💥 This is a real opportunity to multiply your impact — and your income.",
    "✉️ If you are like that... then this is your invitation."
  ]
};

export function WelcomingTalentSection() {
  return (
    <TextSection icon={Lightbulb} title="WE'RE WELCOMING NEW TALENT" paragraphs={welcomingTalentData.paragraphs} />
  );
}
