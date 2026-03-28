
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export function BenefitsHeaderPT() {
  const isMobile = useIsMobile();

  const benefitsList = [
    "Estadias renováveis (Sem contrato, sem depósito)",
    "Sem tarefas domésticas (Limpeza, lavanderia, pratos)",
    "Fluxo constante de pessoas novas com afinidades compartilhadas",
    "Escolha por afinidades, não por orçamento",
    "Elimine a solidão e isolamento social",
    "Expanda sua vida social e rede profissional",
    "Serviços diários (Recepção, segurança, portaria)",
    "Pague diretamente aos hotéis, sem intermediários"
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
          BENEFÍCIOS
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
