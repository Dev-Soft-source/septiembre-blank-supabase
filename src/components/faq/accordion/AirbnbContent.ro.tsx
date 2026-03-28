import React from "react";
import { QuestionGroup } from "./QuestionGroup";

export function AirbnbContentRO() {
  const questionGroups = [
    [
      "De ce să cauți chei în cutii… când un personal de recepție zâmbitor te așteaptă?",
      "De ce să intri și să ieși dintr-un portal necunoscut… când un hotel îți garantează securitate 24 de ore?",
      "De ce să dormi în insecuritate… când poți sta într-un hotel supravegheat cu personal profesionist?",
      "De ce să te temi că îți vor anula… când hotelurile te așteaptă cu contract clar?"
    ],
    [
      "De ce să dormi cu frica că nu vei avea apă caldă… când poți avea încredere într-un hotel pregătit?",
      "De ce să cobori la portal să primești o comandă… când o poți lăsa la recepție?",
      "De ce să accepți reguli impuse de necunoscuți… când poți avea libertate într-un cadru profesional?",
      "De ce să petreci zile fără contact uman… când poți avea personal amabil și servicii reale?"
    ],
    [
      "De ce să trăiești ca un străin… când poți trăi ca un oaspete de onoare?",
      "De ce să te simți oaspete de categoria a doua… când poți fi clientul unui hotel profesional?",
      "De ce să treci neobservat… când poți fi recunoscut, îngrijit și apreciat?",
      "De ce să rămâi închis… când într-un Hotel-Living cu afinități care te interesează poți cunoaște oameni obișnuiți care doresc să te cunoască?"
    ],
    [
      "De ce să te mulțumești cu orice saltea… când poți dormi într-un pat bun în fiecare noapte?",
      "De ce să dormi singur într-un apartament gol… când poți trăi într-un hotel cu viață și recepție 24h?",
      "De ce să trăiești într-un loc improvizat… când poți trăi într-un loc conceput să te primească?",
      "De ce să te resemnezi cu precaritatea… când poți avea confort, design și securitate?"
    ],
    [
      "De ce să accepți ce e \"ieftin\" dar fără suflet… când poți avea o experiență călduroasă și îngrijită?",
      "De ce să te simți un intrus… când poți să te simți oaspete?",
      "De ce să trăiești ca un străin… când poți trăi ca un oaspete de onoare?",
      "De ce să speli farfurii… când poți coborî la micul dejun?"
    ],
    [
      "De ce să plătești uneori curățenie separat… când o poți avea inclusă?",
      "De ce să nu ai pe cineva să îți curețe camera… când poți uita de toate acestea?",
      "De ce să nu ai cui să te plângi… când într-un hotel există întotdeauna cineva care răspunde?",
      "De ce să plătești tarife mari pentru apartamente precare… când un hotel îți oferă calitate la cel mai bun preț?"
    ],
    [
      "De ce să plătești pentru mai puțin… când poți plăti la fel pentru mult mai mult?",
      "De ce să petreci ore căutând ceva decent… când poți alege dintre hoteluri tematice deja filtrate după afinitate?",
      "De ce să presupui că orașul e scump… când poți avea tarife gândite pentru șederi lungi?",
      "De ce să închiriezi un apartament pentru câteva zile… când poți sta opt zile într-un Hotel-Living la preț minunat?"
    ],
    [
      "De ce să călătorești în modul supraviețuire… când poți călători în modul bunăstare?",
      "De ce să trebuiască să părăsești apartamentul la ora 10… când într-un hotel poți cere ușor late check-out?"
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