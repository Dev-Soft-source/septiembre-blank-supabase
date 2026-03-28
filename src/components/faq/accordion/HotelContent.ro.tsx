
import React from "react";
import { QuestionGroup } from "./QuestionGroup";

export function HotelContentRO() {
  const questionGroups = [
    [
      "De ce să îți limitezi veniturile la șederi scurte tradiționale când oaspeții pe termen lung oferă stabilitate?",
      "De ce să te ocupi de rotația constantă când oaspeții Hotel-Living devin rezidenți loiali pe termen lung?",
      "De ce să depinzi de turismul sezonier când poți avea ocupare pe tot parcursul anului?",
      "De ce să concurezi doar pentru călătorii de vacanță când poți capta piața în creștere a nomadă digitali?"
    ],
    [
      "De ce să lași camerele goale în sezonul slab când Hotel-Living le umple consistent?",
      "De ce să te stresezi cu menajul zilnic când oaspeții pe termen lung necesită servicii mai puțin frecvente?",
      "De ce să te ocupi de check-in-uri și check-out-uri constante când poți avea oaspeți stabili și stabiliți?",
      "De ce să ratezi oportunitatea de a face parte din viitorul ospitalității?"
    ],
    [
      "De ce să operezi cu costuri operaționale mari când șederile pe termen lung sunt mai profitabile?",
      "De ce să îți limitezi potențialul hotelului când Hotel-Living îți poate transforma modelul de afaceri?",
      "De ce să concurezi pe piața saturată a șederii scurte când poți fi pionier al revoluției șederii lungi?",
      "De ce să privești alte hoteluri cum se luptă când poți conduce calea în inovația ospitalității?"
    ],
    [
      "De ce să te mulțumești să fii doar un alt hotel când poți deveni o destinație de stil de viață?",
      "De ce să ratezi șansa de a construi relații durabile cu oaspeții care devin membri ai comunității?",
      "De ce să rămâi blocat în vechiul model de ospitalitate când Hotel-Living reprezintă viitorul?",
      "De ce să aștepți schimbarea când poți fi schimbarea care transformă industria?"
    ]
  ];

  return (
    <div className="space-y-8 text-white">
      {questionGroups.map((questions, index) => (
        <QuestionGroup key={index} questions={questions} />
      ))}
      
      {/* Professional Study Offer */}
      <div className="mt-12 flex justify-center">
        <div 
          className="bg-white/95 border border-gray-300 rounded-lg p-8 max-w-2xl cursor-pointer hover:bg-white/100 hover:shadow-lg transition-all duration-300"
          onClick={() => {
            // TODO: Navigate to professional study page
            console.log("Navigate to professional study page");
          }}
        >
          <p className="text-gray-800 text-center text-lg leading-relaxed font-medium">
            Obțineți, fără costuri, un studiu profesional,<br />
            tehnic și la fața locului complet despre hotelul dvs. și posibilitățile sale de dezvoltare.
          </p>
        </div>
      </div>
    </div>
  );
}
