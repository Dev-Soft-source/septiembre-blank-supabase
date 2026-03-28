
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export function JoinUsBenefits() {
  const isMobile = useIsMobile();
  
  return (
    <div className="mt-12 mb-16 space-y-8">
      {/* Benefits for Contributors */}
      <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm rounded-xl border border-purple-400/20 p-6 md:p-8">
        <h3 className={`
          ${isMobile ? "text-xl" : "text-2xl"} 
          font-bold text-[#FFF9B0] mb-6 text-center
        `}>
          What You'll Receive as a Contributor
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h4 className="font-semibold text-[#FFF9B0] mb-1">Recognition & Credit</h4>
                <p className="text-gray-200 text-sm">Your contributions will be acknowledged in our platform and community</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h4 className="font-semibold text-[#FFF9B0] mb-1">Early Access</h4>
                <p className="text-gray-200 text-sm">Be among the first to test new features and improvements</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h4 className="font-semibold text-[#FFF9B0] mb-1">Community Access</h4>
                <p className="text-gray-200 text-sm">Join our exclusive contributor community and network</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h4 className="font-semibold text-[#FFF9B0] mb-1">Skill Development</h4>
                <p className="text-gray-200 text-sm">Enhance your skills while working on real-world projects</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h4 className="font-semibold text-[#FFF9B0] mb-1">Portfolio Building</h4>
                <p className="text-gray-200 text-sm">Add meaningful projects to your professional portfolio</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h4 className="font-semibold text-[#FFF9B0] mb-1">Future Opportunities</h4>
                <p className="text-gray-200 text-sm">Potential for full-time roles as we grow</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
