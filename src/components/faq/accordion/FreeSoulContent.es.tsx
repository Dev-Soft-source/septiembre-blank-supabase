
import React from "react";
import { QuestionGroup } from "./QuestionGroup";

export function FreeSoulContentES() {
  const questionGroups = [
    [
      "¿Por qué quedarte atrapado en un solo lugar, cuando puedes vivir libremente de ciudad en ciudad, bajo tus propias reglas?",
      "¿Por qué atarte a una única dirección, cuando el mundo está lleno de lugares esperando sentirse como tu hogar?",
      "¿Por qué vivir una vida fija, cuando cada pocas semanas puede empezar un nuevo capítulo?",
      "¿Por qué alquilar siempre en la misma ciudad, cuando podrías rotar entre países, culturas y comunidades?"
    ],
    [
      "¿Por qué planificar con meses de antelación, cuando la flexibilidad te permite quedarte el tiempo que desees?",
      "¿Por qué deshacer la maleta definitivamente, cuando la vida es más intensa con movimiento, propósito y nuevas personas?",
      "¿Por qué vivir rodeado de las mismas historias, cuando podrías coleccionar nuevas cada mes?",
      "¿Por qué seguir viendo siempre a los mismos vecinos, cuando puedes conectar con creativos, viajeros y pensadores de todo el mundo?"
    ],
    [
      "¿Por qué reducir tu vida, cuando la jubilación es el momento de ampliarla?",
      "¿Por qué envejecer en silencio, cuando puedes hacerlo con alegría, valentía y belleza?",
      "¿Por qué limitar tu vida, cuando el mundo te está esperando?",
      "¿Por qué quedarte en un solo lugar, cuando vivir en muchos te mantiene joven?"
    ],
    [
      "¿Por qué vivir en un solo hogar, cuando podrías vivir entre ciudades, países y culturas?",
      "¿Por qué conformarte con la quietud, cuando el movimiento devuelve la vitalidad?",
      "¿Por qué despertar siendo invisible, cuando Hotel-Living te hace parte de algo?",
      "¿Por qué aferrarte a zonas de confort, cuando el verdadero confort de la vida es descubrir?"
    ],
    [
      "¿Por qué rodearte del pasado, cuando puedes construir un presente digno de recordar?",
      "¿Por qué elegir la rutina, cuando puedes elegir aventura, elegancia y sorpresa?",
      "¿Por qué vestir con desgana, cuando Hotel-Living te da razones para arreglarte de nuevo?",
      "¿Por qué vagar de un lugar a otro, cuando puedes aterrizar en un hogar para tu estilo de vida?"
    ],
    [
      "¿Por qué estar lejos de la vida, cuando los hoteles te acercan el mundo (y las personas) hasta la puerta?",
      "¿Por qué alquilar, cuando puedes ser recibido, acogido e incluso hacer nuevos amigos?",
      "¿Por qué alojarte en un hotel lleno de desconocidos, cuando puedes vivir en uno donde todos te entienden?",
      "¿Por qué conformarte con el aislamiento, cuando tus afinidades pueden acercarte a tu tribu?"
    ],
    [
      "¿Por qué vivir solo, cuando cada pasillo guarda una nueva conexión?",
      "¿Por qué esperar para sentirte vivo, cuando tu próximo viaje comienza en tu puerta?",
      "¿Por qué comer solo, cuando tu mesa puede llenarse de nuevos amigos?",
      "¿Por qué perder tiempo en apps de comida, cuando puedes compartir mesa e historias?"
    ],
    [
      "¿Por qué sentirte el único trabajando, cuando tus vecinos son diseñadores, desarrolladores y soñadores como tú?",
      "Esto no es solo alojamiento: es un estilo de vida para quienes viven por inspiración, no por obligación.",
      "Esto es Hotel-Living. Donde el mundo es hogar. Y la libertad es la única dirección."
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
