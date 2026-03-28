
import React from "react";
import { Lightbulb } from "lucide-react";
import { Section } from "./Section";

export function IntellectualPositioningSection() {
  return (
    <Section icon={Lightbulb} title="INTELLECTUAL POSITIONING STATEMENT" defaultOpen={false}>
      <p className="text-white leading-relaxed mb-4">
        What you see here is only the beginning.
      </p>
      <p className="text-white leading-relaxed mb-4">
        Hotel Living is not just a concept — it's the visible layer of a much broader, sophisticated system that we have already designed, structured, documented, and registered internationally.
      </p>
      <p className="text-white leading-relaxed mb-4">
        What we're presenting now is only the first launch module of a full architecture, composed of multiple original ideas, each with its own internal logic and practical implementation.
      </p>
      <p className="text-white leading-relaxed mb-4">
        These are deep, powerful models, designed to generate real utility and profitability across all stakeholder layers — from hotels and partners to users and local communities.
      </p>
      <p className="text-white leading-relaxed mb-4">
        Each element:
      </p>
      <ul className="text-white leading-relaxed list-disc pl-6 space-y-2 mb-4">
        <li>Is entirely innovative</li>
        <li>Has been developed with care over years</li>
        <li>Is internationally protected</li>
        <li>Will be rolled out progressively, in clearly defined stages</li>
        <li>Forms part of a much larger strategic and intellectual framework</li>
      </ul>
      <p className="text-white leading-relaxed mb-4">
        This is not just a functional structure — it's a conceptual system.
        Not something that can be easily recreated — it's a social mechanism with internal coherence and high-level design.
      </p>
      <p className="text-white leading-relaxed">
        This project cannot be reproduced simply with what is visible.
        What makes Hotel Living unique is what comes next — and it is already built.
      </p>
      <p className="text-white leading-relaxed mt-4">
        We are releasing our modules one by one — and we are ready.
      </p>
    </Section>
  );
}
