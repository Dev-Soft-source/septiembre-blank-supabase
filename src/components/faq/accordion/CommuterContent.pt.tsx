
import React from "react";
import { QuestionGroup } from "./QuestionGroup";

export function CommuterContentPT() {
  const questionGroups = [
    [
      "Por que perder horas no trânsito quando você pode ficar perto do seu local de trabalho?",
      "Por que pagar gasolina, estacionamento e transporte público quando você pode ir andando para o trabalho?",
      "Por que se estressar com trânsito e atrasos quando seu escritório fica a poucos minutos?",
      "Por que começar o dia cansado quando você pode acordar descansado e pronto?"
    ],
    [
      "Por que alugar longe do trabalha quando hotéis podem te colocar no coração do distrito comercial?",
      "Por que sacrificar o equilíbrio trabalho-vida quando proximidade te dá mais tempo para você?",
      "Por que depender de transporte não confiável quando você pode eliminar completamente o deslocamento?",
      "Por que chegar ao trabalho estressado quando você pode começar o dia calmo e focado?"
    ],
    [
      "Por que pagar por múltiplos serviços quando Hotel-Living inclui tudo que você precisa?",
      "Por que se isolar em um apartamento distante quando hotéis te conectam ao pulso da cidade?",
      "Por que desperdiçar horas produtivas viajando quando você poderia estar trabalhando, relaxando ou socializando?",
      "Por que escolher a vida exaustiva de quem se desloca quando Hotel-Living oferece conveniência e conforto?"
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
