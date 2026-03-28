
import React from "react";
import { QuestionGroup } from "./QuestionGroup";

export function StillRentingContentES() {
  const questionGroups = [
    [
      "¿Por qué alquilar un piso cuando puedes tener servicio de habitaciones?",
      "¿Por qué enfrentarte a trámites interminables, cuando puedes hacer el check-in y sentirte en casa al instante?",
      "¿Por qué pagar depósitos cuando puedes emplear tu dinero en comodidad, conexión y cuidados?",
      "¿Por qué comprometerte a un contrato anual cuando la libertad está en estancias con afinidades junto a personas afines?"
    ],
    [
      "¿Por qué limpiar, cuando alguien se encarga de ello y puedes disfrutar tu tiempo con otros?",
      "¿Por qué renunciar al confort, cuando Hotel-Living incluye limpieza, sonrisas y quizás una invitación a cenar?",
      "¿Por qué vivir solo, cuando puedes vivir conectado?",
      "¿Por qué resignarte a la soledad, cuando tus afinidades pueden acercarte a tu tribu?"
    ],
    [
      "¿Por qué vivir bajo inspección, cuando puedes tener servicio y ser tratado como huésped?",
      "¿Por qué estar lejos de la vida, cuando los hoteles te acercan el mundo (y las personas) hasta la puerta?",
      "¿Por qué alquilar, cuando puedes ser recibido, acogido e incluso hacer nuevos amigos?",
      "¿Por qué cargar muebles, cuando tu habitación ya está lista, tus vecinos sean interesantes y la cena te espere abajo?"
    ],
    [
      "¿Por qué perseguir caseros, cuando Hotel-Living te da la bienvenida, te alimenta y te presenta nuevos amigos?",
      "¿Por qué comer solo, cuando puedes compartir mesa con personas que te entienden?",
      "¿Por qué perder tiempo en apps de comida, cuando tienes un restaurante a unos pasos?",
      "¿Por qué recibir diez facturas al mes, cuando Hotel-Living lo unifica todo en una estancia sencilla?"
    ],
    [
      "¿Por qué alquilar como si fuera 1999, cuando Hotel-Living es el futuro de la vivienda?"
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
