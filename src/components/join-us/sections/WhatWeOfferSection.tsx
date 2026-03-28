
import React from "react";
import { Compass } from "lucide-react";
import { MultiListSection } from "@/components/join-us/MultiListSection";

const whatWeOfferData = {
  listGroups: [
    {
      title: "TO HOTELS",
      items: [
        "💰 A $131 billion opportunity in new annual sales",
        "Hotel Living opens the door to an entirely new market — one that generates over $131 billion in additional annual revenue for the hotel industry worldwide. And it does so without disrupting your core operations.",
        "",
        "📆 Permanent, year-round occupancy",
        "Say goodbye to empty rooms during low seasons. Hotel Living ensures a stable flow of long-stay guests through fixed-duration stays (8, 16, 24, or 32 days), helping maintain consistent revenue across all seasons.",
        "",
        "🔄 New revenue streams without disrupting traditional operations",
        "The Hotel Living model runs in parallel to your standard bookings. You continue your daily business, while simultaneously filling unused capacity with a curated, high-quality audience — no overhauls, no retraining, no restructuring.",
        "",
        "🧰 Smarter use of existing resources",
        "Maximize what you already have: rooms, dining services, cleaning staff, unused amenities. Hotel Living optimizes hotel infrastructure and personnel without requiring major investment.",
        "",
        "📈 Higher profitability per room",
        "Long-stay guests reduce operational turnover and generate more stable income. The result: lower cleaning frequency, fewer check-ins/outs, and improved resource efficiency — all leading to better margins.",
        "",
        "👥 Attract a new kind of guest",
        "Tap into the fast-growing segment of professionals, creatives, digital nomads, and active retirees seeking a home-like experience with hotel-level services — guests who value reliability, community, and lifestyle.",
        "",
        "🌟 Stronger positioning in the market",
        "Being part of Hotel Living associates your property with innovation, flexibility, and forward-thinking hospitality. It places your hotel at the intersection of travel, wellness, work, and culture.",
        "",
        "📣 Enhanced visibility and social relevance",
        "Hotels aligned with meaningful themes — like art, gastronomy, languages, or wellness — enjoy targeted exposure to new niche markets. You don't just host guests — you host aligned communities.",
        "",
        "🛠️ No risk, full control",
        "You decide how many rooms to offer, in which seasons, and under what conditions. You can test the model gradually or scale participation as it proves successful — always on your terms.",
        "",
        "🎯 Tailored marketing support",
        "Hotel Living promotes your property through a dedicated platform and content strategy focused on long-stay experiential travel — giving your brand visibility beyond conventional OTAs.",
        "",
        "🌍 New relevance in a changing world",
        "As travelers seek more than tourism — looking for meaning, connection, and lifestyle — your hotel becomes more than lodging. It becomes a lived experience."
      ]
    },
    {
      title: "TO OUR CUSTOMERS",
      items: [
        "🏃‍♂️ For many individuals or couples — even those still in their working years — Hotel Living offers the freedom to step away from traditional rental life. No need for long-term leases, complicated applications, payslips, deposits, or credit checks. You simply choose a hotel and move in — no strings, no stress.",
        "",
        "🧺 A fully-serviced lifestyle — no housework, no maintenance, no errands. Meals, cleaning, and comfort are already taken care of, so you can focus on living, creating, and connecting.",
        "",
        "💸 Affordable stays often comparable to the cost of conventional living — but with far more convenience, flexibility, and emotional well-being.",
        "",
        "🫂 A life beyond isolation — ideal for those tired of being alone in apartments. Hotel Living provides opportunities to be part of something, to connect naturally with others.",
        "",
        "🎨 Communities based on shared affinities — live among people who love the same things you do: art, languages, cuisine, wellness, technology, or creative work.",
        "",
        "✨ A chance to feel alive and socially reenergized — especially for those who feel their daily routine has become lonely or stagnant.",
        "",
        "🤝 The opportunity to make meaningful, even life-changing connections, through everyday encounters with people who share your mindset and passions.",
        "",
        "🌿 A lighter, more human way to live — ideal for remote workers, creatives, semi-retired individuals, and anyone seeking freedom without loneliness.",
        "",
        "🌍 And for retirees, early retirees, or those with financial independence: the chance to move freely around the world, living in 8, 16, 24, or 32-day stays while discovering new communities, people, and places — without pressure, without isolation, and with everything taken care of.",
        "",
        "🏠 And for homeowners: the possibility to rent out your primary residence while you live, travel, and enjoy life through Hotel Living — turning your home into income and your life into movement."
      ]
    },
    {
      title: "TO SOCIETY",
      items: [
        "🌐 A new model of urban mobility and social connection — Hotel Living makes it easier for people to move, live, and engage across cities, reducing geographic and emotional isolation.",
        "🏘️ Better use of urban infrastructure — vacant hotel rooms are activated as living spaces, reducing waste and revitalizing underused properties.",
        "🤝 More social cohesion and inclusion — by connecting people with shared affinities and values, Hotel Living helps build organic communities where dialogue and collaboration flourish.",
        "💡 A new alternative to housing stress — for people priced out of long-term rentals or burdened by rigid leases, Hotel Living offers a flexible, dignified, and accessible solution.",
        "🧓 Improved quality of life for aging populations — active seniors can live independently while enjoying built-in community and services, reducing loneliness and care-related stress.",
        "🌎 Opportunities for cultural exchange and mutual learning — thematic stays promote human connection across borders, fostering diversity and empathy.",
        "👩‍💼 Support for digital and creative professionals — Hotel Living offers a viable base for remote work and innovation, nurturing talent beyond large capitals.",
        "📊 An economic boost to the hospitality sector — increased occupancy and new market segments stabilize hotel revenue year-round, strengthening local economies.",
        "🏠 Unlocking housing potential — by allowing homeowners to rent out their primary residence while they travel or live elsewhere, Hotel Living activates dormant housing stock in a balanced way.",
        "🌱 A more sustainable way of living — shared services, optimized logistics, and conscious mobility reduce environmental impact compared to fragmented, resource-heavy lifestyles."
      ]
    }
  ]
};

export function WhatWeOfferSection() {
  return (
    <MultiListSection icon={Compass} title="WHAT WE OFFER" listGroups={whatWeOfferData.listGroups} />
  );
}
