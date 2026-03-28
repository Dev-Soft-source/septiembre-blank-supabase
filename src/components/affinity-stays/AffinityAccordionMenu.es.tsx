
import React from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export function AffinityAccordionMenuES() {
  const faqItems = [
    {
      question: "¿Qué son las Afinidades de Hotel-Living?",
      answer: "Son temas o intereses comunes que permiten a los huéspedes conectar entre sí y compartir experiencias durante su estancia."
    },
    {
      question: "¿Cansado de viajar solo? ¿Quieres conocer gente que realmente te entienda?",
      answer: "Hotel-Living facilita que encuentres a personas que comparten tus intereses, para que tu estancia sea más social y enriquecedora."
    },
    {
      question: "¿Qué es exactamente un Hotel de Afinidades?",
      answer: "Es un hotel que publica un tema y llama a los clientes interesados en un tema concreto, ayudando a que los huéspedes con afinidades similares se reúnan."
    },
    {
      question: "¿Haré amigos?",
      answer: "Es muy posible. Los hoteles de afinidades están diseñados para fomentar la conexión entre personas con gustos e intereses afines."
    },
    {
      question: "¿El hotel organiza actividades?",
      answer: "Algunos hoteles pueden ofrecer actividades opcionales relacionadas con el tema de afinidad, pero no es obligatorio participar."
    },
    {
      question: "¿Siempre hay un coordinador o anfitrión?",
      answer: "No necesariamente. Algunos hoteles cuentan con un coordinador, pero otros simplemente crean el entorno para que las conexiones fluyan de forma natural."
    },
    {
      question: "¿El hotel está decorado según el tema?",
      answer: "Generalmente no, pero en algunos casos la decoración y el ambiente del hotel pueden estar alineados con el tema de afinidad elegido."
    },
    {
      question: "¿Cuánto duran las estancias?",
      answer: "Las estancias, renovables según disponibilidad, son de 8, 15, 22 o 29 días, según el plan que elijas y el hotel."
    },
    {
      question: "¿Puedo probar diferentes afinidades en distintos hoteles?",
      answer: "Por supuesto. Puedes elegir distintas afinidades en cada nueva estancia o incluso combinar varias en el mismo hotel si está disponible."
    },
    {
      question: "¿Y si solo quiero relajarme?",
      answer: "No hay problema. Participas solo en lo que te apetezca. La tranquilidad y la privacidad están garantizadas."
    },
    {
      question: "¿Esto es solo para viajeros solos?",
      answer: "No. Las afinidades son para todo tipo de viajeros: solos, en pareja, en grupo o en familia."
    },
    {
      question: "¿Y si no encuentro un tema que encaje con mis intereses?",
      answer: "Siempre puedes elegir un hotel sin afinidad concreta y disfrutar igualmente de la experiencia Hotel-Living."
    },
    {
      question: "¿Las afinidades están disponibles en todos los hoteles asociados?",
      answer: "No en todos. Depende de la oferta de cada hotel, pero siempre tendrás opciones de afinidades en el portal."
    },
    {
      question: "¿Puedo conectar aunque no haya un tema específico?",
      answer: "Sí. Incluso sin un tema concreto, el entorno de Hotel-Living fomenta el encuentro y la conexión entre personas."
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Accordion type="multiple" className="w-full space-y-4">
        {faqItems.map((item, index) => (
          <AccordionItem key={`affinity-item-${index}`} value={`item-${index}`} className="border border-fuchsia-400/30 rounded-lg overflow-hidden bg-[#5C0869]/80 backdrop-blur-sm">
            <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#5C0869] to-[#4A0557] hover:from-[#6A037C] hover:to-[#550664] transition-all duration-300">
              <span className="text-[#FFF9B0] font-semibold text-lg">{item.question}</span>
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4 bg-[#4A0557]/90 backdrop-blur-md">
              <p className="text-white leading-relaxed">{item.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
