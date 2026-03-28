import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HotelLayoutComparison } from "@/components/hotel-comparison/HotelLayoutComparison";
import BubbleCounter from "@/components/common/BubbleCounter";

export default function HotelComparisonPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <BubbleCounter />
      
      {/* Comparison Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-center py-4">
        <div className="container mx-auto px-4">
          <span className="font-semibold">🔄 Layout Comparison</span>
          <span className="mx-2">•</span>
          <span>28 DE JULIO Hotel - Model A vs Model B</span>
        </div>
      </div>
      
      <main className="flex-1 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="container mx-auto px-4 py-8">
          <HotelLayoutComparison />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}