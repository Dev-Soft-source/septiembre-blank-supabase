
import React from "react";
import { Heart } from "lucide-react";

export function JoinUsForm() {
  return (
    <div className="mb-16 bg-[#8017B0]/90 p-6 rounded-xl border border-[#3300B0]/30 shadow-lg">
      <div className="flex items-center mb-6">
        <Heart className="h-6 w-6 text-[#FFF9B0] mr-2" />
        <h2 className="text-xl font-bold text-[#FFF9B0]">APPLY TO JOIN</h2>
      </div>
      
      <div className="space-y-4">
        <p className="text-white text-lg leading-relaxed">
          📩 If you're interested in collaborating with Hotel Living, please send us an email directly at:
        </p>
        
        <p className="text-[#FFF9B0] text-xl font-bold text-center py-4">
          contact@hotel-living.com
        </p>
        
        <p className="text-white text-lg leading-relaxed">
          We'll be happy to hear from you!
        </p>
      </div>
    </div>
  );
}
