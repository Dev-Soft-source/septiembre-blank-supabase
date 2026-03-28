
import { HotelStarfield } from "@/components/hotels/HotelStarfield";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ExpandableIntro } from "@/components/about-us/ExpandableIntro";
import { useTranslation } from "@/hooks/useTranslation";
import React from "react";

// Matched staff: names and titles from group images, portrait from individual photos
const staffProfiles = [
  {
    img: "/lovable-uploads/9ef36b0a-65f9-4a6e-9067-2f18f026d65d.png",
    name: "VICTORIA HAYES",
    title: "AFFILIATES & MEMBERSHIP MANAGER",
  },
  {
    img: "/lovable-uploads/77dc7017-bd00-4ce0-8519-f89a3df68b77.png",
    name: "ISABELLA REED",
    title: "MEDIA RELATIONS MANAGER",
  },
  {
    img: "/lovable-uploads/4ab0282f-bee9-4ffa-9e44-04b2a97aa425.png",
    name: "BENJAMIN HUGHES",
    title: "FRONTEND DEVELOPER",
  },
  {
    img: "/lovable-uploads/0ca6645a-ece0-4075-a1c1-36bf915e4c77.png",
    name: "NATALIE FOSTER",
    title: "CHIEF HUMAN RESOURCES OFFICER",
  },
  {
    img: "/lovable-uploads/82df6a57-5861-407d-b100-0f14a61f22a7.png",
    name: "ARJUN MEHTA",
    title: "DIRECTOR OF SOFTWARE DEVELOPMENT",
  },
  {
    img: "/lovable-uploads/b13a8a21-ab9a-459e-9019-bdb5e2955349.png",
    name: "ETHAN BROOKS",
    title: "BUSINESS RELATIONS COORDINATOR",
  },
  {
    img: "/lovable-uploads/2302bda3-e1b9-4b42-a669-26c4dbcc9e20.png",
    name: "MARIA ELENA CASTANEDA",
    title: "MARKETING EXECUTIVE",
  },
  {
    img: "/lovable-uploads/b5f52460-e740-4f04-ab00-bd8714f65cb2.png",
    name: "ETHAN HORNE",
    title: "PLATFORM RELIABILITY ENGINEER",
  },
  {
    img: "/lovable-uploads/4f0537ed-5d89-421b-b624-3ac5863ca401.png",
    name: "ROD EAGLE",
    title: "IT OPERATIONS MANAGER",
  },
  {
    img: "/lovable-uploads/195c767d-49c1-4be6-aff4-3a8e5d8889b1.png",
    name: "HECTOR MONEDERO",
    title: "PROJECT MANAGEMENT CHIEF",
  },
  {
    img: "/lovable-uploads/2b1641c8-d051-40d1-be38-ad4b7bb6e807.png",
    name: "ALFRED SLAV",
    title: "TECHNICAL SUPPORT",
  },
  // Fernando moved to second-to-last position
  {
    img: "/lovable-uploads/e6c9ea6b-bfcc-4c71-aaa1-43d1be9082d1.png",
    name: "FERNANDO ESPINEIRA",
    title: "CHIEF OPERATING OFFICER",
  },
  {
    img: "/lovable-uploads/46f180b4-2e61-43eb-8454-85b22398d52a.png",
    name: "ALEXANDER SCOTT",
    title: "CHIEF FINANCIAL OFFICER",
  },
];

export default function OurTeam() {
  const { t } = useTranslation('aboutUs');
  
  return (
    <div className="relative min-h-screen flex flex-col bg-transparent">
      <HotelStarfield />
      <Navbar />
      <main className="flex-1 flex flex-col items-center px-4 py-8 z-10 relative w-full">
        {/* Expandable Introduction - Compact */}
        <ExpandableIntro />
        
        {/* Team Members Grid - Positioned higher */}
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-x-4 gap-y-8">
            {staffProfiles.map(({ img, name, title }) => (
              <div key={img} className="flex flex-col items-center">
                {/* Profile image with rounded/oval appearance - 50% smaller */}
                <div className="rounded-full shadow-lg border-2 border-white bg-white overflow-hidden flex items-center justify-center aspect-square w-20 h-20">
                  <img
                    src={img}
                    alt={name}
                    className="object-cover w-full h-full rounded-full"
                  />
                </div>
                {/* Name and title - 50% smaller */}
                <div className="mt-2 w-full text-center bg-white bg-opacity-80 rounded-lg shadow flex flex-col items-center py-1 px-2 border border-gray-200">
                  <div className="font-medium text-xs">{name}</div>
                  <div className="font-bold text-xs lg:text-[7.2px] uppercase tracking-wide mt-0.5" style={{ letterSpacing: "0.02em", color: "#73149E", lineHeight: "1.4" }}>
                    {title}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
