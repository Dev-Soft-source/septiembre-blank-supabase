import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AvatarAssistant } from "./AvatarAssistant";

// Avatar mapping based on the specifications
const avatarMapping: Record<string, { id: string; gif: string }> = {
  "stillRenting": {
    id: "ion",
    gif: "https://pgdzrvdwgoomjnnegkcn.supabase.co/storage/v1/object/public/avatar-gifs/6_Y_yo_soy_Ion_vivia_de_alquiler.gif.gif"
  },
  "retired": {
    id: "antonio", // We'll show Antonio for retired section, can be both Antonio + Luisa
    gif: "https://pgdzrvdwgoomjnnegkcn.supabase.co/storage/v1/object/public/avatar-gifs/1_Soy_Antonio_Jubilado.gif.gif"
  },
  "hotel": {
    id: "martin",
    gif: "https://pgdzrvdwgoomjnnegkcn.supabase.co/storage/v1/object/public/avatar-gifs/8_Y_yo_soy_Martin_tengo_un_hotel.gif.gif"
  },
  "onlineWorker": {
    id: "john",
    gif: "https://pgdzrvdwgoomjnnegkcn.supabase.co/storage/v1/object/public/avatar-gifs/3_Y_yo_soy_John_trabajo_online.gif.gif"
  },
  "commuter": {
    id: "maria", 
    gif: "https://pgdzrvdwgoomjnnegkcn.supabase.co/storage/v1/object/public/avatar-gifs/7_Y_yo_soy_Maria_vivia_afuera_de_la_ciudad.gif.gif"
  },
  "freeSoul": {
    id: "auxi",
    gif: "https://pgdzrvdwgoomjnnegkcn.supabase.co/storage/v1/object/public/avatar-gifs/4_Y_yo_soy_Auxi_amo_viajar.gif.gif"
  }
  // Note: "society" section has no avatar as per specification
};

// Content for each accordion section
const getAccordionContent = (key: string) => {
  const content: Record<string, Record<string, string>> = {
    stillRenting: {
      es: "¿Sigues pagando alquiler? Hotel-Living te ofrece una alternativa más flexible y económica.",
      en: "Still paying rent? Hotel-Living offers you a more flexible and economical alternative.",
      pt: "Ainda pagando aluguel? Hotel-Living oferece uma alternativa mais flexível e econômica.",
      ro: "Încă plătești chirie? Hotel-Living îți oferă o alternativă mai flexibilă și economică."
    },
    retired: {
      es: "¿Eres jubilado? Descubre como Hotel-Living puede mejorar tu calidad de vida con servicios incluidos.",
      en: "Are you retired? Discover how Hotel-Living can improve your quality of life with included services.",
      pt: "Você é aposentado? Descubra como Hotel-Living pode melhorar sua qualidade de vida com serviços incluídos.",
      ro: "Ești pensionar? Descoperă cum Hotel-Living poate îmbunătăți calitatea vieții tale cu servicii incluse."
    },
    hotel: {
      es: "¿Tienes un hotel? Únete a nuestra red y maximiza tus ingresos con estancias de larga duración.",
      en: "Do you have a hotel? Join our network and maximize your income with long-term stays.",
      pt: "Você tem um hotel? Junte-se à nossa rede e maximize sua renda com estadias de longa duração.",
      ro: "Ai un hotel? Alătură-te rețelei noastre și maximizează veniturile cu șederi pe termen lung."
    },
    onlineWorker: {
      es: "¿Trabajas online? Hotel-Living te ofrece espacios perfectos para nómadas digitales.",
      en: "Do you work online? Hotel-Living offers you perfect spaces for digital nomads.",
      pt: "Você trabalha online? Hotel-Living oferece espaços perfeitos para nômades digitais.",
      ro: "Lucrezi online? Hotel-Living îți oferă spații perfecte pentru nomazi digitali."
    },
    commuter: {
      es: "¿Eres viajero diario? Vive más cerca de tu trabajo sin comprometerte a largo plazo.",
      en: "Are you a daily commuter? Live closer to your work without long-term commitments.",
      pt: "Você é um viajante diário? Viva mais perto do seu trabalho sem compromissos de longo prazo.",
      ro: "Ești navetist? Locuiește mai aproape de locul de muncă fără angajamente pe termen lung."
    },
    freeSoul: {
      es: "¿Eres un alma libre? Hotel-Living te da la libertad de vivir donde quieras, cuando quieras.",
      en: "Are you a free soul? Hotel-Living gives you the freedom to live where you want, when you want.",
      pt: "Você é uma alma livre? Hotel-Living te dá a liberdade de viver onde quiser, quando quiser.",
      ro: "Ești un suflet liber? Hotel-Living îți oferă libertatea de a trăi unde vrei, când vrei."
    },
    society: {
      es: "La sociedad está cambiando hacia modelos de vida más flexibles. Hotel-Living es parte de esta evolución.",
      en: "Society is changing towards more flexible living models. Hotel-Living is part of this evolution.",
      pt: "A sociedade está mudando para modelos de vida mais flexíveis. Hotel-Living faz parte desta evolução.",
      ro: "Societatea se schimbă către modele de viață mai flexibile. Hotel-Living face parte din această evoluție."
    }
  };

  return content[key] || {};
};

