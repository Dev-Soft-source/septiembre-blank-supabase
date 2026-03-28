
import React from "react";
import { QuestionGroup } from "./QuestionGroup";

export function RetiredContentPT() {
  const questionGroups = [
    [
      "Por que limitar sua vida quando o mundo está esperando por você?",
      "Por que ficar em um só lugar quando viver em muitos te mantém jovem?",
      "Por que reduzir sua vida quando a aposentadoria é o momento de ampliá-la?",
      "Por que viver em apenas uma casa quando você poderia viver entre cidades, países e culturas?"
    ],
    [
      "Por que se contentar com a quietude quando o movimento traz de volta a vitalidade?",
      "Por que esperar para se sentir vivo quando sua próxima viagem começa na sua porta?",
      "Por que escolher a rotina quando você pode escolher aventura, elegância e surpresa?",
      "Por que se cercar do passado quando você pode construir um presente digno de se lembrar?"
    ],
    [
      "Por que ver sempre os mesmos rostos quando cada viagem traz novas histórias?",
      "Por que se apegar às zonas de conforto quando o verdadeiro conforto da vida é descobrir?",
      "Por que envelhecer em silêncio quando você pode fazer isso com alegria, coragem e beleza?",
      "Por que se vestir descuidadamente quando Hotel-Living te dá razões para se arrumar novamente?"
    ],
    [
      "Por que se isolar quando uma vida vibrante te espera bem do lado de fora do seu quarto?",
      "Por que comer sozinho quando sua mesa pode ser preenchida com novos amigos?",
      "Por que esperar por visitas quando cada corredor guarda um rosto amigável?",
      "Por que ser invisível na sua própria casa quando toda manhã alguém te cumprimenta pelo nome?"
    ],
    [
      "Por que lidar com reparos, ruído ou vizinhos quando Hotel-Living gerencia tudo para você?",
      "Por que ter a casa vazia quando você poderia alugá-la e preencher sua vida em vez disso?",
      "Por que dormir atrás de uma porta simples quando Hotel-Living te oferece cuidado e presença 24/7?",
      "Por que arriscar o silêncio quando a ajuda está a apenas um toque de distância?"
    ],
    [
      "Por que se preocupar com quem está na porta quando a segurança do hotel já sabe?",
      "Por que ficar atrás de portas fechadas quando segurança, calor e cuidado estão integrados no Hotel-Living?",
      "Por que enfrentar emergências sozinho quando sempre há equipe preparada por perto?",
      "Por que temer quedas, acidentes ou noites solitárias quando você nunca mais estará verdadeiramente sozinho?"
    ],
    [
      "Por que viver com medo quando sempre há alguém que sabe que você está lá e se importa com você?"
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
