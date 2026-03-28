
import React from "react";
import { Handshake } from "lucide-react";
import { TextSection } from "@/components/join-us/TextSection";
import { strategicPartnershipsData } from "@/components/join-us/SectionData";

export function PartnershipsSection() {
  return (
    <TextSection icon={Handshake} title="WE ARE OPEN TO STRATEGIC PARTNERSHIPS" paragraphs={strategicPartnershipsData.paragraphs} />
  );
}
