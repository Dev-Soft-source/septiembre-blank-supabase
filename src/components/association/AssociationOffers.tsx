import React from "react";
import { useTranslation } from "react-i18next";

export function AssociationOffers() {
  const { t } = useTranslation("association");

  return (
    <div className="bg-[#7802A9] backdrop-blur-md rounded-2xl p-8 md:p-12 border border-cyan-400/30 shadow-[0_0_60px_rgba(34,211,238,0.4)] max-w-2xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold text-yellow-300 uppercase tracking-wide mb-8 text-center">
        {t("offers.title")}
      </h2>
      
      <div className="mx-auto space-y-6">
        <div className="bg-white/10 rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-center mb-4">
            <span className="text-4xl font-bold text-yellow-300">{t("offers.firstPeriod.percentage")}</span>
            <span className="text-white ml-2 text-lg">{t("offers.firstPeriod.text")}</span>
          </div>
          <p className="text-white text-center">
            {t("offers.firstPeriod.duration")}
          </p>
        </div>
        
        <div className="bg-white/10 rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-center mb-4">
            <span className="text-4xl font-bold text-yellow-300">{t("offers.secondPeriod.percentage")}</span>
            <span className="text-white ml-2 text-lg">{t("offers.secondPeriod.text")}</span>
          </div>
          <p className="text-white text-center">
            {t("offers.secondPeriod.duration")}
          </p>
        </div>
        
        <div className="bg-green-300/20 rounded-xl p-6 border border-green-300/40">
          <div className="text-white text-center text-lg leading-relaxed">
            <div><span className="font-bold text-green-300">{t("offers.note.highlight")}</span>.</div>
            <div>{t("offers.note.description")}</div>
          </div>
        </div>
      </div>
    </div>
  );
}