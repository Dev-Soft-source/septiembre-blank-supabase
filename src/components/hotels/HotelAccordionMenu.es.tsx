import React, { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ComparisonTable } from "./accordion/ComparisonTable";
import { BenefitsSection } from "./accordion/sections";

export function HotelAccordionMenuES() {
  const [openItem, setOpenItem] = useState<string | null>(null);
  
  const handleItemToggle = (value: string) => {
    setOpenItem(openItem === value ? null : value);
  };
  
  return (
    <div className="pt-4 border-t border-yellow-300/30 bg-[#460F54]/30 rounded-lg p-6 shadow-lg backdrop-blur-sm mb-2 px-0 py-[15px] my-0">
      <Accordion type="single" collapsible className="w-full space-y-3" value={openItem || ""} onValueChange={setOpenItem}>
        <AccordionItem value="the-benefits" className="overflow-hidden border-none shadow-xl">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#730483] to-[#570366] rounded-t-xl border-l-6 border-[#FFF9B0] hover:from-[#8A0499] hover:to-[#660377] transition-all duration-300">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              1 - Los Beneficios
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#560365]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#FFF9B0]/50">
            <BenefitsSection />
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="compare-systems" className="overflow-hidden border-none shadow-xl">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#730483] to-[#570366] rounded-t-xl border-l-6 border-[#FFF9B0] hover:from-[#8A0499] hover:to-[#660377] transition-all duration-300">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              2 - Comparar Sistemas
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#560365]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#FFF9B0]/50">
            <ComparisonTable />
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="we-dont-just-fill-rooms" className="overflow-hidden border-none shadow-xl">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#730483] to-[#570366] rounded-t-xl border-l-6 border-[#FFF9B0] hover:from-[#8A0499] hover:to-[#660377] transition-all duration-300">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              3 - No solo llenamos habitaciones
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#560365]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#FFF9B0]/50">
            <div className="space-y-6 text-left py-6">
              <p className="text-base flex items-start text-[#FFF9B0]">
                <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span>
                Personas agrupadas por afinidades
              </p>
              <p className="text-base flex items-start text-[#FFF9B0]">
                <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span>
                Cero azar. 100% conexiones
              </p>
              <p className="text-base flex items-start text-[#FFF9B0]">
                <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span>
                Hoteles para pertenecer, no solo para alojarse
              </p>
              <p className="text-base flex items-start text-[#FFF9B0]">
                <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span>
                Estamos transformando la sociedad
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="how-much-profit-missing" className="overflow-hidden border-none shadow-xl">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#730483] to-[#570366] rounded-t-xl border-l-6 border-[#FFF9B0] hover:from-[#8A0499] hover:to-[#660377] transition-all duration-300">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              4 - ¿Cuánto beneficio estás perdiendo?
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#560365]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#FFF9B0]/50">
            <div className="space-y-6 text-left py-6">
              <p className="text-base font-semibold py-0">4.1 – HOTELES OCCIDENTALES. ¿CUÁNTOS BENEFICIOS PERDEMOS CADA AÑO?</p>
              <p className="text-base flex items-start pl-4 text-[#FFF9B0]"><span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span> En conjunto, se pierden unos $75.000 millones cada año</p>
              <p className="text-base flex items-start pl-4 text-[#FFF9B0]"><span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span> No se venden: son ganancias puras, antes de impuestos</p>
              <p className="text-base flex items-start pl-4 text-[#FFF9B0]"><span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span> Nuestra tasa media anual de ocupación es del 60%</p>
              <p className="text-base flex items-start pl-4 text-[#FFF9B0]"><span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span> Eso solo nos permite cubrir costes y tener pocos ingresos</p>
              <p className="text-base flex items-start pl-4 mb-6 text-[#FFF9B0]"><span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span> Pero no capturamos el verdadero beneficio: el 40% restante de habitaciones vacías. Nuestra ganancia pura</p>
              
              <p className="text-base font-semibold mt-14 py-[9px] text-[#FFF9B0]">4.2 – ¿Y CUÁNTOS BENEFICIOS PIERDE SU HOTEL CADA AÑO?</p>
              <p className="text-base flex items-start pl-4 text-[#FFF9B0]"><span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span> Solo cinco habitaciones vacías al día = unos $55.000 perdidos anualmente</p>
              <p className="text-base flex items-start pl-4 text-[#FFF9B0]"><span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span> 20 habitaciones vacías al día = unos $220.000 de ganancia pura</p>
              <p className="text-base flex items-start pl-4 text-[#FFF9B0]"><span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span> Un hotel de 200 habitaciones cerrado de octubre a mayo pierde $1 millón y además acumula $420.000 en pérdidas</p>
              <p className="text-base flex items-start pl-4 mb-6 text-[#FFF9B0]"><span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span> ¿Y uno de 500 habitaciones? Más de $3 millones de ganancia perdida cada año. Y las pérdidas… mejor ni mirarlas</p>
              
              <p className="text-base font-semibold mt-14 py-[17px] text-[#FFF9B0]">4.3 – SÍ. LA GRAN MAYORÍA DE HOTELES PIERDEN SU VERDADERO POTENCIAL DE BENEFICIO</p>
              <p className="text-base flex items-start pl-4 text-[#FFF9B0]"><span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span> Las habitaciones vacías son nuestro oro sin explotar</p>
              <p className="text-base flex items-start pl-4 text-[#FFF9B0]"><span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span> Pocos alcanzamos el 100% de ocupación todo el año</p>
              <p className="text-base flex items-start pl-4 text-[#FFF9B0]"><span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span> No importa si somos de 3 o 5 estrellas: todos perdemos dinero</p>
              <p className="text-base flex items-start pl-4 text-[#FFF9B0]"><span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span> Las habitaciones de ganancia pura no se venden</p>
              <p className="text-base flex items-start pl-4 text-[#FFF9B0]"><span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span> Estamos renunciando a nuestro lugar legítimo en la sociedad</p>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="specialized-hotels" className="overflow-hidden border-none shadow-xl">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#730483] to-[#570366] rounded-t-xl border-l-6 border-[#FFF9B0] hover:from-[#8A0499] hover:to-[#660377] transition-all duration-300">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              5 - Hoteles Especializados
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#560365]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#FFF9B0]/50">
            <div className="space-y-3 text-left py-4">
              <p className="text-lg text-[#FFF9B0]">Hoteles Pet-Friendly</p>
              <p className="text-base flex items-start pl-4 text-[#FFF9B0]">- Bienvenidas las mascotas</p>
              <p className="text-base flex items-start pl-4 text-[#FFF9B0]">- Amenidades especiales para mascotas</p>
              
              <p className="text-lg font-semibold mt-6 text-[#FFF9B0]">Hoteles de Bienestar</p>
              <p className="text-base flex items-start pl-4 text-[#FFF9B0]">- Instalaciones de spa y fitness</p>
              <p className="text-base flex items-start pl-4 text-[#FFF9B0]">- Opciones de comida saludable</p>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="our-technology" className="overflow-hidden border-none shadow-xl">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#730483] to-[#570366] rounded-t-xl border-l-6 border-[#FFF9B0] hover:from-[#8A0499] hover:to-[#660377] transition-all duration-300">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              6 - Nuestra Tecnología
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#560365]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#FFF9B0]/50">
            <div className="space-y-4 text-left py-4">
              <p className="text-base flex items-start text-[#FFF9B0]">
                <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span>
                Sistema de reservas avanzado
              </p>
              <p className="text-base flex items-start text-[#FFF9B0]">
                <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span>
                Actualizaciones de disponibilidad en tiempo real
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
