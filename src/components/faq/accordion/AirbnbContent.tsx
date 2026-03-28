import React from "react";
import { AirbnbContentES } from "./AirbnbContent.es";
import { AirbnbContentEN } from "./AirbnbContent.en";
import { AirbnbContentPT } from "./AirbnbContent.pt";
import { AirbnbContentRO } from "./AirbnbContent.ro";
import { useTranslation } from "react-i18next";

export function AirbnbContent() {
  const { i18n } = useTranslation();
  
  switch (i18n.language) {
    case 'es':
      return <AirbnbContentES />;
    case 'en':
      return <AirbnbContentEN />;
    case 'pt':
      return <AirbnbContentPT />;
    case 'ro':
      return <AirbnbContentRO />;
    default:
      return <AirbnbContentEN />;
  }
}