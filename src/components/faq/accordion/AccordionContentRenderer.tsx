
import React from "react";
import { StillRentingContent } from "./StillRentingContent";
import { HotelContent } from "./HotelContent";
import { SocietyContent } from "./SocietyContent";
import { CommuterContent } from "./CommuterContent";
import { OnlineWorkerContent } from "./OnlineWorkerContent";
import { RetiredContent } from "./RetiredContent";
import { FreeSoulContent } from "./FreeSoulContent";
import { AirbnbContent } from "./AirbnbContent";

interface AccordionContentRendererProps {
  optionId: string;
}

export function AccordionContentRenderer({ optionId }: AccordionContentRendererProps) {
  switch (optionId) {
    case "still-renting":
      return <StillRentingContent />;
    case "retired":
      return <RetiredContent />;
    case "airbnb":
      return <AirbnbContent />;
    case "online-worker":
      return <OnlineWorkerContent />;
    case "commuter":
      return <CommuterContent />;
    case "free-soul":
      return <FreeSoulContent />;
    case "hotel":
      return <HotelContent />;
    case "society":
      return <SocietyContent />;
    default:
      return (
        <p className="text-white text-center">
          Content for this section will be populated later.
        </p>
      );
  }
}
