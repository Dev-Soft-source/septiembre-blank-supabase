import { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";

interface AvatarData {
  id: string;
  gif: string;
  name: string;
  phrase: string;
}

const getAvatarsData = (language: string): AvatarData[] => {
  const translations = {
    en: [
      { id: "antonio", name: "Antonio", phrase: "I'm Antonio, Retired" },
      { id: "luisa", name: "Luisa", phrase: "And I'm Luisa, retired" },
      { id: "john", name: "John", phrase: "And I'm John, I work online" },
      { id: "auxi", name: "Auxi", phrase: "And I'm Auxi, I love traveling" },
      { id: "juan", name: "Juan", phrase: "And I'm Juan, I no longer\nrent tourist apartments" },
      { id: "ion", name: "Ion", phrase: "And I'm Ion, I used to rent" },
      { id: "maria", name: "María", phrase: "And I'm María, I lived\noutside the city" },
      { id: "martin", name: "Martin", phrase: "And I'm Martin, I have a hotel" }
    ],
    pt: [
      { id: "antonio", name: "Antonio", phrase: "Sou Antonio, Aposentado" },
      { id: "luisa", name: "Luisa", phrase: "E eu sou Luisa, aposentada" },
      { id: "john", name: "John", phrase: "E eu sou John, trabalho online" },
      { id: "auxi", name: "Auxi", phrase: "E eu sou Auxi, amo viajar" },
      { id: "juan", name: "Juan", phrase: "E eu sou Juan, não alugo mais\napartamentos turísticos" },
      { id: "ion", name: "Ion", phrase: "E eu sou Ion, vivia de aluguel" },
      { id: "maria", name: "María", phrase: "E eu sou María, vivia\nfora da cidade" },
      { id: "martin", name: "Martin", phrase: "E eu sou Martin, tenho um hotel" }
    ],
    ro: [
      { id: "antonio", name: "Antonio", phrase: "Sunt Antonio, Pensionar" },
      { id: "luisa", name: "Luisa", phrase: "Și eu sunt Luisa, pensionară" },
      { id: "john", name: "John", phrase: "Și eu sunt John, lucrez online" },
      { id: "auxi", name: "Auxi", phrase: "Și eu sunt Auxi, iubesc să călătoresc" },
      { id: "juan", name: "Juan", phrase: "Și eu sunt Juan, nu mai închiriez\napartamente turistice" },
      { id: "ion", name: "Ion", phrase: "Și eu sunt Ion, locuiam\nîn chirie" },
      { id: "maria", name: "María", phrase: "Și eu sunt María, locuiam\nîn afara orașului" },
      { id: "martin", name: "Martin", phrase: "Și eu sunt Martin, am un hotel" }
    ],
    es: [
      { id: "antonio", name: "Antonio", phrase: "Soy Antonio, Jubilado" },
      { id: "luisa", name: "Luisa", phrase: "Y yo soy Luisa, jubilada" },
      { id: "john", name: "John", phrase: "Y yo soy John, trabajo online" },
      { id: "auxi", name: "Auxi", phrase: "Y yo soy Auxi, amo viajar" },
      { id: "juan", name: "Juan", phrase: "Y yo soy Juan, ya no alquilo\napartamentos turísticos" },
      { id: "ion", name: "Ion", phrase: "Y yo soy Ion, vivía de alquiler" },
      { id: "maria", name: "María", phrase: "Y yo soy María, vivía\nafuera de la ciudad" },
      { id: "martin", name: "Martin", phrase: "Y yo soy Martin, tengo un hotel" }
    ]
  };

  const phrases = translations[language as keyof typeof translations] || translations.es;
  
  return [
    {
      id: "antonio",
      gif: "https://pgdzrvdwgoomjnnegkcn.supabase.co/storage/v1/object/public/avatar-gifs/1_Soy_Antonio_Jubilado.gif.gif",
      name: phrases[0].name,
      phrase: phrases[0].phrase
    },
    {
      id: "luisa", 
      gif: "https://pgdzrvdwgoomjnnegkcn.supabase.co/storage/v1/object/public/avatar-gifs/2_Y_yo_soy_Luisa_jubilada.gif.gif",
      name: phrases[1].name,
      phrase: phrases[1].phrase
    },
    {
      id: "john",
      gif: "https://pgdzrvdwgoomjnnegkcn.supabase.co/storage/v1/object/public/avatar-gifs/3_Y_yo_soy_John_trabajo_online.gif.gif", 
      name: phrases[2].name,
      phrase: phrases[2].phrase
    },
    {
      id: "auxi",
      gif: "https://pgdzrvdwgoomjnnegkcn.supabase.co/storage/v1/object/public/avatar-gifs/4_Y_yo_soy_Auxi_amo_viajar.gif.gif",
      name: phrases[3].name, 
      phrase: phrases[3].phrase
    },
    {
      id: "juan",
      gif: "https://pgdzrvdwgoomjnnegkcn.supabase.co/storage/v1/object/public/avatar-gifs/5_Y_yo_soy_Juan_ya_no_alquilo_apartamentos_turisticos.gif.gif",
      name: phrases[4].name,
      phrase: phrases[4].phrase
    },
    {
      id: "ion",
      gif: "https://pgdzrvdwgoomjnnegkcn.supabase.co/storage/v1/object/public/avatar-gifs/6_Y_yo_soy_Ion_vivia_de_alquiler.gif.gif",
      name: phrases[5].name,
      phrase: phrases[5].phrase
    },
    {
      id: "maria",
      gif: "https://pgdzrvdwgoomjnnegkcn.supabase.co/storage/v1/object/public/avatar-gifs/7_Y_yo_soy_Maria_vivia_afuera_de_la_ciudad.gif.gif",
      name: phrases[6].name,
      phrase: phrases[6].phrase
    },
    {
      id: "martin",
      gif: "https://pgdzrvdwgoomjnnegkcn.supabase.co/storage/v1/object/public/avatar-gifs/8_Y_yo_soy_Martin_tengo_un_hotel.gif.gif",
      name: phrases[7].name,
      phrase: phrases[7].phrase
    }
  ];
};

interface AvatarIntroProps {
  onUserInteraction: () => void;
}

export function AvatarIntro({ onUserInteraction }: AvatarIntroProps) {
  const { i18n } = useTranslation();
  const [visibleAvatars, setVisibleAvatars] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  const avatarsData = getAvatarsData(i18n.language);
  
  // Debug logging
  console.log("🎭 AvatarIntro render:", { visibleAvatars, currentIndex, isComplete, isPaused });

  useEffect(() => {
    const handleManualDismiss = () => {
      // Only allow dismissal after sequence is complete
      if (isComplete) {
        console.log("🎭 Manual dismissal after sequence completion");
        onUserInteraction();
      }
    };

    const handleClick = () => handleManualDismiss();
    const handleScroll = () => handleManualDismiss();

    window.addEventListener('click', handleClick);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [onUserInteraction, isComplete]);

  useEffect(() => {
    if (isPaused || isComplete || currentIndex >= avatarsData.length) {
      console.log("🎭 Avatar timer stopped:", { isPaused, isComplete, currentIndex, avatarsLength: avatarsData.length });
      return;
    }

    console.log("🎭 Setting avatar timer for index:", currentIndex);
    const timer = setTimeout(() => {
      console.log("🎭 Timer fired! Adding avatar at index:", currentIndex);
      setVisibleAvatars(prev => {
        const newVisible = [...prev, currentIndex];
        console.log("🎭 Updated visible avatars:", newVisible);
        return newVisible;
      });
      setCurrentIndex(prev => prev + 1);
      
      if (currentIndex + 1 >= avatarsData.length) {
        console.log("🎭 All avatars shown, auto-fading after 3 seconds");
        // All avatars shown, auto-fade after 3 seconds
        setTimeout(() => {
          console.log("🎭 Setting isComplete to true");
          setIsComplete(true);
        }, 3000);
      }
    }, currentIndex === 0 ? 5000 : 5000); // First avatar after 5s, then every 5s

    return () => clearTimeout(timer);
  }, [currentIndex, isPaused, isComplete]);

  if (isComplete) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Left column avatars */}
      <div className="fixed left-4 top-1/2 transform -translate-y-1/2 space-y-3">
        {avatarsData.slice(0, 4).map((avatar, index) => (
          visibleAvatars.includes(index) && (
            <div key={avatar.id} className="animate-fade-in">
              <div className="flex flex-col items-center">
                <img 
                  src={avatar.gif} 
                  alt={avatar.name}
                  className="w-24 h-24 rounded-full object-cover shadow-lg relative z-10"
                  onLoad={() => console.log("🎭 Avatar loaded successfully:", avatar.name, avatar.gif)}
                  onError={(e) => {
                    console.error("🎭 Avatar failed to load:", avatar.name, avatar.gif);
                    console.error("🎭 Error details:", e);
                    // Fallback to a simple colored circle with initials
                    e.currentTarget.style.display = "none";
                    const fallback = document.createElement("div");
                    fallback.className = "w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg relative z-10";
                    fallback.textContent = avatar.name.charAt(0);
                    e.currentTarget.parentNode?.appendChild(fallback);
                  }}
                />
                <div className="bg-white rounded-lg px-2 py-0.5 shadow-md text-xs font-medium text-gray-800 text-center max-w-xs relative z-20 -mt-6">
                  {avatar.phrase}
                </div>
              </div>
            </div>
          )
        ))}
      </div>

      {/* Right column avatars */}
      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 space-y-3">
        {avatarsData.slice(4).map((avatar, index) => (
          visibleAvatars.includes(index + 4) && (
            <div key={avatar.id} className="animate-fade-in">
              <div className="flex flex-col items-center">
                <img 
                  src={avatar.gif} 
                  alt={avatar.name}
                  className="w-24 h-24 rounded-full object-cover shadow-lg relative z-10"
                  onLoad={() => console.log("🎭 Avatar loaded successfully:", avatar.name, avatar.gif)}
                  onError={(e) => {
                    console.error("🎭 Avatar failed to load:", avatar.name, avatar.gif);
                    console.error("🎭 Error details:", e);
                    // Fallback to a simple colored circle with initials
                    e.currentTarget.style.display = "none";
                    const fallback = document.createElement("div");
                    fallback.className = "w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg relative z-10";
                    fallback.textContent = avatar.name.charAt(0);
                    e.currentTarget.parentNode?.appendChild(fallback);
                  }}
                />
                <div className="bg-white rounded-lg px-2 py-0.5 shadow-md text-xs font-medium text-gray-800 text-center max-w-xs relative z-20 -mt-6">
                  {avatar.phrase.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < avatar.phrase.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
}