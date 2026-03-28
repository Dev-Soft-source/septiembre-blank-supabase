
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export function BenefitsHeaderRO() {
  const isMobile = useIsMobile();

  const benefitsList = [
    "Șederi reînnoibile (Fără contract, fără depozit)",
    "Fără treburi casnice (Curățenie, spălătorie, vase)",
    "Flux constant de oameni noi cu afinități comune",
    "Alege după afinități, nu după buget",
    "Elimină singurătatea și izolarea socială",
    "Îți extinde viața socială și rețeaua profesională",
    "Servicii zilnice (Recepție, securitate, concierge)",
    "Plătești direct la hoteluri, fără intermediari"
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
          BENEFICII
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
