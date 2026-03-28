import React, { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useTranslation } from "@/hooks/useTranslation";
export function HotelNewAccordionMenuES() {
  const [openItem, setOpenItem] = useState<string | null>(null);
  const {
    t
  } = useTranslation('hotel-accordion');
  const handleItemToggle = (value: string) => {
    setOpenItem(openItem === value ? null : value);
  };
  return <div className="pt-4 border-t border-yellow-300/30 rounded-lg p-6 shadow-lg backdrop-blur-sm mb-2 py-[15px] my-[55px] px-[12px] bg-[#8ff8f6]">
      <Accordion type="single" collapsible className="w-full space-y-3" value={openItem || ""} onValueChange={setOpenItem}>
        <AccordionItem value="los-beneficios" className="overflow-hidden border-none shadow-xl">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#6804A3] to-[#6804A3] rounded-t-xl border-l-6 border-[#9861FF] hover:from-[#7805B0] hover:to-[#7805B0] transition-all duration-300 bg-[#557155]">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              1 - LOS BENEFICIOS
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#6804A3]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#9861FF]/50">
            <Accordion type="single" collapsible className="w-full space-y-2">
              <AccordionItem value="ocupacion-100" className="border-b border-[#FFF9B0]/20">
                <AccordionTrigger className="text-[#FFF9B0] font-semibold text-sm py-2">
                  1.1 100% de ocupación todo el año
                </AccordionTrigger>
                <AccordionContent className="text-[#FFF9B0] text-sm space-y-2 pl-4">
                  <p>• Las tasas de ocupación pueden alcanzar el 100% durante todo el año</p>
                  <p>• Cero habitaciones vacías significa máximo beneficio</p>
                  <p>• Ocupación completa incluso durante períodos tradicionalmente lentos</p>
                  <p>• Flujo de ingresos constante sin mínimos estacionales</p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="menores-costes" className="border-b border-[#FFF9B0]/20">
                <AccordionTrigger className="text-[#FFF9B0] font-semibold text-sm py-2">
                  1.2 Menores costes operativos
                </AccordionTrigger>
                <AccordionContent className="text-[#FFF9B0] text-sm space-y-2 pl-4">
                  <p>• Solo un día laborable para todas las entradas/salidas. Cero huecos entre estancias</p>
                  <p>• Tasas de rotación reducidas significan menores costes de limpieza</p>
                  <p>• Estancias extendidas (8, 16, 24 y 32 días) reducen gastos operativos</p>
                  <p>• Procesos de check-in/out simplificados ahorran tiempo del personal</p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="estabilidad-personal" className="border-b border-[#FFF9B0]/20">
                <AccordionTrigger className="text-[#FFF9B0] font-semibold text-sm py-2">
                  1.3 Mayor estabilidad del personal
                </AccordionTrigger>
                <AccordionContent className="text-[#FFF9B0] text-sm space-y-2 pl-4">
                  <p>• Ocupación constante = empleo durante todo el año</p>
                  <p>• Menor rotación de personal reduce costes de contratación y formación</p>
                  <p>• Mayor satisfacción de empleados con horarios estables</p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="ingresos-actividades" className="border-b border-[#FFF9B0]/20">
                <AccordionTrigger className="text-[#FFF9B0] font-semibold text-sm py-2">
                  1.4 Ingresos añadidos de actividades temáticas
                </AccordionTrigger>
                <AccordionContent className="text-[#FFF9B0] text-sm space-y-2 pl-4">
                  <p>• Nuevas fuentes de ingresos a través de eventos especializados</p>
                  <p>• Oportunidades de merchandising vinculadas a temas del hotel</p>
                  <p>• Ofertas de servicios extendidos generan mayor gasto</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="comparar-sistemas" className="overflow-hidden border-none shadow-xl">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#6804A3] to-[#6804A3] rounded-t-xl border-l-6 border-[#9861FF] hover:from-[#7805B0] hover:to-[#7805B0] transition-all duration-300">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              2 - COMPARAR SISTEMAS
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#6804A3]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#9861FF]/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-[#FFF9B0] font-bold text-lg mb-4">MODELO TRADICIONAL</h4>
                <div className="space-y-2 text-[#FFF9B0] text-sm">
                  <p>1. Entradas/salidas constantes</p>
                  <p>2. Más limpieza, lavandería, rotación</p>
                  <p>3. Mayor carga de trabajo en recepción</p>
                  <p>4. Ocupación impredecible</p>
                  <p>5. Huecos entre reservas = Noches vacías = Beneficios perdidos</p>
                  <p>6. Temporadas altas y bajas. El personal va y viene</p>
                  <p>7. Personal desmotivado, no entrenable, no profesional</p>
                  <p>8. Los huéspedes van y vienen. Sin conexión, sin lealtad</p>
                  <p>9. Reservas frías, aisladas. Una tras otra</p>
                  <p>10. Los apartamentos de alquiler ganan con precios más bajos</p>
                </div>
              </div>
              <div>
                <h4 className="text-[#FFF9B0] font-bold text-lg mb-4">MODELO HOTEL LIVING</h4>
                <div className="space-y-2 text-[#FFF9B0] text-sm">
                  <p>1. Días fijos de entrada/salida = Operaciones más fluidas</p>
                  <p>2. Menos limpiezas, menos transiciones</p>
                  <p>3. Recepción más eficiente y optimizada</p>
                  <p>4. Estancias más largas = Mayor ocupación</p>
                  <p>5. Cero noches vacías = Máximo beneficio</p>
                  <p>6. Temporada alta todo el año. Personal estable</p>
                  <p>7. Personal motivado, entrenable, profesional</p>
                  <p>8. Los huéspedes se sienten como en casa y regresan</p>
                  <p>9. No solo reservas: comunidades</p>
                  <p>10. Elegancia. Humanidad. Servicios. Los hoteles ganan</p>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="no-solo-llenamos" className="overflow-hidden border-none shadow-xl">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#6804A3] to-[#6804A3] rounded-t-xl border-l-6 border-[#9861FF] hover:from-[#7805B0] hover:to-[#7805B0] transition-all duration-300">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              3 - NO SOLO LLENAMOS HABITACIONES
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#6804A3]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#9861FF]/50">
            <div className="space-y-3 text-[#FFF9B0] text-sm">
              <p>• Personas agrupadas por afinidades</p>
              <p>• Cero azar. 100% conexiones</p>
              <p>• Hoteles para pertenecer, no solo para alojarse</p>
              <p>• Estamos transformando la sociedad</p>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="cuanto-beneficio" className="overflow-hidden border-none shadow-xl">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#6804A3] to-[#6804A3] rounded-t-xl border-l-6 border-[#9861FF] hover:from-[#7805B0] hover:to-[#7805B0] transition-all duration-300">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              4 - ¿CUÁNTO BENEFICIO SE ESTÁ PERDIENDO?
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#6804A3]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#9861FF]/50">
            <Accordion type="single" collapsible className="w-full space-y-2">
              <AccordionItem value="hoteles-occidentales" className="border-b border-[#FFF9B0]/20">
                <AccordionTrigger className="text-[#FFF9B0] font-semibold text-sm py-2">
                  4.1 Hoteles occidentales. ¿Cuántos beneficios perdemos cada año?
                </AccordionTrigger>
                <AccordionContent className="text-[#FFF9B0] text-sm space-y-2 pl-4">
                  <p>• $90.000 millones cada año, según las estimaciones más conservadoras</p>
                  <p>• No es "facturación", sino ganancias puras, antes de impuestos</p>
                  <p>• La tasa real media de ocupación hotelera occidental es del 50%</p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="su-hotel" className="border-b border-[#FFF9B0]/20">
                <AccordionTrigger className="text-[#FFF9B0] font-semibold text-sm py-2">
                  4.2 ¿Y cuántos beneficios pierde su hotel cada año?
                </AccordionTrigger>
                <AccordionContent className="text-[#FFF9B0] text-sm space-y-2 pl-4">
                  <p>• 5 habitaciones vacías = unos $55.000 perdidos anualmente</p>
                  <p>• 20 habitaciones vacías = unos $220.000 de ganancia pura</p>
                  <p>• 200 habitaciones cerradas octubre-mayo = más de $1 millón perdido + $420.000 en pérdidas</p>
                  <p>• 500 habitaciones = más de $3 millones de ganancia perdida</p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="verdadero-potencial" className="border-b border-[#FFF9B0]/20">
                <AccordionTrigger className="text-[#FFF9B0] font-semibold text-sm py-2">
                  4.3 Sí. La gran mayoría de hoteles pierden su verdadero potencial
                </AccordionTrigger>
                <AccordionContent className="text-[#FFF9B0] text-sm space-y-2 pl-4">
                  <p>• Las habitaciones vacías son nuestro oro sin explotar</p>
                  <p>• Pocos alcanzamos el 100% de ocupación todo el año</p>
                  <p>• Todos perdemos dinero, no importa el número de estrellas</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="hoteles-afinidades" className="overflow-hidden border-none shadow-xl">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#6804A3] to-[#6804A3] rounded-t-xl border-l-6 border-[#9861FF] hover:from-[#7805B0] hover:to-[#7805B0] transition-all duration-300">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              5 - ¿QUÉ SON LOS HOTELES POR AFINIDADES?
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#6804A3]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#9861FF]/50">
            <div className="space-y-6 text-[#FFF9B0] text-sm">
              <div>
                <h4 className="font-semibold mb-2">Ejemplo 1</h4>
                <p>• Hotel enfocado en tango, teatro o deportes (ciclismo, golf, tenis, etc.)</p>
                <p>• Comunidad en torno a intereses comunes</p>
                <p>• Sin huecos entre estancias. Sin pérdidas</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Ejemplo 2</h4>
                <p>• Hotel temático de cocina</p>
                <p>• Chefs, clases, maridajes de vinos</p>
                <p>• Tarifas premium, estancias más largas</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Ejemplo 3</h4>
                <p>• Hoteles de inmersión lingüística</p>
                <p>• Huéspedes agrupados por nivel de idioma</p>
                <p>• Personal que habla el idioma</p>
                <p>• Experiencia lingüística completa</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="nuestra-tecnologia" className="overflow-hidden border-none shadow-xl">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#6804A3] to-[#6804A3] rounded-t-xl border-l-6 border-[#9861FF] hover:from-[#7805B0] hover:to-[#7805B0] transition-all duration-300">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              6 - NUESTRA TECNOLOGÍA HACE LO QUE NINGUNA PUEDE
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#6804A3]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#9861FF]/50">
            <div className="space-y-3 text-[#FFF9B0] text-sm">
              <p>• Conecta personas con intereses compartidos</p>
              <p>• Coordina entradas y salidas para cero huecos</p>
              <p>• Optimiza estancias para máxima rentabilidad</p>
              <p>• Una plataforma. Múltiples fuentes de ingresos</p>
              <p>• Segmentación precisa por interés y afinidad</p>
              <p>• Marketing a comunidades motivadas, no viajeros aleatorios</p>
              <p>• Alcance global con targeting híper-específico</p>
              <p>• Tasas de conversión más altas. Costes de adquisición más bajos</p>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="redes-sociales" className="overflow-hidden border-none shadow-xl">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#6804A3] to-[#6804A3] rounded-t-xl border-l-6 border-[#9861FF] hover:from-[#7805B0] hover:to-[#7805B0] transition-all duration-300">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              7 - HOTELES POR AFINIDADES = REDES SOCIALES PERFECTAS
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#6804A3]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#9861FF]/50">
            <div className="space-y-3 text-[#FFF9B0] text-sm">
              <p>• Los intereses compartidos crean conexiones instantáneas</p>
              <p>• La psicología grupal impulsa estancias más largas y visitas de retorno</p>
              <p>• Las actividades temáticas aumentan el compromiso y la lealtad</p>
              <p>• La pertenencia comunitaria se vuelve adictiva</p>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="ellos-necesitan" className="overflow-hidden border-none shadow-xl">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#6804A3] to-[#6804A3] rounded-t-xl border-l-6 border-[#9861FF] hover:from-[#7805B0] hover:to-[#7805B0] transition-all duration-300">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              8 - ELLOS NECESITAN SU HOTEL
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#6804A3]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#9861FF]/50">
            <div className="space-y-6 text-[#FFF9B0] text-sm">
              <div>
                <p className="font-semibold mb-3">PORQUE EL 40% DE LA POBLACIÓN OCCIDENTAL:</p>
                <div className="space-y-2 pl-4">
                  <p>• Vive sola o en pareja</p>
                  <p>• Está pre-jubilada o jubilada</p>
                  <p>• Es trabajadora online</p>
                  <p>• Es estudiante que vive lejos de casa</p>
                  <p>• Vive demasiado lejos del trabajo</p>
                </div>
              </div>
              
              <div>
                <p className="font-semibold mb-3">Y LA MAYORÍA DE ELLOS:</p>
                <div className="space-y-2 pl-4">
                  <p>• Quisieran liberarse de las tareas domésticas</p>
                  <p>• Se sienten demasiado solos</p>
                  <p>• No tienen vínculos familiares</p>
                  <p>• Desean ampliar su vida social</p>
                  <p>• Desean conocer personas con gustos y mentalidades similares</p>
                  <p>• Necesitan la seguridad completa de vivir en un hotel, especialmente en el caso de personas mayores o solteras</p>
                </div>
              </div>
              
              <div>
                <p className="font-semibold mb-3">PORQUE EL SUEÑO DE LA HUMANIDAD ES VIVIR EN UN HOTEL</p>
                <div className="space-y-2 pl-4">
                  <p>Con todo resuelto</p>
                  <p>En unas vacaciones sin fin</p>
                </div>
              </div>
              
              <div>
                <p className="font-semibold mb-3">Entonces, ¿por qué tenemos un 50% de habitaciones vacías cada año?</p>
                <div className="space-y-2 pl-4">
                  <p>• Porque las personas quieren socializar. Hacer amigos</p>
                  <p>• Quieren quedarse más tiempo en su hotel</p>
                  <p>• Quieren que usted se ocupe de sus tareas domésticas</p>
                  <p>• Necesitan urgentemente sus habitaciones vacías y sus servicios</p>
                  <p>• Ayúdeles: deles ambas cosas</p>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="nueva-revolucion" className="overflow-hidden border-none shadow-xl">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#6804A3] to-[#6804A3] rounded-t-xl border-l-6 border-[#9861FF] hover:from-[#7805B0] hover:to-[#7805B0] transition-all duration-300">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              9 - LAS AFINIDADES SON LA NUEVA REVOLUCIÓN SOCIAL
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#6804A3]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#9861FF]/50">
            <div className="space-y-3 text-[#FFF9B0] text-sm">
              <p>• Los huéspedes no solo quieren habitaciones: quieren sentido</p>
              <p>• Los intereses conectan más rápido que los descuentos</p>
              <p>• Las estancias temáticas generan fidelidad</p>
              <p>• Los desconocidos se convierten en comunidades</p>
              <p>• No solo llenas habitaciones: generas pertenencia</p>
              <p>• Atrae a los huéspedes adecuados</p>
              <p>• Tu afinidad es tu imán</p>
              <p>• Los hoteles con alma ganan el futuro</p>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="integracion-perfecta" className="overflow-hidden border-none shadow-xl">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#6804A3] to-[#6804A3] rounded-t-xl border-l-6 border-[#9861FF] hover:from-[#7805B0] hover:to-[#7805B0] transition-all duration-300">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              10 - SOMOS INTEGRACIÓN PERFECTA
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#6804A3]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#9861FF]/50">
            <div className="space-y-3 text-[#FFF9B0] text-sm">
              <p>• No tiene que elegir entre sistemas</p>
              <p>• Combine ambos modelos como desee</p>
              <p>• Comience con solo unas pocas habitaciones</p>
              <p>• Amplíe según sea necesario</p>
              <p>• Cambie más habitaciones cuando tenga sentido</p>
              <p>• Plataforma que se integra sin esfuerzo</p>
              <p>• Cero interrupciones diarias</p>
              <p>• Nos adaptamos a usted, no al revés</p>
              <p>• Esto es flexibilidad. Esto es rentabilidad</p>
              <p>• Esto es Integración Perfecta</p>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="pasos-unirse" className="overflow-hidden border-none shadow-xl">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#6804A3] to-[#6804A3] rounded-t-xl border-l-6 border-[#9861FF] hover:from-[#7805B0] hover:to-[#7805B0] transition-all duration-300">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              11 - PASOS PARA UNIRSE A HOTEL-LIVING
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#6804A3]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#9861FF]/50">
            <div className="space-y-3 text-[#FFF9B0] text-sm">
              <p>• Identifique habitaciones vacías (mínimo 8 días)</p>
              <p>• Defina un concepto basado en afinidades</p>
              <p>• Regístrese y use la calculadora en línea</p>
              <p>• Añada su hotel en el panel</p>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="calculadora" className="overflow-hidden border-none shadow-xl">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#6804A3] to-[#6804A3] rounded-t-xl border-l-6 border-[#9861FF] hover:from-[#7805B0] hover:to-[#7805B0] transition-all duration-300">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              12 - {t('calculator.title')}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#6804A3]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#9861FF]/50">
            <div className="space-y-6 text-left py-6">
              <div className="space-y-4 text-[#FFF9B0] text-sm whitespace-pre-line">
                {t('calculator.text')}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-3">
                  <h4 className="text-[#FFF9B0] font-bold text-lg">Versión en Inglés</h4>
                  <img src="/lovable-uploads/a434a2cc-c665-4c9b-828a-d5945a335947.png" alt="Calculadora Hotel-Living Versión Inglés" className="w-full h-auto rounded-lg border border-[#FFF9B0]/30 shadow-lg" />
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-[#FFF9B0] font-bold text-lg">Versión en Español</h4>
                  <img src="/lovable-uploads/132f46c4-4760-4907-bb8a-30ea52da9991.png" alt="Calculadora Hotel-Living Versión Español" className="w-full h-auto rounded-lg border border-[#FFF9B0]/30 shadow-lg" />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>;
}