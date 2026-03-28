
import React from "react";
import { QuestionGroup } from "./QuestionGroup";

export function FreeSoulContentRO() {
  const questionGroups = [
    [
      "De ce să te legi de un loc când lumea te cheamă să explorezi?",
      "De ce să acumulezi lucruri când experiențele sunt cele care îmbogățesc cu adevărat sufletul?",
      "De ce să urmezi căi convenționale când inima ta caută aventură și libertate?",
      "De ce să te mulțumești cu ordinarul când Hotel-Living îți oferă experiențe extraordinare în fiecare zi?"
    ],
    [
      "De ce să te limitezi la o cultură când poți trăi printre multe?",
      "De ce să rămâi în zona ta de confort când creșterea se întâmplă în afara ei?",
      "De ce să îți amâni visele când Hotel-Living le face accesibile astăzi?",
      "De ce să trăiești cu regrete când poți trăi cu scop și pasiune?"
    ],
    [
      "De ce să cari greutatea posesiunilor când libertatea înseamnă să călătorești ușor?",
      "De ce să construiești ziduri când poți construi poduri către experiențe noi?",
      "De ce să alegi predictibilitatea când surpriza și minunea te așteaptă?",
      "De ce să trăiești o viață mică când Hotel-Living deschide posibilități infinite?"
    ],
    [
      "De ce să îmbătrânești cu plictiseală când fiecare zi poate fi o aventură nouă?",
      "De ce să te conformezi așteptărilor când spiritul tău tânjește după autenticitate?",
      "De ce să trăiești pentru alții când este timpul să trăiești pentru tine?",
      "De ce să aștepți 'într-o zi' când Hotel-Living face din fiecare zi ziua perfectă pentru a începe să trăiești pe deplin?"
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
