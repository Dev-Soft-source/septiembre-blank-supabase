import React from "react";
import { useTranslation } from "react-i18next";

export function AssociationDisclaimer() {
  const { t } = useTranslation("association");
  const disclaimerTexts = t("disclaimer.text", { returnObjects: true }) as string[];

  return (
    <div className="bg-[#7E26A6] backdrop-blur-md rounded-xl p-6 border border-purple-400/30 shadow-[0_0_30px_rgba(126,38,166,0.3)] max-w-2xl mx-auto">
      <div className="text-xs text-white leading-relaxed space-y-2">
        {disclaimerTexts.map((text, index) => (
          <p key={index}>{text}</p>
        ))}
      </div>
    </div>
  );
}