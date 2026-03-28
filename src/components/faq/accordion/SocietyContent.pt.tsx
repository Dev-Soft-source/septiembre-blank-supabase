
import React from "react";
import { QuestionGroup } from "./QuestionGroup";

export function SocietyContentPT() {
  const questionGroups = [
    [
      "Por que manter a crise habitacional quando Hotel-Living oferece uma solução imediata?",
      "Por que aceitar o isolamento urbano quando hotéis podem reconstruir conexões comunitárias?",
      "Por que perpetuar o fardo da propriedade imobiliária quando viver flexível é mais sustentável?",
      "Por que resistir à mudança quando Hotel-Living pode revitalizar nossas cidades e economias?"
    ],
    [
      "Por que permitir prédios vazios quando eles poderiam abrigar comunidades produtivas e conectadas?",
      "Por que aceitar que jovens não conseguem pagar moradia quando Hotel-Living a torna acessível?",
      "Por que manter leis de zoneamento ultrapassadas quando modelos de vida flexível servem melhor à sociedade?",
      "Por que ignorar os benefícios ambientais de recursos compartilhados e vida eficiente?"
    ],
    [
      "Por que separar idosos das gerações mais jovens quando vida intergeracional enriquece todos?",
      "Por que aceitar solidão como normal quando Hotel-Living cria redes sociais naturais?",
      "Por que manter infraestrutura cara para casas unifamiliares quando vida eficiente faz mais sentido?",
      "Por que resistir à evolução para comunidades mais conectadas e sustentáveis?"
    ],
    [
      "Por que preservar sistemas que criam desigualdade quando Hotel-Living democratiza vida de qualidade?",
      "Por que aceitar decadência urbana quando Hotel-Living pode dar vida aos centros das cidades?",
      "Por que manter o status quo quando podemos construir sociedades mais inclusivas e vibrantes?",
      "Por que temer mudança quando Hotel-Living oferece esperança de um futuro melhor e mais conectado para todos?"
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
