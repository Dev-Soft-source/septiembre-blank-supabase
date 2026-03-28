
import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AffinityStaysSlogans } from "@/components/affinity-stays/AffinityStaysSlogans";
import { AffinityAccordionMenu } from "@/components/affinity-stays/AffinityAccordionMenu";
import { HotelStarfield } from "@/components/hotels/HotelStarfield";

export default function AffinityStays() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <HotelStarfield />
      <Navbar />
      
      <main className="flex-1 pt-4 relative z-10">
        <div className="container mx-auto px-4 py-4 flex flex-col items-center">
          {/* Main content */}
          <AffinityStaysSlogans />
          <div className="max-w-4xl w-full backdrop-blur-sm rounded-xl border border-fuchsia-400/20 p-4 md:p-6 bg-gradient-to-b from-[#460F54]/40 to-[#300A38]/60 z-20">
            <AffinityAccordionMenu />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