export function FAQAccordionWithAvatars() {
  const { t, language } = useTranslation();
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const [activeAvatar, setActiveAvatar] = useState<string | null>(null);

  const accordionItems = [
    { key: "stillRenting", titleKey: "faq.accordion.stillRenting" },
    { key: "retired", titleKey: "faq.accordion.retired" },
    { key: "hotel", titleKey: "faq.accordion.hotel" }, 
    { key: "commuter", titleKey: "faq.accordion.commuter" },
    { key: "onlineWorker", titleKey: "faq.accordion.onlineWorker" },
    { key: "freeSoul", titleKey: "faq.accordion.freeSoul" },
    { key: "society", titleKey: "faq.accordion.society" }
  ];

  const handleAccordionChange = (value: string) => {
    setActiveAccordion(value);
    
    // Check if this section has an avatar
    const avatarData = avatarMapping[value];
    if (avatarData) {
      setActiveAvatar(value);
    } else {
      setActiveAvatar(null);
    }
  };

  const handleAvatarClose = () => {
    setActiveAvatar(null);
  };

  const getContent = (key: string) => {
    const content = getAccordionContent(key);
    return content[language] || content['es'] || 'Content not available';
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-[#eedbf7] mb-2">
          {language === 'es' ? '¿Con cuál te identificas?' : 
           language === 'en' ? 'Which one do you identify with?' :
           language === 'pt' ? 'Com qual você se identifica?' :
           language === 'ro' ? 'Cu care te identifici?' :
           '¿Con cuál te identificas?'}
        </h2>
        <p className="text-[#e3d6e9]">
          {language === 'es' ? 'Haz clic en tu situación para conocer más' :
           language === 'en' ? 'Click on your situation to learn more' :
           language === 'pt' ? 'Clique na sua situação para saber mais' :
           language === 'ro' ? 'Faceți clic pe situația dvs. pentru a afla mai multe' :
           'Haz clic en tu situación para conocer más'}
        </p>
      </div>

      <Accordion type="single" collapsible onValueChange={handleAccordionChange}>
        {accordionItems.map((item) => {
          const avatarData = avatarMapping[item.key];
          const isActive = activeAccordion === item.key;
          const showAvatar = activeAvatar === item.key && avatarData;

          return (
            <AccordionItem key={item.key} value={item.key} className="border-[#8017B0] mb-2">
              <AccordionTrigger className="text-[#eedbf7] hover:text-white text-left font-semibold relative">
                {/* Show avatar above the title when active */}
                {showAvatar && (
                  <AvatarAssistant
                    avatarId={avatarData.id as import("@/constants/avatarVoices").AvatarId}
                    gif={avatarData.gif}
                    isVisible={true}
                    onClose={handleAvatarClose}
                  />
                )}
                {t(item.titleKey)}
              </AccordionTrigger>
              <AccordionContent className="text-[#e3d6e9] pt-4">
                {getContent(item.key)}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}