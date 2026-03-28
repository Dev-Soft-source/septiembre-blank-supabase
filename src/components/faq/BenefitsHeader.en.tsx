
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export function BenefitsHeaderEN() {
  const isMobile = useIsMobile();

  const benefitsList = [
    "Renewable stays (No contract, no deposit)",
    "No household chores (Cleaning, laundry, dishes)",
    "Constant flow of new people with shared affinities",
    "Choose by affinities, not by budget",
    "Eliminate loneliness and social isolation",
    "Expand your social life and professional network",
    "Daily services (Reception, security, concierge)",
    "Pay directly to hotels, no middlemen"
  ];

  const formatBenefitText = (benefit: string) => {
    if (isMobile && benefit.includes('\n')) {
      return benefit.split('\n').map((line, index) => (
        <React.Fragment key={index}>
          {line}
          {index < benefit.split('\n').length - 1 && <br />}
        </React.Fragment>
      ));
    }
    return benefit.replace(/\n/g, ' ');
  };

  return (
    <div className="space-y-4 mb-16">
      <div className="flex justify-center">
        <h2 className={`text-center font-bold ${isMobile ? "text-2xl" : "text-4xl"} text-[#FFF9B0] tracking-tight uppercase bg-[#8017B0] py-2 px-6 rounded-lg inline-block mx-auto`}>
          BENEFITS
        </h2>
      </div>
      <div className={`space-y-3 max-w-3xl mx-auto flex flex-col items-center ${isMobile ? "mt-12" : ""}`}>
        {benefitsList.map((benefit, index) => (
          <div key={index} className="bg-[#FFC700] py-2 px-4 text-center my-[12px] rounded-xl">
            <p className={`text-[#8017B0] ${isMobile ? "text-base" : "text-base"} font-bold`}>
              {formatBenefitText(benefit)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
