import React from "react";
import { QuestionGroup } from "./QuestionGroup";

export function AirbnbContentES() {
  const questionGroups = [
    [
      "¿Por qué estar buscando llaves en cajitas… cuando un personal de recepción te espera sonriente?",
      "¿Por qué entrar y salir de un portal desconocido… cuando un hotel te garantiza seguridad 24 horas?",
      "¿Por qué dormir en inseguridad… cuando puedes estar en un hotel supervisado y con personal profesional?",
      "¿Por qué tener miedo a que te cancelen… cuando los hoteles te esperan con contrato claro?"
    ],
    [
      "¿Por qué dormir con miedo a no tener agua caliente… cuando puedes confiar en un hotel preparado?",
      "¿Por qué bajar al portal a recibir un pedido… cuando puedes dejarlo en recepción?",
      "¿Por qué aceptar normas impuestas por desconocidos… cuando puedes tener libertad dentro de un marco profesional?",
      "¿Por qué pasar días sin contacto humano… cuando puedes tener personal amable y servicios reales?"
    ],
    [
      "¿Por qué vivir como un extraño… cuando puedes vivir como un invitado de honor?",
      "¿Por qué sentirte huésped de segunda… cuando puedes ser el cliente de un hotel profesional?",
      "¿Por qué pasar por incógnito… cuando puedes ser reconocido, cuidado y valorado?",
      "¿Por qué quedarte encerrado… cuando en un Hotel-Living con afinidades que te interesen puedes conocer gente común que desea conocerte?"
    ],
    [
      "¿Por qué conformarte con un colchón cualquiera… cuando puedes dormir en una buena cama cada noche?",
      "¿Por qué dormir solo en un piso vacío… cuando puedes vivir en un hotel con vida y recepción 24h?",
      "¿Por qué vivir en un lugar improvisado… cuando puedes vivir en un lugar diseñado para recibirte?",
      "¿Por qué resignarte a la precariedad… cuando puedes tener comodidad, diseño y seguridad?"
    ],
    [
      "¿Por qué aceptar lo \"barato\" pero sin alma… cuando puedes tener una experiencia cálida y cuidada?",
      "¿Por qué sentirte un intruso… cuando puedes sentirte huésped?",
      "¿Por qué vivir como un extraño… cuando puedes vivir como un invitado de honor?",
      "¿Por qué tener que fregar platos… cuando puedes bajar a desayunar?"
    ],
    [
      "¿Por qué pagar a veces limpieza aparte… cuando puedes tenerla incluida?",
      "¿Por qué no tener quien limpie tu habitación… cuando puedes olvidarte de todo eso?",
      "¿Por qué no tener a quién reclamar… cuando en un hotel hay siempre alguien que responde?",
      "¿Por qué pagar tarifas altas por apartamentos precarios… cuando un hotel te da calidad al mejor precio?"
    ],
    [
      "¿Por qué pagar por menos… cuando puedes pagar lo mismo por mucho más?",
      "¿Por qué gastar horas buscando algo decente… cuando puedes elegir entre hoteles temáticos ya filtrados por afinidad?",
      "¿Por qué asumir que la ciudad es cara… cuando puedes tener tarifas pensadas para estancias largas?",
      "¿Por qué alquilar un apartamento por pocos días… cuando puedes estar ocho días en un Hotel-Living a gran precio?"
    ],
    [
      "¿Por qué viajar en modo supervivencia… cuando puedes viajar en modo bienestar?",
      "¿Por qué tener que dejar el apartamento a las 10h… cuando en un hotel puedes pedir fácilmente late check-out?"
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