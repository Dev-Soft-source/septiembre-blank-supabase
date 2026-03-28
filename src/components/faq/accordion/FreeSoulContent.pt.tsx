
import React from "react";
import { QuestionGroup } from "./QuestionGroup";

export function FreeSoulContentPT() {
  const questionGroups = [
    [
      "Por que se amarrar a um lugar quando o mundo está te chamando para explorar?",
      "Por que acumular coisas quando experiências são o que realmente enriquece a alma?",
      "Por que seguir caminhos convencionais quando seu coração busca aventura e liberdade?",
      "Por que se contentar com o ordinário quando Hotel-Living te oferece experiências extraordinárias todos os dias?"
    ],
    [
      "Por que se limitar a uma cultura quando você pode viver entre muitas?",
      "Por que ficar na sua zona de conforto quando crescimento acontece fora dela?",
      "Por que adiar seus sonhos quando Hotel-Living os torna acessíveis hoje?",
      "Por que viver com arrependimentos quando você pode viver com propósito e paixão?"
    ],
    [
      "Por que carregar o peso das posses quando liberdade significa viajar leve?",
      "Por que construir muros quando você pode construir pontes para novas experiências?",
      "Por que escolher previsibilidade quando surpresa e maravilha te esperam?",
      "Por que viver uma vida pequena quando Hotel-Living abre possibilidades infinitas?"
    ],
    [
      "Por que envelhecer com tédio quando cada dia pode ser uma nova aventura?",
      "Por que se conformar às expectativas quando seu espírito anseia por autenticidade?",
      "Por que viver para os outros quando é hora de viver para você mesmo?",
      "Por que esperar por 'algum dia' quando Hotel-Living faz de cada dia o dia perfeito para começar a viver plenamente?"
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
