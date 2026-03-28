
import React from "react";
import { QuestionGroup } from "./QuestionGroup";

export function CommuterContentRO() {
  const questionGroups = [
    [
      "De ce să pierzi ore în naveta când poți sta aproape de locul de muncă?",
      "De ce să plătești benzină, parcare și transport public când poți merge pe jos la muncă?",
      "De ce să te stresezi cu traficul și întârzierile când biroul tău este la doar câteva minute?",
      "De ce să începi ziua obosit când poți să te trezești odihnit și pregătit?"
    ],
    [
      "De ce să închiriezi departe de muncă când hotelurile te pot plasa în inima districtului de afaceri?",
      "De ce să sacrifici echilibrul muncă-viață când proximitatea îți dă mai mult timp pentru tine?",
      "De ce să depinzi de transport nesigur când poți elimina complet naveta?",
      "De ce să ajungi la muncă stresat când poți încep ziua calm și focusat?"
    ],
    [
      "De ce să plătești pentru servicii multiple când Hotel-Living include tot ce ai nevoie?",
      "De ce să te izolezi într-un apartament îndepărtat când hotelurile te conectează la pulsul orașului?",
      "De ce să iroseşti ore productive călătorind când ai putea lucra, relaxa sau socializa?",
      "De ce să alegi viața epuizantă a navetistului când Hotel-Living oferă comoditate și confort?"
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
