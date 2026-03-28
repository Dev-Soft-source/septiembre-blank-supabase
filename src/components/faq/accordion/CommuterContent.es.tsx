
import React from "react";
import { QuestionGroup } from "./QuestionGroup";

export function CommuterContentES() {
  const questionGroups = [
    [
      "¿Por qué perder horas en el tráfico cuando podrías ganarlas en un teatro?",
      "¿Por qué gastar dinero en gasolina en lugar de invertirlo en tu vida?",
      "¿Por qué pasar dos horas al día en la carretera cuando podrías vivir en el centro?",
      "¿Por qué vivir para el trayecto y no para la experiencia?"
    ],
    [
      "¿Por qué ser un ciudadano de segunda en tu propia ciudad?",
      "¿Por qué llegar siempre tarde cuando podrías estar ya allí?",
      "¿Por qué vivir entre coches cuando podrías vivir entre cafés y librerías?",
      "¿Por qué conformarte con el tráfico cuando podrías elegir la distracción?"
    ],
    [
      "¿Por qué dejar que tu vida dependa del horario del tren?",
      "¿Por qué vivir en la espera?",
      "¿Por qué huir cada noche del lugar que te inspira de día?",
      "¿Por qué ir y venir cuando podrías simplemente llegar… y quedarte?"
    ],
    [
      "¿Por qué vivir lejos de tus propios planes?",
      "¿Por qué despertarte lejos solo para llegar tarde?",
      "¿Por qué pagar por dos vidas cuando solo tienes una?",
      "¿Por qué dormir fuera del mundo cuando podrías vivir dentro de él?"
    ],
    [
      "¿Por qué alejarte de la cultura, el arte y la vida?",
      "¿Por qué vivir lejos de donde todo sucede?",
      "¿Por qué vivir en las afueras si trabajas en el corazón?",
      "¿Por qué seguir siendo un visitante diario en la ciudad que te alimenta?"
    ],
    [
      "¿Por qué no vivir donde realmente vives?",
      "¿Por qué pagar alquiler donde no estás, cuando podrías pagar para vivir donde sí estás?",
      "¿Por qué dejar tu tiempo al borde de la autopista?",
      "¿Por qué vivir entre dos mundos cuando puedes tener uno que lo tiene todo?"
    ],
    [
      "¿Por qué ser un visitante diario cuando podrías ser un residente libre?",
      "¿Por qué seguir moviéndote cuando podrías quedarte en casa?",
      "¿Por qué mantener distancia entre tú y tus sueños?",
      "¿Por qué aceptar incomodidades cuando existe Hotel-Living?"
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
