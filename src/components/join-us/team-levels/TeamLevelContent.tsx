
import React from "react";

interface TeamLevelContentProps {
  id: string;
  name: string;
  tier: string;
  color: string;
  content: {
    description: string;
    responsibilities: string[];
    qualifications: string[];
    benefits: string[];
  };
}

export function TeamLevelContent({ 
  id, 
  name, 
  tier, 
  color, 
  content 
}: TeamLevelContentProps) {
  return (
    <div className="mt-6 p-6 rounded-lg border border-white/20 bg-[#68178D]/20">
      {/* Mobile title: split into two lines, smaller font */}
      <div className="block md:hidden mb-4">
        <h3 className="text-lg font-bold text-center" style={{ color }}>
          {name}
        </h3>
        <h4 className="text-lg font-bold text-center" style={{ color }}>
          {tier}
        </h4>
      </div>
      
      {/* Desktop title: original format */}
      <h3 className="hidden md:block text-xl font-bold mb-4 text-center" style={{ color }}>
        {name} - {tier}
      </h3>
      
      <div className="space-y-4 text-white text-sm">
        <p className="leading-relaxed">{content.description}</p>
        
        <div>
          <h4 className="font-semibold mb-2 text-yellow-300">Key Responsibilities:</h4>
          <ul className="list-disc list-inside space-y-1 ml-2">
            {content.responsibilities.map((responsibility, index) => (
              <li key={index}>{responsibility}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold mb-2 text-yellow-300">Qualifications:</h4>
          <ul className="list-disc list-inside space-y-1 ml-2">
            {content.qualifications.map((qualification, index) => (
              <li key={index}>{qualification}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold mb-2 text-yellow-300">Benefits:</h4>
          <ul className="list-disc list-inside space-y-1 ml-2">
            {content.benefits.map((benefit, index) => (
              <li key={index}>{benefit}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
