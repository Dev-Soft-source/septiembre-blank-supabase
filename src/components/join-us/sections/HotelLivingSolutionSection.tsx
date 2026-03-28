
import React from "react";
import { Star } from "lucide-react";
import { TextSection } from "@/components/join-us/TextSection";

// Hotel-living solution section data
const hotelLivingSolutionData = {
  paragraphs: [
    "🧩 A SYSTEM OF INTELLIGENT MODULES",
    "We are not just another \"booking\" platform. Not at all.",
    "We are a completely new system — fully integrated and just 20% unfolded — a smart-living ecosystem made of powerful modules. Just to name a few:",
    "",
    "🗓️ Fixed-duration stays (8, 16, 24, 32 nights): predictable, profitable, optimized",
    "🎯 Affinity-based segmentation: guests grouped by shared interests and lifestyles",
    "🛎️ Full hotel optimization: new features and options for efficiency and positioning",
    "🌟 Customer satisfaction redefined: empowering a new standard of fulfillment",
    "🤝 Community by design: rich social interaction, shared experiences, human connection",
    "🧼 Full-service social living: no cleaning, no cooking, no worries — ever",
    "🔁 Plug & play SaaS: scalable, replicable, deployable worldwide in minutes",
    "💸 Dynamic revenue logic: automatic price increases as rooms are booked",
    "📣 Built-in marketing tools: helping hotels attract the right guest, every time",
    "",
    "⚠️ BUT NOT EVERYTHING IS GOOD NEWS",
    "✔️ Only 3.5% of our potential audience would be enough to fill all available hotel nights worldwide — year-round.",
    "👉 Which means: demand massively exceeds supply.",
    "💡 In other words: this business is hot cakes by design.",
    "",
    "🏡 A REAL ESTATE REVOLUTION",
    "Hotel Living is not just about guests — it's about freedom.",
    "By enabling people to live in hotels flexibly and affordably, it unlocks a powerful shift:",
    "",
    "✔️ Residents can rent out or sell their properties",
    "✔️ Older adults in oversized homes can transition to hotel-living",
    "✔️ Urban centers are freed up — making room for new families, rebalancing the market",
    "✔️ A fluid, full-comfort alternative to traditional housing, with no long-term leases"
  ]
};

export function HotelLivingSolutionSection() {
  return (
    <TextSection icon={Star} title="THE HOTEL-LIVING SOLUTION" paragraphs={hotelLivingSolutionData.paragraphs} />
  );
}
