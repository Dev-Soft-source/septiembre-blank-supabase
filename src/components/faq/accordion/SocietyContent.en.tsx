
import React from "react";
import { QuestionGroup } from "./QuestionGroup";

export function SocietyContentEN() {
  const questionGroups = [
    [
      "Why maintain the housing crisis when Hotel-Living offers an immediate solution?",
      "Why accept urban isolation when hotels can rebuild community connections?",
      "Why perpetuate the burden of homeownership when flexible living is more sustainable?",
      "Why resist change when Hotel-Living can revitalize our cities and economies?"
    ],
    [
      "Why allow empty buildings when they could house productive, connected communities?",
      "Why accept that young people can't afford housing when Hotel-Living makes it accessible?",
      "Why maintain outdated zoning laws when flexible living models serve society better?",
      "Why ignore the environmental benefits of shared resources and efficient living?"
    ],
    [
      "Why separate seniors from younger generations when intergenerational living enriches everyone?",
      "Why accept loneliness as normal when Hotel-Living creates natural social networks?",
      "Why maintain expensive infrastructure for single-family homes when efficient living makes more sense?",
      "Why resist the evolution toward more connected, sustainable communities?"
    ],
    [
      "Why preserve systems that create inequality when Hotel-Living democratizes quality living?",
      "Why accept urban decay when Hotel-Living can breathe life into city centers?",
      "Why maintain the status quo when we can build more inclusive, vibrant societies?",
      "Why fear change when Hotel-Living offers hope for a better, more connected future for all?"
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
