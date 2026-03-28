
import React from "react";
import { QuestionGroup } from "./QuestionGroup";

export function CommuterContentEN() {
  const questionGroups = [
    [
      "Why waste hours commuting when you can stay close to your workplace?",
      "Why pay for gas, parking, and public transport when you can walk to work?",
      "Why stress about traffic and delays when your office is just minutes away?",
      "Why start your day tired when you can wake up refreshed and ready?"
    ],
    [
      "Why rent far from work when hotels can place you in the heart of the business district?",
      "Why sacrifice work-life balance when proximity gives you more time for yourself?",
      "Why depend on unreliable transport when you can eliminate the commute entirely?",
      "Why arrive at work stressed when you can start your day calmly and focused?"
    ],
    [
      "Why pay for multiple services when Hotel-Living includes everything you need?",
      "Why isolate yourself in a distant apartment when hotels connect you to the city's pulse?",
      "Why waste productive hours traveling when you could be working, relaxing, or socializing?",
      "Why choose the exhausting commuter life when Hotel-Living offers convenience and comfort?"
    ]
  ];

  return (
    <div className="space-y-8 text-white">
      {questionGroups.map((questions, index) => (
        <QuestionGroup key={index} questions={questions} />
      ))}
    </div>
  );
}
