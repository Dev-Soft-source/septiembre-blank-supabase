
import React from "react";
import { QuestionGroup } from "./QuestionGroup";

export function StillRentingContentRO() {
  const questionGroups = [
    [
      "De ce să închiriezi un apartament când poți avea room service?",
      "De ce să te ocupi de hârtii nesfârșite când poți face check-in și să te simți acasă instant?",
      "De ce să plătești depozite când îți poți investi banii în confort, conexiune și grijă?",
      "De ce să te angajezi la un contract anual când libertatea înseamnă să stai cu oameni cu aceleași idei în șederi pe afinități?",
      "De ce să cureți când altcineva se ocupă de asta și tu îți poți petrece timpul cu alții?",
      "De ce să renunți la confort când Hotel-Living include curățenie, zâmbete și poate chiar o invitație la cină?"
    ],
    [
      "De ce să trăiești singur când poți trăi conectat?",
      "De ce să te resemnezi cu singurătatea când afin itățile tale te pot apropia de tribul tău?",
      "De ce să trăiești sub inspecție când poți avea servicii și să fii tratat ca un oaspete?",
      "De ce să fii departe de viață când hotelurile aduc lumea (și oamenii) chiar la ușa ta?",
      "De ce să închiriezi când poți fi întâmpinat, găzduit și chiar să-ți faci prieteni noi?",
      "De ce să cari mobilier când camera ta este gata, vecinii tăi sunt interesanți și cina te așteaptă jos?"
    ],
    [
      "De ce să alerg după proprietari când Hotel-Living te întâmpină, te hrănește și îți prezintă prieteni noi?",
      "De ce să mănânci singur când poți împărți o masă cu oameni care te înțeleg?",
      "De ce să pierzi timp cu aplicații de livrare când ai un restaurant la câțiva pași?",
      "De ce să primești zece facturi pe lună când Hotel-Living unifică totul într-o ședere simplă?",
      "De ce să închiriezi ca în 1999 când Hotel-Living este viitorul locuirii?"
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
