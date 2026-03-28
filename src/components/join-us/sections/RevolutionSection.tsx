
import React from "react";
import { Flame } from "lucide-react";
import { TextSection } from "@/components/join-us/TextSection";
import { revolutionData } from "@/components/join-us/SectionData";

export function RevolutionSection() {
  return (
    <TextSection icon={Flame} title="A NECESSARY REVOLUTION" paragraphs={revolutionData.paragraphs} />
  );
}
