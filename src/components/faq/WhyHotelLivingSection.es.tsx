
import React, { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslation } from "@/hooks/useTranslation";
import { AccordionContentRenderer } from "./accordion/AccordionContentRenderer";
import { EnhancedAvatarAssistant } from "../avatars/EnhancedAvatarAssistant";
import { useAvatarManager } from "@/contexts/AvatarManager";

export function WhyHotelLivingSectionES() {
  const [activeAccordionTab, setActiveAccordionTab] = useState("");
  const [activeTabAvatar, setActiveTabAvatar] = useState<string | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  const isMobile = useIsMobile();
  const { t } = useTranslation('faq');
  const { activeAvatars } = useAvatarManager();

  // Avatar mapping according to specifications
  const avatarMapping: Record<string, { id: string; gif: string }[]> = {
    "still-renting": [
      {
        id: "ion",
        gif: "https://pgdzrvdwgoomjnnegkcn.supabase.co/storage/v1/object/public/avatar-gifs/6_Y_yo_soy_Ion_vivia_de_alquiler.gif.gif"
      }
    ],
    "retired": [
      {
        id: "antonio",
        gif: "https://pgdzrvdwgoomjnnegkcn.supabase.co/storage/v1/object/public/avatar-gifs/1_Soy_Antonio_Jubilado.gif.gif"
      },
      {
        id: "luisa",
        gif: "https://pgdzrvdwgoomjnnegkcn.supabase.co/storage/v1/object/public/avatar-gifs/2_Y_yo_soy_Luisa_jubilada.gif.gif"
      }
    ],
    "airbnb": [
      {
        id: "juan",
        gif: "https://pgdzrvdwgoomjnnegkcn.supabase.co/storage/v1/object/public/avatar-gifs/5_Y_yo_soy_Juan_ya_no_alquilo_apartamentos_turisticos.gif.gif"
      }
    ],
    "online-worker": [
      {
        id: "john",
        gif: "https://pgdzrvdwgoomjnnegkcn.supabase.co/storage/v1/object/public/avatar-gifs/3_Y_yo_soy_John_trabajo_online.gif.gif"
      }
    ],
    "commuter": [
      {
        id: "maria",
        gif: "https://pgdzrvdwgoomjnnegkcn.supabase.co/storage/v1/object/public/avatar-gifs/7_Y_yo_soy_Maria_vivia_afuera_de_la_ciudad.gif.gif"
      }
    ],
    "free-soul": [
      {
        id: "auxi",
        gif: "https://pgdzrvdwgoomjnnegkcn.supabase.co/storage/v1/object/public/avatar-gifs/4_Y_yo_soy_Auxi_amo_viajar.gif.gif"
      }
    ],
    "hotel": [
      {
        id: "martin",
        gif: "https://pgdzrvdwgoomjnnegkcn.supabase.co/storage/v1/object/public/avatar-gifs/8_Y_yo_soy_Martin_tengo_un_hotel.gif.gif"
      }
    ]
    // "society" has no avatar as per specification
  };

  const accordionOptions = [
    { id: "still-renting", label: "¿AÚN\nALQUILAS?" },
    { id: "retired", label: "¿JUBILADO?" },
    { id: "airbnb", label: "¿APARTAMENTO\nTURÍSTICO?" },
    { id: "online-worker", label: "¿TRABAJADOR\nONLINE?" },
    { id: "commuter", label: "¿VIAJERO\nDIARIO?" },
    { id: "free-soul", label: "¿GRAN\nVIAJERO?" },
    { id: "hotel", label: "¿HOTEL?" },
    { id: "society", label: "¿SOCIEDAD?" }
  ];

  const getDisplayAvatars = (value: string) => {
    const avatars = avatarMapping[value];
    if (!avatars || avatars.length === 0) return [];
    
    // For retired category, show only one random avatar per session
    if (value === "retired" && avatars.length > 1) {
      // Use a stable random selection based on session
      const sessionKey = `retired-avatar-${Date.now().toString().slice(-6)}`;
      let selectedIndex = parseInt(sessionStorage.getItem(sessionKey) || '0');
      if (isNaN(selectedIndex) || selectedIndex >= avatars.length) {
        selectedIndex = Math.floor(Math.random() * avatars.length);
        sessionStorage.setItem(sessionKey, selectedIndex.toString());
      }
      return [avatars[selectedIndex]];
    }
    
    return avatars;
  };

  const handleAccordionTabChange = (value: string) => {
    if (value === activeAccordionTab) {
      setActiveAccordionTab("");
    } else {
      setActiveAccordionTab(value);
    }
  };

  const handleAvatarClose = () => {
    setActiveTabAvatar(null);
    setShowMessage(false);
  };

  const getAvatarMessage = (avatarId: string) => {
    const messages: Record<string, string> = {
      "antonio": "¡Hola, soy Antonio!\nJubilado\nSi quieres, podemos hablar",
      "luisa": "¡Hola, soy Luisa!\nJubilada\nSi quieres, podemos hablar",
      "john": "¡Hola, soy John!\nTrabajo online\nSi quieres, podemos hablar",
      "auxi": "¡Hola!\n¡Soy Teresa!\nSi quieres, podemos hablar",
      "juan": "¡Hola, soy Juan!\n¡Adiós apartamentos turísticos!\nSi quieres, podemos hablar",
      "ion": "¡Hola, soy Ion!\nYa no vivo de alquiler\nSi quieres, podemos hablar",
      "maria": "¡Hola, soy María!\n¡Ya no vivo afuera de la ciudad!\nSi quieres, podemos hablar",
      "martin": "¡Hola, soy Martín!\nHotelero\nSi quieres, podemos hablar"
    };
    return messages[avatarId] || "¡Hola!\nSi quieres, podemos hablar";
  };

  return (
    <>
      {/* First Horizontal Accordion Menu */}
      <div className="mb-24">
        <div className="w-full">
          <div className="flex justify-center mb-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl blur-xl opacity-85 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_60px_rgba(0,200,255,0.8),0_0_120px_rgba(0,200,255,0.4),0_0_180px_rgba(0,200,255,0.2)]"></div>
              <div className={`relative grid ${isMobile ? 'faq-top-menu-mobile' : 'grid-cols-4'} gap-3 p-1 bg-[#8017B0] rounded-xl border border-fuchsia-500/30 backdrop-blur-md place-items-center ${isMobile ? 'w-full max-w-[300px] mx-auto' : ''}`}>
                {accordionOptions.map((option) => {
                  
                  return (
                    <div key={option.id} className="relative">
                      <button 
                        onClick={() => handleAccordionTabChange(option.id)}
                        className={`faq-button faq-button px-2 uppercase whitespace-pre text-white shadow-md hover:shadow-fuchsia-500/20 hover:scale-105 transition-all duration-200 border border-fuchsia-600/20 text-center rounded-lg font-medium flex flex-col items-center justify-center ${isMobile ? "text-[4.1px] px-1 py-1.5 leading-[1.1] font-bold tracking-wide" : "text-[8px] px-2 py-2"} ${activeAccordionTab === option.id ? "!bg-[#5F1183]" : "bg-[#8017B0]"}`}
                      >
                        <span className="mb-1 leading-tight">{option.label}</span>
                        <span className="text-xs">▼</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {activeAccordionTab && (
            <div className="mt-4">
              <div className="bg-[#8017B0]/10 p-6 rounded-lg border border-[#8017B0]/30">
                <AccordionContentRenderer optionId={activeAccordionTab} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
