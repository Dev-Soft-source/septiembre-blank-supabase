import React, { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useTranslation } from "@/hooks/useTranslation";
export function HotelNewAccordionMenuRO() {
  const [openItem, setOpenItem] = useState<string | null>(null);
  const {
    t
  } = useTranslation('hotel-accordion');
  const handleItemToggle = (value: string) => {
    setOpenItem(openItem === value ? null : value);
  };
  return <div className="pt-4 border-t border-yellow-300/30 rounded-lg p-6 shadow-lg backdrop-blur-sm mb-2 py-[15px] my-0 bg-[#a70adb] mx-[12px] px-[7px]">
      <Accordion type="single" collapsible className="w-full space-y-3" value={openItem || ""} onValueChange={setOpenItem}>
        <AccordionItem value="benefits" className="overflow-hidden border-none shadow-xl">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#730483] to-[#570366] rounded-t-xl border-l-6 border-[#FFF9B0] hover:from-[#8A0499] hover:to-[#660377] transition-all duration-300">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              1 - BENEFICIILE
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#560365]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#FFF9B0]/50">
            <div className="space-y-6 text-left py-6">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-[#FFF9B0]">1.1 - Ocupare 100% tot timpul anului</h4>
                <div className="space-y-2 pl-4">
                  <p className="text-base flex items-start text-[#FFF9B0]">
                    <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span>
                    Ratele de ocupare pot atinge 100% pe tot parcursul anului
                  </p>
                  <p className="text-base flex items-start text-[#FFF9B0]">
                    <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span>
                    Zero camere goale înseamnă profit maxim
                  </p>
                  <p className="text-base flex items-start text-[#FFF9B0]">
                    <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span>
                    Ocupare completă chiar și în perioadele tradițional slabe
                  </p>
                  <p className="text-base flex items-start text-[#FFF9B0]">
                    <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span>
                    Flux constant de venituri fără minime sezoniere
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-[#FFF9B0]">1.2 - Costuri operaționale mai mici</h4>
                <div className="space-y-2 pl-4">
                  <p className="text-base flex items-start text-[#FFF9B0]">
                    <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span>
                    O singură zi lucrătoare pentru toate sosirile și plecările. Fără goluri între sejururi
                  </p>
                  <p className="text-base flex items-start text-[#FFF9B0]">
                    <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span>
                    Rată de rotație mai mică = costuri mai mici de curățenie
                  </p>
                  <p className="text-base flex items-start text-[#FFF9B0]">
                    <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span>
                    Sejururile extinse (8, 16, 24 și 32 de zile) reduc costurile operaționale
                  </p>
                  <p className="text-base flex items-start text-[#FFF9B0]">
                    <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span>
                    Proceduri simplificate de check-in/check-out economisesc timp personalului
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-[#FFF9B0]">1.3 - Stabilitate mai mare a personalului</h4>
                <div className="space-y-2 pl-4">
                  <p className="text-base flex items-start text-[#FFF9B0]">
                    <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span>
                    Ocupare constantă = locuri de muncă pe tot anul
                  </p>
                  <p className="text-base flex items-start text-[#FFF9B0]">
                    <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span>
                    Rotație mai mică = costuri mai mici cu recrutarea și formarea
                  </p>
                  <p className="text-base flex items-start text-[#FFF9B0]">
                    <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span>
                    Satisfacție mai mare a angajaților datorită programelor stabile
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-[#FFF9B0]">1.4 - Venituri suplimentare din activități tematice</h4>
                <div className="space-y-2 pl-4">
                  <p className="text-base flex items-start text-[#FFF9B0]">
                    <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span>
                    Surse noi de venit din evenimente specializate
                  </p>
                  <p className="text-base flex items-start text-[#FFF9B0]">
                    <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span>
                    Oportunități de merchandising legate de tematica hotelului
                  </p>
                  <p className="text-base flex items-start text-[#FFF9B0]">
                    <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span>
                    Serviciile extinse generează cheltuieli mai mari din partea oaspeților
                  </p>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="compare" className="overflow-hidden border-none shadow-xl">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#730483] to-[#570366] rounded-t-xl border-l-6 border-[#FFF9B0] hover:from-[#8A0499] hover:to-[#660377] transition-all duration-300">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              2 - COMPARAȚI SISTEMELE
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#560365]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#FFF9B0]/50">
            <div className="grid md:grid-cols-2 gap-6 text-left py-6">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-red-300">MODELUL TRADIȚIONAL</h4>
                <div className="space-y-2">
                  <p className="text-base text-[#FFF9B0]">• Sosiri/plecări constante</p>
                  <p className="text-base text-[#FFF9B0]">• Mai multă curățenie, spălătorie, rotație</p>
                  <p className="text-base text-[#FFF9B0]">• Încărcare mai mare la recepție</p>
                  <p className="text-base text-[#FFF9B0]">• Ocupare imprevizibilă</p>
                  <p className="text-base text-[#FFF9B0]">• Goluri între rezervări = nopți goale = profit pierdut</p>
                  <p className="text-base text-[#FFF9B0]">• Sezoane înalte și joase. Personalul vine și pleacă</p>
                  <p className="text-base text-[#FFF9B0]">• Personal demotivat, greu de instruit, neprofesionist</p>
                  <p className="text-base text-[#FFF9B0]">• Oaspeții vin și pleacă. Fără legături, fără loialitate</p>
                  <p className="text-base text-[#FFF9B0]">• Rezervări reci, izolate. Una după alta</p>
                  <p className="text-base text-[#FFF9B0]">• Apartamentele de închiriat câștigă cu prețuri mai mici</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-green-300">MODEL HOTEL LIVING</h4>
                <div className="space-y-2">
                  <p className="text-base text-[#FFF9B0]">• Zile fixe de sosire/plecare = operațiuni mai fluide</p>
                  <p className="text-base text-[#FFF9B0]">• Mai puține curățenii, mai puține tranziții</p>
                  <p className="text-base text-[#FFF9B0]">• Recepție mai eficientă și optimizată</p>
                  <p className="text-base text-[#FFF9B0]">• Sejururi mai lungi = ocupare mai mare</p>
                  <p className="text-base text-[#FFF9B0]">• Zero nopți goale = profit maxim</p>
                  <p className="text-base text-[#FFF9B0]">• Sezon înalt tot anul. Personal stabil</p>
                  <p className="text-base text-[#FFF9B0]">• Personal motivat, instruit, profesionist</p>
                  <p className="text-base text-[#FFF9B0]">• Oaspeții se simt ca acasă și revin</p>
                  <p className="text-base text-[#FFF9B0]">• Nu doar rezervări: comunități</p>
                  <p className="text-base text-[#FFF9B0]">• Eleganță. Umanitate. Servicii. Hotelurile câștigă</p>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="dont-just-fill" className="overflow-hidden border-none shadow-xl">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#730483] to-[#570366] rounded-t-xl border-l-6 border-[#FFF9B0] hover:from-[#8A0499] hover:to-[#660377] transition-all duration-300">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              3 - NU DOAR UMPLĂM CAMERE
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#560365]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#FFF9B0]/50">
            <div className="space-y-6 text-left py-6">
              <p className="text-base flex items-start text-[#FFF9B0]">
                <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span>
                Oaspeți grupați pe afinități
              </p>
              <p className="text-base flex items-start text-[#FFF9B0]">
                <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span>
                Zero întâmplare. 100% conexiuni
              </p>
              <p className="text-base flex items-start text-[#FFF9B0]">
                <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span>
                Hoteluri pentru apartenență, nu doar cazare
              </p>
              <p className="text-base flex items-start text-[#FFF9B0]">
                <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span>
                Transformăm societatea
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="profit-lost" className="overflow-hidden border-none shadow-xl">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#730483] to-[#570366] rounded-t-xl border-l-6 border-[#FFF9B0] hover:from-[#8A0499] hover:to-[#660377] transition-all duration-300">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              4 - CÂT PROFIT SE PIERDE?
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#560365]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#FFF9B0]/50">
            <div className="space-y-6 text-left py-6">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-[#FFF9B0]">4.1 HOTELURI OCCIDENTALE - CÂT PIERDEM ANUAL?</h4>
                <div className="space-y-2 pl-4">
                  <p className="text-base text-[#FFF9B0]">90 miliarde dolari anual conform celor mai conservatoare estimări</p>
                  <p className="text-base text-[#FFF9B0]">Nu este „cifră de afaceri", ci profit pur înainte de impozitare</p>
                  <p className="text-base text-[#FFF9B0]">Rata reală medie de ocupare: 50%</p>
                  <p className="text-base text-[#FFF9B0]">Aceasta acoperă costuri și aduce venituri minime</p>
                  <p className="text-base text-[#FFF9B0]">Dar înseamnă și pierderea profitului pur al celuilalt 50%</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-[#FFF9B0]">4.2 CÂT PIERDE HOTELUL DVS?</h4>
                <div className="space-y-2 pl-4">
                  <p className="text-base text-[#FFF9B0]">5 camere goale pe zi = 55.000 USD pierdere anual</p>
                  <p className="text-base text-[#FFF9B0]">20 camere goale pe zi = 220.000 USD profit pur pierdut</p>
                  <p className="text-base text-[#FFF9B0]">Un hotel de 200 camere închis din octombrie până în mai = peste 1 milion USD pierdere + 420.000 USD costuri</p>
                  <p className="text-base text-[#FFF9B0]">Un hotel de 500 camere? Peste 3 milioane USD profit pierdut</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-[#FFF9B0]">4.3 MAJORITATEA HOTELURILOR PIERD ADEVĂRATUL POTENȚIAL</h4>
                <div className="space-y-2 pl-4">
                  <p className="text-base text-[#FFF9B0]">Camerele goale sunt aurul nostru neexploatat</p>
                  <p className="text-base text-[#FFF9B0]">Puțini ating 100% ocupare tot anul</p>
                  <p className="text-base text-[#FFF9B0]">Indiferent de stele: pierdem bani</p>
                  <p className="text-base text-[#FFF9B0]">Camerele de profit pur nu se vând</p>
                  <p className="text-base text-[#FFF9B0]">Renunțăm la locul nostru legitim în societate</p>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="affinity-hotels" className="overflow-hidden border-none shadow-xl">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#730483] to-[#570366] rounded-t-xl border-l-6 border-[#FFF9B0] hover:from-[#8A0499] hover:to-[#660377] transition-all duration-300">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              5 - CE SUNT HOTELURILE PE AFINITĂȚI?
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#560365]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#FFF9B0]/50">
            <div className="space-y-6 text-left py-6">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-[#FFF9B0]">Exemplu 1</h4>
                <div className="space-y-2 pl-4">
                  <p className="text-base text-[#FFF9B0]">Imaginează-ți un hotel axat pe tango, teatru sau sport — ciclism, golf, tenis etc.</p>
                  <p className="text-base text-[#FFF9B0]">Oaspeții pasionați rezervă împreună</p>
                  <p className="text-base text-[#FFF9B0]">Se formează o comunitate pe interese comune</p>
                  <p className="text-base text-[#FFF9B0]">Fără goluri între sejururi. Fără pierderi</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-[#FFF9B0]">Exemplu 2</h4>
                <div className="space-y-2 pl-4">
                  <p className="text-base text-[#FFF9B0]">Hotel tematic culinar</p>
                  <p className="text-base text-[#FFF9B0]">Bucătari, cursuri de gătit, degustări de vin</p>
                  <p className="text-base text-[#FFF9B0]">Tarife premium pentru experiențe specializate</p>
                  <p className="text-base text-[#FFF9B0]">Ocupare completă cu sejururi mai lungi</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-[#FFF9B0]">Exemplu 3</h4>
                <div className="space-y-2 pl-4">
                  <p className="text-base text-[#FFF9B0]">Hoteluri de imersiune lingvistică</p>
                  <p className="text-base text-[#FFF9B0]">Oaspeți cu același nivel lingvistic grupați</p>
                  <p className="text-base text-[#FFF9B0]">Personalul vorbește limba țintă</p>
                  <p className="text-base text-[#FFF9B0]">Experiență lingvistică completă</p>
                </div>
              </div>

              <p className="text-base text-[#FFF9B0] font-semibold mt-6">
                Aceste hoteluri creează comunități puternice și venituri stabile și previzibile.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="technology" className="overflow-hidden border-none shadow-xl">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#730483] to-[#570366] rounded-t-xl border-l-6 border-[#FFF9B0] hover:from-[#8A0499] hover:to-[#660377] transition-all duration-300">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              6 - TEHNOLOGIA NOASTRĂ FACE CE ALTELE NU POT
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#560365]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#FFF9B0]/50">
            <div className="space-y-6 text-left py-6">
              <p className="text-base flex items-start text-[#FFF9B0]">
                <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span>
                Conectează persoane cu interese comune
              </p>
              <p className="text-base flex items-start text-[#FFF9B0]">
                <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span>
                Coordonează sosiri și plecări fără goluri
              </p>
              <p className="text-base flex items-start text-[#FFF9B0]">
                <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span>
                Optimizează sejururi pentru profit maxim
              </p>
              <p className="text-base flex items-start text-[#FFF9B0]">
                <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span>
                O platformă. Multiple surse de venit
              </p>
              <p className="text-base flex items-start text-[#FFF9B0]">
                <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span>
                Segmentare precisă pe interese și afinitate
              </p>
              <p className="text-base flex items-start text-[#FFF9B0]">
                <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span>
                Marketing către comunități motivate, nu călători ocazionali
              </p>
              <p className="text-base flex items-start text-[#FFF9B0]">
                <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span>
                Acoperire globală cu targetare hiper-specifică
              </p>
              <p className="text-base flex items-start text-[#FFF9B0]">
                <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span>
                Rate mai mari de conversie. Costuri mai mici de achiziție
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="social-networks" className="overflow-hidden border-none shadow-xl">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#730483] to-[#570366] rounded-t-xl border-l-6 border-[#FFF9B0] hover:from-[#8A0499] hover:to-[#660377] transition-all duration-300">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              7 - HOTELURI PE AFINITĂȚI = REȚELE SOCIALE PERFECTE
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#560365]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#FFF9B0]/50">
            <div className="space-y-6 text-left py-6">
              <p className="text-base flex items-start text-[#FFF9B0]">
                <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span>
                Interesele comune creează conexiuni instantanee
              </p>
              <p className="text-base flex items-start text-[#FFF9B0]">
                <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span>
                Psihologia de grup prelungește sejururile și aduce reveniri
              </p>
              <p className="text-base flex items-start text-[#FFF9B0]">
                <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span>
                Activitățile tematice sporesc loialitatea
              </p>
              <p className="text-base flex items-start text-[#FFF9B0]">
                <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span>
                Apartenența devine adictivă
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="they-need-hotel" className="overflow-hidden border-none shadow-xl">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#730483] to-[#570366] rounded-t-xl border-l-6 border-[#FFF9B0] hover:from-[#8A0499] hover:to-[#660377] transition-all duration-300">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              8 - EI AU NEVOIE DE HOTELUL DVS.
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#560365]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#FFF9B0]/50">
            <div className="space-y-6 text-left py-6">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-[#FFF9B0]">PENTRU CĂ 40% DIN POPULAȚIA OCCIDENTALĂ:</h4>
                <div className="space-y-2 pl-4">
                  <p className="text-base text-[#FFF9B0]">• Trăiește singură sau în cuplu</p>
                  <p className="text-base text-[#FFF9B0]">•  Este pre-pensionată sau pensionată</p>
                  <p className="text-base text-[#FFF9B0]">• Lucrează online</p>
                  <p className="text-base text-[#FFF9B0]">• Este student departe de casă</p>
                  <p className="text-base text-[#FFF9B0]">• Locuiește prea departe de serviciu</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-[#FFF9B0]">ȘI MAJORITATEA DINTRE EI:</h4>
                <div className="space-y-2 pl-4">
                  <p className="text-base text-[#FFF9B0]">• Vor să scape de sarcinile casnice</p>
                  <p className="text-base text-[#FFF9B0]">• Se simt prea singuri</p>
                  <p className="text-base text-[#FFF9B0]">• Nu au legături de familie</p>
                  <p className="text-base text-[#FFF9B0]">• Vor să-și extindă viața socială</p>
                  <p className="text-base text-[#FFF9B0]">• Vor să cunoască persoane cu gusturi similare</p>
                  <p className="text-base text-[#FFF9B0]">• Au nevoie de siguranța completă a vieții la hotel</p>
                </div>
              </div>

              <div className="space-y-4 mt-8">
                <h4 className="text-lg font-semibold text-[#FFF9B0]">VISUL UMANITĂȚII ESTE SĂ TRĂIASCĂ ÎNTR-UN HOTEL</h4>
                <p className="text-base text-[#FFF9B0] pl-4">Cu totul rezolvat</p>
                <p className="text-base text-[#FFF9B0] pl-4">Într-o vacanță fără sfârșit</p>
              </div>

              <div className="space-y-4 mt-8">
                <p className="text-base text-[#FFF9B0] font-semibold">De ce avem 50% camere goale anual?</p>
                <div className="space-y-2 pl-4">
                  <p className="text-base text-[#FFF9B0]">Oamenii vor să socializeze. Să-și facă prieteni</p>
                  <p className="text-base text-[#FFF9B0]">Vor să stea mai mult în hotelul dvs</p>
                  <p className="text-base text-[#FFF9B0]">Vor să le preluați sarcinile casnice</p>
                  <p className="text-base text-[#FFF9B0]">Au nevoie urgentă de camerele goale și serviciile dvs</p>
                  <p className="text-base text-[#FFF9B0] font-semibold">Ajutați-i: oferiți-le ambele</p>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="social-revolution" className="overflow-hidden border-none shadow-xl">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#730483] to-[#570366] rounded-t-xl border-l-6 border-[#FFF9B0] hover:from-[#8A0499] hover:to-[#660377] transition-all duration-300">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              9 - AFINITĂȚILE SUNT NOUA REVOLUȚIE SOCIALĂ
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#560365]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#FFF9B0]/50">
            <div className="space-y-6 text-left py-6">
              <p className="text-base flex items-start text-[#FFF9B0]">
                <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span>
                Oaspeții nu vor doar camere: vor sens
              </p>
              <p className="text-base flex items-start text-[#FFF9B0]">
                <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span>
                Interesele unesc mai repede decât reducerile
              </p>
              <p className="text-base flex items-start text-[#FFF9B0]">
                <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span>
                Sejururile tematice aduc loialitate
              </p>
              <p className="text-base flex items-start text-[#FFF9B0]">
                <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span>
                Necunoscuții devin comunități
              </p>
              <p className="text-base flex items-start text-[#FFF9B0]">
                <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span>
                Nu doar umpleți camere: creați apartenență
              </p>
              <p className="text-base flex items-start text-[#FFF9B0]">
                <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span>
                Atragerea oaspeților potriviți, nu a oricui
              </p>
              <p className="text-base flex items-start text-[#FFF9B0]">
                <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span>
                Afinitatea dvs. e magnetul dvs.
              </p>
              <p className="text-base flex items-start text-[#FFF9B0]">
                <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span>
                Hotelurile cu suflet câștigă viitorul
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="perfect-integration" className="overflow-hidden border-none shadow-xl">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#730483] to-[#570366] rounded-t-xl border-l-6 border-[#FFF9B0] hover:from-[#8A0499] hover:to-[#660377] transition-all duration-300">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              10 - SUNTEM INTEGRARE PERFECTĂ
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#560365]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#FFF9B0]/50">
            <div className="space-y-6 text-left py-6">
              <p className="text-base flex items-start text-[#FFF9B0]">
                <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span>
                Nu trebuie să alegeți între sisteme
              </p>
              <p className="text-base flex items-start text-[#FFF9B0]">
                <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span>
                Combinați modelele cum doriți
              </p>
              <p className="text-base flex items-start text-[#FFF9B0]">
                <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span>
                Începeți cu câteva camere și extindeți
              </p>
              <p className="text-base flex items-start text-[#FFF9B0]">
                <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span>
                Treceți mai multe camere la sistemul nostru când are sens
              </p>
              <p className="text-base flex items-start text-[#FFF9B0]">
                <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span>
                Platforma noastră se integrează perfect
              </p>
              <p className="text-base flex items-start text-[#FFF9B0]">
                <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span>
                Zero întreruperi în operațiunile zilnice
              </p>
              <p className="text-base flex items-start text-[#FFF9B0]">
                <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span>
                Ne adaptăm la dvs, nu invers
              </p>
              
              <div className="space-y-2 mt-8">
                <p className="text-base text-[#FFF9B0] font-semibold">Asta e flexibilitate. Asta e profitabilitate.</p>
                <p className="text-base text-[#FFF9B0] font-semibold">Asta e integrare perfectă</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="steps-to-join" className="overflow-hidden border-none shadow-xl">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#730483] to-[#570366] rounded-t-xl border-l-6 border-[#FFF9B0] hover:from-[#8A0499] hover:to-[#660377] transition-all duration-300">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              11 - PAȘII PENTRU A VĂ ALĂTURA HOTEL-LIVING
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#560365]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#FFF9B0]/50">
            <div className="space-y-8 text-left py-6">
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-[#FFF9B0]">IDENTIFICAȚI CAMERELE DISPONIBILE</h4>
                <p className="text-base text-[#FFF9B0] pl-4">
                  Evaluați câte camere ale hotelului dvs. sunt goale pentru cel puțin 8 zile consecutive (7 nopți) în anumite perioade ale anului.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-[#FFF9B0]">DEFINIȚI UN CONCEPT PE AFINITATE</h4>
                <p className="text-base text-[#FFF9B0] pl-4">
                  Gândiți-vă la o „afinitate" care ar putea atrage tipul ideal de oaspete, bazat pe locația hotelului, clientela obișnuită sau propriile preferințe.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-[#FFF9B0]">ÎNREGISTRAȚI-VĂ ȘI FOLOSIȚI CALCULATORUL ONLINE</h4>
                <p className="text-base text-[#FFF9B0] pl-4">
                  Odată înregistrat, veți avea acces la calculatorul nostru Hotel Living pentru a testa modele de sejur (8, 16, 24 sau 32 nopți).
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-[#FFF9B0]">ADĂUGAȚI HOTELUL ÎN PANOU</h4>
                <p className="text-base text-[#FFF9B0] pl-4">
                  Completați pașii pentru „Adăugare proprietate nouă" și gestionați disponibilitatea și rezervările pe termen lung.
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="calculator" className="overflow-hidden border-none shadow-xl">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#730483] to-[#570366] rounded-t-xl border-l-6 border-[#FFF9B0] hover:from-[#8A0499] hover:to-[#660377] transition-all duration-300">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              12 - {t('calculator.title')}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#560365]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#FFF9B0]/50">
            <div className="space-y-6 text-left py-6">
              <div className="space-y-4 text-[#FFF9B0] text-base whitespace-pre-line">
                {t('calculator.text')}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-3">
                  <h4 className="text-[#FFF9B0] font-bold text-lg">Versiunea în Engleză</h4>
                  <img src="/lovable-uploads/a434a2cc-c665-4c9b-828a-d5945a335947.png" alt="Calculator Hotel-Living Versiunea Engleză" className="w-full h-auto rounded-lg border border-[#FFF9B0]/30 shadow-lg" />
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-[#FFF9B0] font-bold text-lg">Versiunea în Spaniolă</h4>
                  <img src="/lovable-uploads/132f46c4-4760-4907-bb8a-30ea52da9991.png" alt="Calculator Hotel-Living Versiunea Spaniolă" className="w-full h-auto rounded-lg border border-[#FFF9B0]/30 shadow-lg" />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>;
}