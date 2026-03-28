
import React from "react";
import { safeArray } from "@/utils/safeDataAccess";

interface Highlight {
  question: string;
  answer: string;
}

interface HotelHighlightsProps {
  highlights: Highlight[];
}

export function HotelHighlights({
  highlights
}: HotelHighlightsProps) {
  // Safe access for highlights array
  const safeHighlights = Array.isArray(highlights) 
    ? highlights.filter(highlight => 
        highlight && 
        typeof highlight.question === 'string' && 
        typeof highlight.answer === 'string' &&
        highlight.question.trim() !== '' && 
        highlight.answer.trim() !== ''
      )
    : [];

  if (safeHighlights.length === 0) {
    return null;
  }

  return (
    <div className="my-5 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-white text-left">HIGHLIGHTS</h2>
      <div className="space-y-2">
        {safeHighlights.map((highlight, index) => (
          <p key={`highlight-${highlight.question.slice(0,20)}-${index}`} className="font-medium">
            <span className="font-medium">{highlight.question} </span>
            <span className="font-medium">{highlight.answer}</span>
          </p>
        ))}
      </div>
    </div>
  );
}
