
import React from "react";
import { QuestionGroup } from "./QuestionGroup";

export function SocietyContentES() {
  const questionGroups = [
    [
      "¿Por qué mantener modelos antiguos de vivienda para familias numerosas que ya no existen?",
      "¿Por qué mantener separados necesidades y recursos, cuando Hotel-Living los une?",
      "¿Por qué construir más, cuando no hemos alineado lo que ya tenemos?",
      "¿Por qué sufrir la presión habitacional, cuando la solución ya está hecha, limpia y esperando?"
    ],
    [
      "¿Por qué dejar habitaciones vacías, cuando hay personas esperando?",
      "¿Por qué mantener a tantas personas solas, usando tantos recursos, cuando podrían vivir eficientemente y más felices en estancias convenientes en hoteles?",
      "¿Por qué dejar pisos en el centro de la ciudad infrautilizados, cuando las familias viven lejos de donde trabajan?",
      "¿Por qué acumular metros cuadrados vacíos, cuando las ciudades claman por espacio?"
    ],
    [
      "¿Por qué aceptar viviendas desaprovechadas, cuando hay más necesidad que nunca?",
      "¿Por qué permitir la soledad, cuando la conexión está a solo una puerta de distancia?",
      "¿Por qué aislar a tantas personas en apartamentos casi vacíos, cuando podrían vivir entre otros, cuidados y conectados?",
      "¿Por qué mantener hoteles como espacios muertos, cuando podrían estar vivos con propósito?"
    ],
    [
      "Reajustamos la sociedad con la forma en que las personas realmente viven.",
      "Reconocemos un mundo cambiante y rediseñamos la vivienda para adaptarla.",
      "Estructuramos un sistema más inteligente para vivir, viajar y trabajar.",
      "Repensamos la hospitalidad para reconstruir la sociedad."
    ],
    [
      "Conectamos necesidades, espacios y personas, todo en una solución.",
      "Revitalizamos la sociedad reinventando cómo vivimos.",
      "Transformamos las brechas sociales en oportunidades de crecimiento.",
      "Construimos sistemas que prosperan incluso en crisis."
    ],
    [
      "Impulsamos la prosperidad uniendo necesidades con soluciones.",
      "Creamos valor conectando lo que ya existe.",
      "Fusionamos bienes raíces con humanidad real.",
      "Repensamos la necesidad de construir más y usar mejor."
    ],
    [
      "Mejoramos lo que ya existe.",
      "Activamos lo que la sociedad ya tiene.",
      "Coordinamos activos existentes con desafíos modernos.",
      "Alineamos recursos vacíos con necesidades humanas reales."
    ],
    [
      "Damos vida a recursos ociosos.",
      "Impulsamos los bienes raíces alineando recursos y necesidades sociales.",
      "Redefinimos bienes raíces mediante un uso centrado en las personas.",
      "Revitalizamos bienes raíces dándoles propósito."
    ],
    [
      "Asignamos propósito a cada metro cuadrado.",
      "Energizamos propiedades sin uso con vida y personas.",
      "Convertimos edificios infrautilizados en motores sociales.",
      "Reimaginamos qué puede ser un hotel."
    ],
    [
      "Evolucionamos hoteles vacíos en ecosistemas vivos.",
      "Convertimos hoteles en centros comunitarios.",
      "Damos nuevo propósito a cada propiedad.",
      "Transformamos habitaciones vacías en oportunidades sociales."
    ],
    [
      "Convertimos habitaciones vacías en comunidades vibrantes.",
      "Reconectamos personas con los lugares que realmente necesitan.",
      "Conectamos estilos de vida modernos con propósito significativo.",
      "Transicionamos de la vivienda tradicional a comunidades de pensamiento avanzado."
    ],
    [
      "Modernizamos la sociedad modernizando cómo y dónde vivimos.",
      "Repensamos la vivienda para un mundo móvil.",
      "Diseñamos modelos de vida que siguen tu estilo de vida.",
      "Entendemos el movimiento y construimos hogares que se mueven contigo."
    ],
    [
      "Ofrecemos lugares que viajan contigo y aún se sienten como en casa.",
      "Dejamos atrás modelos estáticos para abrazar la vida dinámica.",
      "Modelamos hogares para la vida moderna.",
      "Adaptamos espacios a las necesidades sociales actuales."
    ],
    [
      "Corregimos modelos habitacionales obsoletos que ya no nos sirven.",
      "Reconstruimos vínculos humanos en un mundo fragmentado.",
      "Mejoramos la seguridad a través de la confianza y la conexión.",
      "Construimos espacios que fomentan la convivencia."
    ],
    [
      "Diseñamos entornos sociales para la tranquilidad.",
      "Conectamos la sociedad mediante afinidades, multiplicando fuerzas.",
      "Empoderamos a la juventud mediante propósito.",
      "Elevamos a la juventud a través de oportunidades reales."
    ],
    [
      "Apoyamos el talento con roles con sentido.",
      "Lanzamos carreras para la nueva generación.",
      "Generamos impacto invirtiendo en jóvenes profesionales.",
      "Abrimos miles de puertas para los líderes del mañana."
    ],
    [
      "Formamos a la próxima ola de líderes sociales.",
      "Construimos empleos reales basados en la conexión humana.",
      "Convertimos pasión en empleo significativo.",
      "Introducimos el Organizador de Grupos: un rol nuevo para una era nueva."
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
