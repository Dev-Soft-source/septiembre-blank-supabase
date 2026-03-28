
import React from "react";
import { QuestionItem } from "./QuestionItem";

interface QuestionGroupProps {
  questions: string[];
}

export function QuestionGroup({ questions }: QuestionGroupProps) {
  // Group questions into chunks of 4
  const groupedQuestions = [];
  for (let i = 0; i < questions.length; i += 4) {
    groupedQuestions.push(questions.slice(i, i + 4));
  }

  return (
    <div className="space-y-4">
      {groupedQuestions.map((group, groupIndex) => (
        <div key={groupIndex} className={groupIndex > 0 ? "mt-8" : ""}>
          {group.map((question, index) => (
            <QuestionItem key={index} question={question} />
          ))}
        </div>
      ))}
    </div>
  );
}
