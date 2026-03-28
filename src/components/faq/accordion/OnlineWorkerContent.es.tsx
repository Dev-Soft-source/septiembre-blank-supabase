
import React from "react";
import { QuestionGroup } from "./QuestionGroup";

export function OnlineWorkerContentES() {
  const questionGroups = [
    [
      "¿Por qué pagar depósitos, cuando puedes invertir en Wi-Fi rápido, personas reales y experiencias compartidas?",
      "¿Por qué renunciar al confort, cuando tu habitación está limpia, tu espacio de trabajo listo y el ambiente es el tuyo?",
      "¿Por qué sentirte el único trabajando, cuando tus vecinos son diseñadores, desarrolladores y soñadores como tú?",
      "¿Por qué estar lejos de la vida, cuando Hotel-Living reúne vida, trabajo y conexión bajo un mismo techo?"
    ],
    [
      "¿Por qué encerrarte en un contrato anual, cuando la libertad significa moverte de ciudad en ciudad con tu tribu?",
      "¿Por qué quedarte atrapado en un solo lugar, cuando puedes vivir libremente de ciudad en ciudad, bajo tus propias reglas?",
      "¿Por qué vivir una vida fija, cuando cada pocas semanas puede empezar un nuevo capítulo?",
      "¿Por qué alquilar siempre en la misma ciudad, cuando podrías rotar entre países, culturas y comunidades?"
    ],
    [
      "¿Por qué atarte a una única dirección, cuando el mundo está lleno de lugares esperando sentirse como tu hogar?",
      "¿Por qué planificar con meses de antelación, cuando la flexibilidad te permite quedarte el tiempo que desees?",
      "¿Por qué deshacer la maleta definitivamente, cuando la vida es más intensa con movimiento, propósito y nuevas personas?",
      "¿Por qué vagar de un lugar a otro, cuando puedes aterrizar en un hogar para tu estilo de vida?"
    ],
    [
      "¿Por qué aplicar con requisitos interminables, cuando puedes hacer el check-in y sentirte parte de inmediato?",
      "¿Por qué perseguir caseros, cuando Hotel-Living te ofrece check-in, café y compañeros en minutos?",
      "¿Por qué alquilar como si fuera 1999, cuando tu oficina, tus amigos y tu próxima aventura están a un solo check-in de distancia?",
      "¿Por qué cargar muebles, cuando tu suite ya sabe lo que un nómada digital necesita?"
    ],
    [
      "¿Por qué pagar diez facturas, cuando Hotel-Living te ofrece un solo precio, cero estrés y confort total?",
      "¿Por qué limpiar, cuando alguien lo hace mientras tú conoces a gente inspiradora abajo?",
      "¿Por qué vivir bajo inspección, cuando puedes tener apoyo, servicio y cero presiones?",
      "¿Por qué alojarte en un hotel lleno de desconocidos, cuando puedes vivir en uno donde todos te entienden?"
    ],
    [
      "¿Por qué conformarte con el aislamiento, cuando las afinidades en los hoteles reúnen a personas como tú?",
      "¿Por qué vivir solo, cuando cada pasillo guarda una nueva conexión?",
      "¿Por qué despertar siendo invisible, cuando Hotel-Living te hace parte de algo?",
      "¿Por qué comer solo, cuando las cenas se convierten en conversaciones y los desconocidos en colaboradores?"
    ],
    [
      "¿Por qué pasar horas en apps de comida, cuando puedes compartir mesa e historias?",
      "¿Por qué vivir rodeado de las mismas historias, cuando podrías coleccionar nuevas cada mes?",
      "¿Por qué seguir viendo siempre a los mismos vecinos, cuando puedes conectar con creativos, viajeros y pensadores de todo el mundo?",
      "¿Por qué alquilar, cuando puedes ser acogido en un lugar lleno de personas como tú?"
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
