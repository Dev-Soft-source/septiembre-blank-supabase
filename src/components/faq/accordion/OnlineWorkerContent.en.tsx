
import React from "react";
import { QuestionGroup } from "./QuestionGroup";

export function OnlineWorkerContentEN() {
  const questionGroups = [
    [
      "Why work from a cramped apartment when hotels offer spacious, well-lit rooms?",
      "Why struggle with poor internet when hotels guarantee high-speed connectivity for your business?",
      "Why isolate yourself at home when hotel common areas connect you with other professionals?",
      "Why pay for a coworking space when your hotel room becomes your personalized office?"
    ],
    [
      "Why eat the same lunch every day when hotels offer variety and room service?",
      "Why deal with household distractions when hotels provide the perfect work environment?",
      "Why limit yourself to one city when Hotel-Living lets you work from anywhere?",
      "Why worry about office maintenance when hotels handle everything for you?"
    ],
    [
      "Why miss networking opportunities when hotels are full of interesting people?",
      "Why pay for gym memberships when hotels include fitness facilities?",
      "Why spend on cleaning services when hotels provide daily housekeeping?",
      "Why stress about utilities and bills when Hotel-Living includes everything?"
    ],
    [
      "Why work in silence when you can work surrounded by life and energy?",
      "Why separate work and lifestyle when Hotel-Living integrates both seamlessly?",
      "Why settle for a home office when you can have a luxury workspace?",
      "Why live like it's still the old way of working when Hotel-Living is the future of remote work?"
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
