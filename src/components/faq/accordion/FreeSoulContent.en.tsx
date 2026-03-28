
import React from "react";
import { QuestionGroup } from "./QuestionGroup";

export function FreeSoulContentEN() {
  const questionGroups = [
    [
      "Why tie yourself to one place when the world is calling you to explore?",
      "Why accumulate things when experiences are what truly enrich the soul?",
      "Why follow conventional paths when your heart seeks adventure and freedom?",
      "Why settle for the ordinary when Hotel-Living offers you extraordinary experiences every day?"
    ],
    [
      "Why limit yourself to one culture when you can live among many?",
      "Why stay in your comfort zone when growth happens outside of it?",
      "Why postpone your dreams when Hotel-Living makes them accessible today?",
      "Why live with regrets when you can live with purpose and passion?"
    ],
    [
      "Why carry the weight of possessions when freedom means traveling light?",
      "Why build walls when you can build bridges to new experiences?",
      "Why choose predictability when surprise and wonder await you?",
      "Why live a small life when Hotel-Living opens up infinite possibilities?"
    ],
    [
      "Why age with boredom when every day can be a new adventure?",
      "Why conform to expectations when your spirit craves authenticity?",
      "Why live for others when it's time to live for yourself?",
      "Why wait for 'someday' when Hotel-Living makes every day the perfect day to start living fully?"
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
