import React from "react";
import { useTranslation } from "react-i18next";

export function AssociationSlogans() {
  const { t } = useTranslation("association");
  const slogans = t("slogans", { returnObjects: true }) as (string | { lines: string[] })[];

  return (
    <div className="space-y-4">
      {slogans.map((slogan, index) => (
        <div
          key={index}
          className="bg-[#7802A9] backdrop-blur-md rounded-2xl p-6 border border-blue-400/30 shadow-[0_0_60px_rgba(59,130,246,0.4)] w-fit mx-auto max-w-2xl"
        >
          {typeof slogan === 'string' ? (
            <p className="text-sm md:text-lg font-bold text-white text-center leading-relaxed">
              {slogan}
            </p>
          ) : (
            <div className="text-sm md:text-lg font-bold text-white text-center leading-relaxed">
              {/* Mobile: single text flow, Desktop: separate lines */}
              <div className="block md:hidden association-banner-text">
                {slogan.lines.join(' ')}
              </div>
              <div className="hidden md:block">
                {slogan.lines.map((line, lineIndex) => (
                  <div key={lineIndex}>{line}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}