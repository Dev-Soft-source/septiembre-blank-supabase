
import React from "react";
import { QuestionGroup } from "./QuestionGroup";

export function StillRentingContentEN() {
  const questionGroups = [
    [
      "Why rent an apartment when you can have room service?",
      "Why deal with endless paperwork when you can check in and feel at home instantly?",
      "Why pay deposits when you can invest your money in comfort, connection, and care?",
      "Why commit to a yearly lease when freedom means staying with like-minded people in affinity stays?",
      "Why clean when someone else takes care of it and you can enjoy your time with others?",
      "Why give up comfort when Hotel-Living includes cleaning, smiles, and maybe even an invitation to dinner?"
    ],
    [
      "Why live alone when you can live connected?",
      "Why resign yourself to loneliness when your affinities can bring you closer to your tribe?",
      "Why live under inspection when you can have service and be treated like a guest?",
      "Why be far from life when hotels bring the world (and people) right to your door?",
      "Why rent when you can be welcomed, hosted, and even make new friends?",
      "Why carry furniture when your room is ready, your neighbors are interesting, and dinner is waiting downstairs?"
    ],
    [
      "Why chase landlords when Hotel-Living welcomes you, feeds you, and introduces you to new friends?",
      "Why eat alone when you can share a table with people who understand you?",
      "Why waste time on food delivery apps when you have a restaurant just steps away?",
      "Why get ten bills a month when Hotel-Living unifies everything in one simple stay?",
      "Why rent like it's 1999 when Hotel-Living is the future of living?"
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
