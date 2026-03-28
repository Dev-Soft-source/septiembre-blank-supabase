
import React from "react";
import { QuestionGroup } from "./QuestionGroup";

export function SocietyContentRO() {
  const questionGroups = [
    [
      "De ce să menții criza locuințelor când Hotel-Living oferece o soluție imediată?",
      "De ce să accepți izolarea urbană când hotelurile pot reconstrui conexiunile comunitare?",
      "De ce să perpetuezi povara proprietății imobiliare când locuirea flexibilă este mai durabilă?",
      "De ce să reziști schimbării când Hotel-Living poate revitaliza orașele și economiile noastre?"
    ],
    [
      "De ce să permiți clădiri goale când acestea ar putea găzdui comunități productive și conectate?",
      "De ce să accepți că tinerii nu își pot permite locuințe când Hotel-Living le face accesibile?",
      "De ce să menții legi de zonare depășite când modelele de viață flexibile servesc mai bine societatea?",
      "De ce să ignori beneficiile de mediu ale resurselor partajate și vieții eficiente?"
    ],
    [
      "De ce să separi seniorii de generațiile mai tinere când viața intergenerațională îi îmbogățește pe toți?",
      "De ce să accepți singurătatea ca fiind normală când Hotel-Living creează rețele sociale naturale?",
      "De ce să menții infrastructură scumpă pentru case unifamiliale când viața eficientă are mai mult sens?",
      "De ce să reziști evoluției către comunități mai conectate și durabile?"
    ],
    [
      "De ce să păstrezi sisteme care creează inegalitate când Hotel-Living democratizează traiul de calitate?",
      "De ce să accepți decăderea urbană când Hotel-Living poate da viață centrelor orașelor?",
      "De ce să menții status quo-ul când putem construi societăți mai incluzive și vibrante?",
      "De ce să te temi de schimbare când Hotel-Living oferă speranță pentru un viitor mai bun și mai conectat pentru toți?"
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
