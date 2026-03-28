
import React from "react";
import { QuestionGroup } from "./QuestionGroup";

export function StillRentingContentPT() {
  const questionGroups = [
    [
      "Por que alugar um apartamento quando você pode ter serviço de quarto?",
      "Por que lidar com papelada infinita quando você pode fazer check-in e se sentir em casa instantaneamente?",
      "Por que pagar depósitos quando você pode investir seu dinheiro em conforto, conexão e cuidado?",
      "Por que se comprometer com um contrato anual quando liberdade significa ficar com pessoas que pensam como você em estadias por afinidade?",
      "Por que limpar quando alguém mais cuida disso e você pode aproveitar seu tempo com outros?",
      "Por que abrir mão do conforto quando Hotel-Living inclui limpeza, sorrisos e talvez até um convite para jantar?"
    ],
    [
      "Por que viver sozinho quando você pode viver conectado?",
      "Por que se resignar à solidão quando suas afinidades podem te aproximar da sua tribo?",
      "Por que viver sob inspeção quando você pode ter serviço e ser tratado como um hóspede?",
      "Por que ficar longe da vida quando hotéis trazem o mundo (e as pessoas) até sua porta?",
      "Por que alugar quando você pode ser bem-vindo, hospedado e até fazer novos amigos?",
      "Por que carregar móveis quando seu quarto está pronto, seus vizinhos são interessantes e o jantar está esperando no andar de baixo?"
    ],
    [
      "Por que correr atrás de proprietários quando Hotel-Living te recebe, te alimenta e te apresenta novos amigos?",
      "Por que comer sozinho quando você pode compartilhar uma mesa com pessoas que te entendem?",
      "Por que perder tempo com aplicativos de entrega quando você tem um restaurante a poucos passos?",
      "Por que receber dez contas por mês quando Hotel-Living unifica tudo em uma estadia simples?",
      "Por que alugar como se fosse 1999 quando Hotel-Living é o futuro de viver?"
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
