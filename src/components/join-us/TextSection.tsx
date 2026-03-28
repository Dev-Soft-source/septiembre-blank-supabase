
import React from "react";
import { LucideIcon } from "lucide-react";
import { Section } from "./Section";

interface TextSectionProps {
  icon: LucideIcon;
  title: string;
  paragraphs: string[];
}

export function TextSection({ icon, title, paragraphs }: TextSectionProps) {
  const formatParagraph = (text: string, index: number) => {
    // Check if this paragraph is in all caps (or mostly caps)
    const isCapsParagraph = text.toUpperCase() === text && text.length > 2;
    
    // Apply bold formatting to CAPS text
    if (isCapsParagraph) {
      return <p key={index} className={`text-white font-bold leading-relaxed ${index > 0 ? "mt-4" : ""}`}>{text}</p>
    }
    
    return (
      <p key={index} className={`text-white leading-relaxed ${index > 0 ? "mt-4" : ""}`}>
        {text}
      </p>
    );
  };

  // Add extra space before CAPS paragraphs and at the end
  const processedParagraphs = paragraphs.flatMap((paragraph, index) => {
    const isCapsParagraph = paragraph.toUpperCase() === paragraph && paragraph.length > 2;
    
    // If this is a CAPS paragraph and not the first paragraph, add an empty paragraph before it
    if (isCapsParagraph && index > 0 && paragraphs[index - 1] !== "") {
      return ["", paragraph];
    }
    
    return [paragraph];
  });
  
  // Add extra space at the end if not already present
  if (processedParagraphs.length > 0 && processedParagraphs[processedParagraphs.length - 1] !== "") {
    processedParagraphs.push("");
  }
  
  return (
    <Section icon={icon} title={title}>
      {processedParagraphs.map((paragraph, index) => formatParagraph(paragraph, index))}
    </Section>
  );
}
