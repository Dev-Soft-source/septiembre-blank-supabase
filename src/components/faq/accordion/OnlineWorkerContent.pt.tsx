
import React from "react";
import { QuestionGroup } from "./QuestionGroup";

export function OnlineWorkerContentPT() {
  const questionGroups = [
    [
      "Por que trabalhar em um apartamento apertado quando hotéis oferecem quartos espaçosos e bem iluminados?",
      "Por que lutar com internet ruim quando hotéis garantem conectividade de alta velocidade para seu negócio?",
      "Por que se isolar em casa quando áreas comuns de hotéis te conectam com outros profissionais?",
      "Por que pagar por um coworking quando seu quarto de hotel se torna seu escritório personalizado?"
    ],
    [
      "Por que comer o mesmo almoço todos os dias quando hotéis oferecem variedade e serviço de quarto?",
      "Por que lidar com distrações domésticas quando hotéis proporcionam o ambiente de trabalho perfeito?",
      "Por que se limitar a uma cidade quando Hotel-Living te permite trabalhar de qualquer lugar?",
      "Por que se preocupar com manutenção de escritório quando hotéis cuidam de tudo para você?"
    ],
    [
      "Por que perder oportunidades de networking quando hotéis estão cheios de pessoas interessantes?",
      "Por que pagar mensalidades de academia quando hotéis incluem instalações fitness?",
      "Por que gastar com serviços de limpeza quando hotéis oferecem arrumação diária?",
      "Por que se estressar com utilidades e contas quando Hotel-Living inclui tudo?"
    ],
    [
      "Por que trabalhar em silêncio quando você pode trabalhar rodeado de vida e energia?",
      "Por que separar trabalho e estilo de vida quando Hotel-Living integra ambos perfeitamente?",
      "Por que se contentar com um home office quando você pode ter um espaço de trabalho luxuoso?",
      "Por que viver como se ainda fosse o jeito antigo de trabalhar quando Hotel-Living é o futuro do trabalho remoto?"
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
