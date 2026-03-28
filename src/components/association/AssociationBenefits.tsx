import React from "react";
import { useTranslation } from "react-i18next";

export function AssociationBenefits() {
  const { t, ready } = useTranslation("association");
  
  // Debug logging
  console.log("AssociationBenefits - Translation ready:", ready);
  console.log("AssociationBenefits - Raw benefits.items:", t("benefits.items", { returnObjects: true }));
  
  // Get benefits with proper fallback
  const rawBenefits = t("benefits.items", { returnObjects: true });
  const benefits = Array.isArray(rawBenefits) ? rawBenefits : [
    "Acabamos con las temporadas medias y bajas.",
    "Multiplicamos radicalmente los beneficios hoteleros.",
    "Activamos el 100 % de la rentabilidad de las habitaciones vacías.",
    "El hotel cobra por anticipado el 5 % de cada reserva, beneficio neto no reembolsable.",
    "Sin suscripciones – Sin membresías – Sin cuotas mensuales – Sin contratos forzosos – Sin costes anticipados – Sin adaptaciones.",
    "Recuperamos a clientes que optaron por los apartamentos turísticos.",
    "Reducimos los costes operativos.",
    "Traemos estancias más largas y rentables.",
    "Unificamos entradas y salidas en un solo día semanal.",
    "Simplificamos la gestión diaria.",
    "Damos absoluta estabilidad de personal.",
    "Llenamos de vida y atractivo los hoteles.",
    "Llevamos a los hoteles sus clientes ideales según afinidades elegidas por el propio hotel.",
    "Conectamos a su asociación con una nueva era de rentabilidad y estabilidad."
  ];
  
  const title = t("benefits.title", "Somos Hotel-Living y estos son algunos de los beneficios directos para sus miembros afiliados");
  
  console.log("AssociationBenefits - Final benefits array:", benefits);
  console.log("AssociationBenefits - Is array:", Array.isArray(benefits));

  return (
    <div className="bg-[#7802A9] backdrop-blur-md rounded-2xl p-8 md:p-12 border border-cyan-400/30 shadow-[0_0_60px_rgba(34,211,238,0.4)] max-w-3xl mx-auto">
      <h2 className="text-lg md:text-xl font-bold text-yellow-300 uppercase tracking-wide mb-8 text-center">
        {title}
      </h2>
      
      <div className="mx-auto">
        {benefits.map((benefit, index) => (
          <div key={index}>
            <div className="flex items-start space-x-4 mb-4">
              <span className="text-green-400 text-2xl mt-1">✓</span>
              <p className="text-white leading-relaxed text-xl">{benefit}</p>
            </div>
            {/* Add blank line after every 4 items */}
            {(index + 1) % 4 === 0 && index !== benefits.length - 1 && (
              <div className="mb-4"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}