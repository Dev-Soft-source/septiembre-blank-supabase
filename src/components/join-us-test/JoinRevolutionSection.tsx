
import React from "react";
import { Section } from "@/components/join-us/Section";
import { Globe } from "lucide-react";

interface JoinRevolutionSectionProps {
  paragraphs: string[];
  contactInfo: string[];
}

export function JoinRevolutionSection({ paragraphs, contactInfo }: JoinRevolutionSectionProps) {
  return (
    <Section icon={Globe} title="JOIN THE REVOLUTION">
      <div className="mb-6">
        <ul className="text-white leading-relaxed list-disc pl-6 space-y-2">
          {paragraphs.map((paragraph, index) => (
            <li key={index}>{paragraph}</li>
          ))}
        </ul>
      </div>
      
      <div>
        {contactInfo.map((info, index) => (
          <p key={index} className="text-white leading-relaxed mb-2">{info}</p>
        ))}
      </div>
    </Section>
  );
}
