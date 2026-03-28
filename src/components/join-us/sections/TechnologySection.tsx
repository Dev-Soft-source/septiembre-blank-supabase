
import React from "react";
import { Star } from "lucide-react";
import { TextSection } from "@/components/join-us/TextSection";

// Technology with a human purpose data
const technologyData = {
  paragraphs: [
    "💡 Hotel Living uses advanced technology not to replace people, but to connect them.",
    "Our platform is designed to foster human relationships — not automate them away.",
    "",
    "",
    "🧭 Smart matching based on affinities, interests, and lifestyle preferences",
    "We help individuals find the right stay, in the right place, surrounded by the right people — creating natural communities through algorithms that understand people.",
    "",
    "",
    "📱 A seamless digital interface for real-world living",
    "Our tools make it easy to book, check in, connect, and discover — with everything in one place and without friction.",
    "",
    "",
    "🧠 AI used for personalization, not manipulation",
    "We don't track people to sell them things — we use intelligent design to understand needs and enhance well-being.",
    "",
    "",
    "📅 Automated planning of meaningful stays",
    "Guests can browse by themes, durations, affinities, or travel rhythm — making their stays intentional and inspiring.",
    "",
    "",
    "🫶 Community-based discovery tools",
    "Users can see who's staying where, what affinities are present, and join safe, interest-based environments that reduce social risk.",
    "",
    "",
    "🔒 Privacy-first technology",
    "All connections and recommendations are opt-in, respecting comfort and personal boundaries at all times.",
    "",
    "",
    "📊 Real-time data to help hotels serve better",
    "Properties get intelligent insights into guest preferences, satisfaction levels, and operational needs — improving service quality without guesswork.",
    "",
    "",
    "🌍 Localized experiences at your fingertips",
    "Our system integrates curated local content, services, and experiences — connecting guests to the culture and people of each destination.",
    "",
    "",
    "🔁 Continuous feedback loops that learn and evolve",
    "From check-in to check-out, our tech refines the experience — while keeping the guest in full control.",
    "",
    "",
    "🧬 Technology as a human amplifier",
    "Everything we build is guided by one principle: people first. Tech doesn't replace warmth, but extends its reach."
  ]
};

export function TechnologySection() {
  return (
    <TextSection icon={Star} title="TECHNOLOGY WITH A HUMAN PURPOSE" paragraphs={technologyData.paragraphs} />
  );
}
