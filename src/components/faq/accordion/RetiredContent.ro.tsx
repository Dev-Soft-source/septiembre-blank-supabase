
import React from "react";
import { QuestionGroup } from "./QuestionGroup";

export function RetiredContentRO() {
  const questionGroups = [
    [
      "De ce să îți limitezi viața când lumea te așteaptă?",
      "De ce să stai într-un singur loc când a trăi în multe te menține tânăr?",
      "De ce să îți reduci viața când pensia este momentul să o extinzi?",
      "De ce să trăiești într-o singură casă când ai putea trăi între orașe, țări și culturi?"
    ],
    [
      "De ce să te mulțumești cu liniștea când mișcarea îți readuce vitalitatea?",
      "De ce să aștepți să te simți viu când următoarea călătorie începe la ușa ta?",
      "De ce să alegi rutina când poți alege aventura, eleganța și surpriza?",
      "De ce să te înconjori de trecut când poți construi un prezent demn de amintit?"
    ],
    [
      "De ce să vezi mereu aceleași fețe când fiecare călătorie aduce povești noi?",
      "De ce să te agăți de zonele de confort când adevăratul confort al vieții este să descoperi?",
      "De ce să îmbătrânești în tăcere când poți face asta cu bucurie, curaj și frumusețe?",
      "De ce să te îmbraci neglijent când Hotel-Living îți dă motive să te îmbraci din nou frumos?"
    ],
    [
      "De ce să te izolezi când o viață vibrantă te așteaptă chiar în afara camerei tale?",
      "De ce să mănânci singur când masa ta poate fi umplută cu prieteni noi?",
      "De ce să aștepți vizite când fiecare coridor ascunde o față prietenoasă?",
      "De ce să fii invizibil în propria casă când în fiecare dimineață cineva te salută pe nume?"
    ],
    [
      "De ce să te ocupi de reparații, zgomot sau vecini când Hotel-Living gestionează totul pentru tine?",
      "De ce să ai casa goală când ai putea să o închiriezi și să îți umpli viața în schimb?",
      "De ce să dormi după o ușă simplă când Hotel-Living îți oferă grijă și prezență 24/7?",
      "De ce să riști tăcerea când ajutorul este la o singură atingere distanță?"
    ],
    [
      "De ce să îți faci griji cine este la ușă când securitatea hotelului știe deja?",
      "De ce să stai după uși închise când securitatea, căldura și grija sunt integrate în Hotel-Living?",
      "De ce să înfrunți urgențele singur când există întotdeauna personal pregătit în apropiere?",
      "De ce să te temi de căderi, accidente sau nopți singure când nu vei mai fi niciodată cu adevărat singur?"
    ],
    [
      "De ce să trăiești în frică când există întotdeauna cineva care știe că ești acolo și îi pasă de tine?"
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
