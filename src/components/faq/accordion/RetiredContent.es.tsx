
import React from "react";
import { QuestionGroup } from "./QuestionGroup";

export function RetiredContentES() {
  const questionGroups = [
    [
      "¿Por qué limitar tu vida, cuando el mundo te está esperando?",
      "¿Por qué quedarte en un solo lugar, cuando vivir en muchos te mantiene joven?",
      "¿Por qué reducir tu vida, cuando la jubilación es el momento de ampliarla?",
      "¿Por qué vivir en un solo hogar, cuando podrías vivir entre ciudades, países y culturas?"
    ],
    [
      "¿Por qué conformarte con la quietud, cuando el movimiento devuelve la vitalidad?",
      "¿Por qué esperar para sentirte vivo, cuando tu próximo viaje comienza en tu puerta?",
      "¿Por qué elegir la rutina, cuando puedes elegir aventura, elegancia y sorpresa?",
      "¿Por qué rodearte del pasado, cuando puedes construir un presente digno de recordar?"
    ],
    [
      "¿Por qué ver siempre los mismos rostros, cuando cada viaje trae nuevas historias?",
      "¿Por qué aferrarte a zonas de confort, cuando el verdadero confort de la vida es descubrir?",
      "¿Por qué envejecer en silencio, cuando puedes hacerlo con alegría, valentía y belleza?",
      "¿Por qué vestir con desgana, cuando Hotel-Living te da razones para arreglarte de nuevo?"
    ],
    [
      "¿Por qué aislarte, cuando una vida vibrante te espera justo fuera de tu habitación?",
      "¿Por qué comer solo, cuando tu mesa puede llenarse de nuevos amigos?",
      "¿Por qué esperar visitas, cuando cada pasillo guarda un rostro amigable?",
      "¿Por qué ser invisible en tu propio hogar, cuando cada mañana alguien te saluda por tu nombre?"
    ],
    [
      "¿Por qué ocuparte de reparaciones, ruidos o vecinos, cuando Hotel-Living lo gestiona todo por ti?",
      "¿Por qué tener la casa vacía, cuando podrías alquilarla y llenar tu vida en su lugar?",
      "¿Por qué dormir tras una simple puerta, cuando Hotel-Living te ofrece cuidado y presencia 24/7?",
      "¿Por qué arriesgarte al silencio, cuando la ayuda está a un solo toque de distancia?"
    ],
    [
      "¿Por qué preocuparte por quién está en la puerta, cuando la seguridad del hotel ya lo sabe?",
      "¿Por qué quedarte tras puertas cerradas, cuando la seguridad, el calor y el cuidado están integrados en Hotel-Living?",
      "¿Por qué afrontar emergencias solo, cuando siempre hay personal preparado cerca?",
      "¿Por qué temer caídas, accidentes o noches solo, cuando nunca estarás realmente solo de nuevo?"
    ],
    [
      "¿Por qué vivir con miedo, cuando siempre hay alguien que sabe que estás ahí, y se preocupa por ti?"
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
