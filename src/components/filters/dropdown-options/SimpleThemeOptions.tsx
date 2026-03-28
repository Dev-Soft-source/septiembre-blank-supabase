
import React from "react";
import { FilterState } from "../FilterTypes";
import { useTranslation } from "@/hooks/useTranslation";

interface SimpleThemeOptionsProps {
  type: keyof FilterState;
  fontSize: string;
}

export const SimpleThemeOptions: React.FC<SimpleThemeOptionsProps> = ({ type, fontSize }) => {
  const { t } = useTranslation('filters');
  
  const themeCategories = [
    { key: "art", translationKey: "affinities.art" },
    { key: "business", translationKey: "affinities.business" },
    { key: "culture", translationKey: "affinities.culture" },
    { key: "education", translationKey: "affinities.education" },
    { key: "entertainment", translationKey: "affinities.entertainment" },
    { key: "foodAndDrinks", translationKey: "affinities.foodAndDrinks" },
    { key: "healthAndWellness", translationKey: "affinities.healthAndWellness" },
    { key: "history", translationKey: "affinities.history" },
    { key: "hobbies", translationKey: "affinities.hobbies" },
    { key: "languages", translationKey: "affinities.languages" },
    { key: "lifestyle", translationKey: "affinities.lifestyle" },
    { key: "nature", translationKey: "affinities.nature" },
    { key: "personalDevelopment", translationKey: "affinities.personalDevelopment" },
    { key: "relationships", translationKey: "affinities.relationships" },
    { key: "scienceAndTechnology", translationKey: "affinities.scienceAndTechnology" },
    { key: "socialImpact", translationKey: "affinities.socialImpact" },
    { key: "sports", translationKey: "affinities.sports" }
  ];
  
  return (
    <div className="grid grid-cols-1">
      {themeCategories.map((category) => (
        <button
          key={category.key}
          onClick={() => document.dispatchEvent(new CustomEvent('updateFilter', { 
            detail: { key: 'theme', value: { id: category.key.toLowerCase(), name: t(category.translationKey) } } 
          }))}
          className={`text-left px-3 py-2 rounded-md ${fontSize} font-bold transition-colors hover:bg-[#460F54]`}
        >
          {t(category.translationKey)}
        </button>
      ))}
    </div>
  );
}
