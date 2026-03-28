
import React from "react";
import { QuestionGroup } from "./QuestionGroup";

export function HotelContentES() {
  const questionGroups = [
    [
      "¿Por qué ignorar a sus huéspedes más rentables, los que se quedan más tiempo, gastan más y exigen menos?",
      "¿Por qué dejar ganancias sin aprovechar, cuando pueden sumar miles cada año?",
      "¿Por qué conformarse con los fines de semana, cuando sus habitaciones podrían estar ocupadas todo el mes?",
      "¿Por qué perder miles cada año, cuando sus habitaciones podrían trabajar a tiempo completo para usted?"
    ],
    [
      "¿Por qué bloquear un flujo diario de ingresos, cuando ya está llamando a su puerta?",
      "¿Por qué mantener habitaciones vacías, cuando sus costes fijos ya están pagados?",
      "¿Por qué aceptar menos, cuando su hotel es capaz de mucho más?",
      "¿Por qué ver cómo el dinero se escapa, cuando ya tiene el espacio para ganarlo?"
    ],
    [
      "¿Por qué dejar fuera su opción más rentable, año tras año?",
      "¿Por qué elegir la incertidumbre, cuando Hotel-Living ofrece ingresos mensuales estables?",
      "¿Por qué evitar su fórmula de máxima rentabilidad, cuando ya posee las habitaciones?",
      "¿Por qué cerrar la puerta a un beneficio diario que no requiere esfuerzo adicional?"
    ],
    [
      "¿Por qué dejar pasar ingresos fáciles, cuando las estancias largas combinan dinero y tranquilidad?",
      "¿Por qué conformarse con picos estacionales, cuando puede tener beneficios constantes todo el año?",
      "¿Por qué sacrificar márgenes, cuando las estancias largas reducen costes y aumentan beneficios?",
      "¿Por qué rechazar una segunda línea de ingresos, que fluye silenciosamente cada día?"
    ],
    [
      "¿Por qué pasar por alto lo que es casi margen puro, día tras día, mes tras mes?",
      "¿Por qué limitarse solo a tarifas de habitación, cuando cada huésped puede multiplicar sus ingresos?",
      "¿Por qué dejar dinero sobre la mesa, cuando cada metro cuadrado puede monetizarse?",
      "¿Por qué depender de reservas de última hora, cuando los ingresos predecibles están a un solo paso?"
    ],
    [
      "¿Por qué dejar que la rentabilidad dependa del azar, cuando puede convertirla en algo estable?",
      "¿Por qué dejar escapar el potencial, cuando una decisión podría cambiar sus cifras para siempre?",
      "¿Por qué operar por debajo de su capacidad, cuando el lleno total multiplica los beneficios?",
      "¿Por qué pensar a corto plazo, cuando las estancias largas construyen ganancias a largo plazo?"
    ],
    [
      "¿Por qué sobrevivir, cuando podría prosperar?",
      "¿Por qué llamarlo \"solo una habitación\", cuando puede convertirse en un motor de ganancias diario?",
      "No es una reserva. Es un depósito diario de beneficio puro.",
      "No es ingreso pasivo. Es ingreso dorado. Y ya es suyo."
    ],
    [
      "No es adicional, es esencial. Y está creciendo silenciosamente cada día.",
      "No es profesional dejar beneficios atrás. No es inteligente infrautilizar su propio negocio.",
      "¿Por qué soportar los altibajos de las temporadas, cuando podría estar lleno todo el año?",
      "¿Por qué vivir de picos y valles, cuando los ingresos constantes están al alcance?"
    ],
    [
      "¿Por qué aceptar la incertidumbre, cuando las estancias largas significan ingresos seguros y recurrentes?",
      "¿Por qué reaccionar, cuando una buena planificación le da paz financiera?",
      "¿Por qué luchar cada día por clientes, cuando una sola decisión puede llenar sus habitaciones sin esfuerzo?",
      "¿Por qué contratar y despedir continuamente, cuando las reservas estables significan personal estable?"
    ],
    [
      "¿Por qué perseguir huéspedes cada día, cuando uno solo puede quedarse semanas?",
      "¿Por qué multiplicar el trabajo, cuando una estancia larga reemplaza diez check-ins?",
      "¿Por qué aceptar el caos, cuando las estancias largas traen calma y claridad?",
      "¿Por qué aceptar el estrés, cuando la tranquilidad llega con cada estancia prolongada?"
    ],
    [
      "¿Por qué alojar desconocidos por una noche, cuando los huéspedes de larga estancia se integran en el ritmo de su hotel?",
      "¿Por qué alojar ruido de corto plazo, cuando podría recibir valor de largo plazo?",
      "¿Por qué llenar las habitaciones una vez, cuando un buen huésped las llena una y otra vez?",
      "¿Por qué alquilar habitaciones, cuando puede crear un ecosistema?"
    ],
    [
      "¿Por qué dejar dormir su hotel, cuando hay personas listas para vivir en él?",
      "¿Por qué limitar su hotel, cuando podría transformarse en algo mayor?",
      "¿Por qué vender silencio, cuando puede vender actividad, energía y vida?",
      "¿Por qué ser invisible para la sociedad, cuando puede ser un pilar local de convivencia?"
    ],
    [
      "¿Por qué vender noches, cuando puede vender pertenencia?",
      "¿Por qué depender de las temporadas, cuando podría depender de la estabilidad?",
      "¿Por qué aspirar solo a habitaciones llenas, cuando puede aspirar a vidas llenas dentro de ellas?"
    ]
  ];

  return (
    <div className="space-y-8 text-white">
      {questionGroups.map((questions, index) => (
        <QuestionGroup key={index} questions={questions} />
      ))}
      
      {/* Professional Study Offer */}
      <div className="mt-12 flex justify-center">
        <div 
          className="bg-white/95 border border-gray-300 rounded-lg p-8 max-w-2xl cursor-pointer hover:bg-white/100 hover:shadow-lg transition-all duration-300"
          onClick={() => {
            // TODO: Navigate to professional study page
            console.log("Navigate to professional study page");
          }}
        >
          <p className="text-gray-800 text-center text-lg leading-relaxed font-medium">
            Obtenga, sin coste alguno, un completo estudio profesional,<br />
            técnico y presencial, sobre su hotel y sus posibilidades de desarrollo.
          </p>
        </div>
      </div>
    </div>
  );
}
