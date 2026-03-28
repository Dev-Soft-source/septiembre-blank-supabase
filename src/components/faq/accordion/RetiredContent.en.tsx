
import React from "react";
import { QuestionGroup } from "./QuestionGroup";

export function RetiredContentEN() {
  const questionGroups = [
    [
      "Why limit your life when the world is waiting for you?",
      "Why stay in one place when living in many keeps you young?",
      "Why reduce your life when retirement is the time to expand it?",
      "Why live in just one home when you could live between cities, countries, and cultures?"
    ],
    [
      "Why settle for stillness when movement brings back vitality?",
      "Why wait to feel alive when your next trip begins at your door?",
      "Why choose routine when you can choose adventure, elegance, and surprise?",
      "Why surround yourself with the past when you can build a present worth remembering?"
    ],
    [
      "Why see the same faces always when each trip brings new stories?",
      "Why cling to comfort zones when life's true comfort is discovering?",
      "Why age in silence when you can do it with joy, courage, and beauty?",
      "Why dress carelessly when Hotel-Living gives you reasons to dress up again?"
    ],
    [
      "Why isolate yourself when a vibrant life awaits just outside your room?",
      "Why eat alone when your table can be filled with new friends?",
      "Why wait for visits when every hallway holds a friendly face?",
      "Why be invisible in your own home when every morning someone greets you by name?"
    ],
    [
      "Why deal with repairs, noise, or neighbors when Hotel-Living manages everything for you?",
      "Why have an empty house when you could rent it out and fill your life instead?",
      "Why sleep behind a simple door when Hotel-Living offers you care and presence 24/7?",
      "Why risk silence when help is just one touch away?"
    ],
    [
      "Why worry about who's at the door when hotel security already knows?",
      "Why stay behind closed doors when security, warmth, and care are integrated into Hotel-Living?",
      "Why face emergencies alone when there's always prepared staff nearby?",
      "Why fear falls, accidents, or lonely nights when you'll never truly be alone again?"
    ],
    [
      "Why live in fear when there's always someone who knows you're there and cares about you?"
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
