
import React from "react";
import { QuestionGroup } from "./QuestionGroup";

export function OnlineWorkerContentRO() {
  const questionGroups = [
    [
      "De ce să lucrezi dintr-un apartament înghesut când hotelurile oferă camere spațioase și bine iluminate?",
      "De ce să te lupți cu internet prost când hotelurile garantează conectivitate de mare viteză pentru afacerea ta?",
      "De ce să te izolezi acasă când spațiile comune ale hotelurilor te conectează cu alți profesioniști?",
      "De ce să plătești pentru un spațiu de coworking când camera ta de hotel devine biroul tău personalizat?"
    ],
    [
      "De ce să mănânci același prânz în fiecare zi când hotelurile oferă varietate și room service?",
      "De ce să te ocupi de distrageri casnice când hotelurile oferă mediul de lucru perfect?",
      "De ce să te limitezi la un oraș când Hotel-Living îți permite să lucrezi de oriunde?",
      "De ce să te îngrijorezi de întreținerea biroului când hotelurile se ocupă de totul pentru tine?"
    ],
    [
      "De ce să ratezi oportunități de networking când hotelurile sunt pline de oameni interesanți?",
      "De ce să plătești abonamente la sală când hotelurile includ facilități fitness?",
      "De ce să cheltui pe servicii de curățenie când hotelurile oferă menaj zilnic?",
      "De ce să te stresezi cu utilitățile și facturile când Hotel-Living include totul?"
    ],
    [
      "De ce să lucrezi în tăcere când poți lucra înconjurat de viață și energie?",
      "De ce să separi munca de stilul de viață când Hotel-Living le integrează perfect pe ambele?",
      "De ce să te mulțumești cu un birou de acasă când poți avea un spațiu de lucru luxos?",
      "De ce să trăiești ca și cum ar fi încă vechiul mod de a lucra când Hotel-Living este viitorul muncii la distanță?"
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
