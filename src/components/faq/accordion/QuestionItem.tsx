
import React from "react";
interface QuestionItemProps {
  question: string;
}
export function QuestionItem({
  question
}: QuestionItemProps) {
  return <p className="text-lg leading-relaxed py-[7px] text-white">{question}</p>;
}
