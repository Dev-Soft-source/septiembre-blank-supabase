
import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/ui/container";
import { HotelStarfield } from "@/components/hotels/HotelStarfield";
import { JoinUsHeader } from "@/components/join-us/JoinUsHeader";
import { JoinUsMetadata } from "./join-us/JoinUsMetadata";
import { JoinUsScrollHandler } from "./join-us/JoinUsScrollHandler";
import { JoinUsHighlightBoxes } from "./join-us/JoinUsHighlightBoxes";
import { JoinUsSections } from "./join-us/JoinUsSections";

export default function JoinUs() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <JoinUsMetadata />
      <JoinUsScrollHandler />
      <HotelStarfield />
      <Navbar />
      
      <main className="flex-1 py-12">
        <Container>
          <div className="max-w-4xl mx-auto">
            <JoinUsHeader />
            
            {/* Two spectacular highlighted boxes with slogans - Vertically Stacked and Centered */}
            <JoinUsHighlightBoxes />
            
            <JoinUsSections />
          </div>
        </Container>
      </main>
      
      <Footer />
    </div>
  );
}
