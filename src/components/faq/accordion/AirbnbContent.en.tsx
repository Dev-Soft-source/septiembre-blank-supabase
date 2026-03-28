import React from "react";
import { QuestionGroup } from "./QuestionGroup";

export function AirbnbContentEN() {
  const questionGroups = [
    [
      "Why search for keys in lockboxes… when smiling reception staff awaits you?",
      "Why enter and exit an unknown building… when a hotel guarantees 24-hour security?",
      "Why sleep insecurely… when you can stay in a supervised hotel with professional staff?",
      "Why fear last-minute cancellations… when hotels welcome you with clear contracts?"
    ],
    [
      "Why sleep worried about no hot water… when you can trust in a prepared hotel?",
      "Why go downstairs to receive deliveries… when you can leave them at reception?",
      "Why accept rules imposed by strangers… when you can have freedom within a professional framework?",
      "Why spend days without human contact… when you can have friendly staff and real services?"
    ],
    [
      "Why live like a stranger… when you can live like an honored guest?",
      "Why feel like a second-class guest… when you can be a professional hotel's client?",
      "Why remain incognito… when you can be recognized, cared for, and valued?",
      "Why stay locked in… when in a Hotel-Living with affinities that interest you, you can meet like-minded people who want to know you?"
    ],
    [
      "Why settle for any mattress… when you can sleep in a good bed every night?",
      "Why sleep alone in an empty apartment… when you can live in a hotel with life and 24h reception?",
      "Why live in an improvised place… when you can live in a place designed to welcome you?",
      "Why resign yourself to precariousness… when you can have comfort, design, and security?"
    ],
    [
      "Why accept what's \"cheap\" but soulless… when you can have a warm and caring experience?",
      "Why feel like an intruder… when you can feel like a guest?",
      "Why live like a stranger… when you can live like an honored guest?",
      "Why have to wash dishes… when you can go down for breakfast?"
    ],
    [
      "Why sometimes pay for cleaning separately… when you can have it included?",
      "Why have no one to clean your room… when you can forget about all that?",
      "Why have no one to complain to… when in a hotel there's always someone who responds?",
      "Why pay high rates for precarious apartments… when a hotel gives you quality at the best price?"
    ],
    [
      "Why pay for less… when you can pay the same for much more?",
      "Why spend hours searching for something decent… when you can choose from thematic hotels already filtered by affinity?",
      "Why assume the city is expensive… when you can have rates designed for long stays?",
      "Why rent an apartment for a few days… when you can stay eight days in a Hotel-Living at a great price?"
    ],
    [
      "Why travel in survival mode… when you can travel in wellness mode?",
      "Why have to leave the apartment at 10am… when in a hotel you can easily request late check-out?"
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