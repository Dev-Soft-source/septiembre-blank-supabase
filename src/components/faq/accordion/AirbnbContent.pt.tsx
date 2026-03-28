import React from "react";
import { QuestionGroup } from "./QuestionGroup";

export function AirbnbContentPT() {
  const questionGroups = [
    [
      "Por que procurar chaves em caixinhas… quando uma equipe de recepção sorridente te espera?",
      "Por que entrar e sair de um prédio desconhecido… quando um hotel garante segurança 24 horas?",
      "Por que dormir com insegurança… quando podes estar num hotel supervisionado com pessoal profissional?",
      "Por que ter medo de cancelamentos… quando os hotéis te esperam com contrato claro?"
    ],
    [
      "Por que dormir com medo de não ter água quente… quando podes confiar num hotel preparado?",
      "Por que descer ao portão para receber uma encomenda… quando podes deixá-la na recepção?",
      "Por que aceitar regras impostas por desconhecidos… quando podes ter liberdade dentro de um quadro profissional?",
      "Por que passar dias sem contacto humano… quando podes ter pessoal amável e serviços reais?"
    ],
    [
      "Por que viver como um estranho… quando podes viver como um hóspede de honra?",
      "Por que sentir-te hóspede de segunda… quando podes ser o cliente de um hotel profissional?",
      "Por que passar despercebido… quando podes ser reconhecido, cuidado e valorizado?",
      "Por que ficar trancado… quando num Hotel-Living com afinidades que te interessem podes conhecer pessoas comuns que desejam conhecer-te?"
    ],
    [
      "Por que conformar-te com qualquer colchão… quando podes dormir numa boa cama todas as noites?",
      "Por que dormir sozinho num apartamento vazio… quando podes viver num hotel com vida e recepção 24h?",
      "Por que viver num lugar improvisado… quando podes viver num lugar desenhado para te receber?",
      "Por que resignar-te à precariedade… quando podes ter conforto, design e segurança?"
    ],
    [
      "Por que aceitar o \"barato\" mas sem alma… quando podes ter uma experiência calorosa e cuidada?",
      "Por que sentir-te um intruso… quando podes sentir-te hóspede?",
      "Por que viver como um estranho… quando podes viver como um hóspede de honra?",
      "Por que ter de lavar pratos… quando podes descer para tomar o pequeno-almoço?"
    ],
    [
      "Por que às vezes pagar limpeza à parte… quando podes tê-la incluída?",
      "Por que não ter quem limpe o teu quarto… quando podes esquecer-te de tudo isso?",
      "Por que não ter a quem reclamar… quando num hotel há sempre alguém que responde?",
      "Por que pagar tarifas altas por apartamentos precários… quando um hotel te dá qualidade ao melhor preço?"
    ],
    [
      "Por que pagar por menos… quando podes pagar o mesmo por muito mais?",
      "Por que gastar horas procurando algo decente… quando podes escolher entre hotéis temáticos já filtrados por afinidade?",
      "Por que assumir que a cidade é cara… quando podes ter tarifas pensadas para estadias longas?",
      "Por que alugar um apartamento por poucos dias… quando podes estar oito dias num Hotel-Living a grande preço?"
    ],
    [
      "Por que viajar em modo sobrevivência… quando podes viajar em modo bem-estar?",
      "Por que ter de deixar o apartamento às 10h… quando num hotel podes pedir facilmente late check-out?"
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