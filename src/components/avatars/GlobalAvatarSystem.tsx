import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { EnhancedAvatarAssistant } from "./EnhancedAvatarAssistant";
import { useAvatarManager } from "@/contexts/AvatarManager";
import { useTranslation } from "@/hooks/useTranslation";

// Complete avatar pool with correct IDs (messages now come from translations)
const avatarPool = [
  {
    id: "antonio",
    gif: "https://pgdzrvdwgoomjnnegkcn.supabase.co/storage/v1/object/public/avatar-gifs/1_Soy_Antonio_Jubilado.gif.gif"
  },
  {
    id: "luisa",
    gif: "https://pgdzrvdwgoomjnnegkcn.supabase.co/storage/v1/object/public/avatar-gifs/2_Y_yo_soy_Luisa_jubilada.gif.gif"
  },
  {
    id: "john",
    gif: "https://pgdzrvdwgoomjnnegkcn.supabase.co/storage/v1/object/public/avatar-gifs/3_Y_yo_soy_John_trabajo_online.gif.gif"
  },
  {
    id: "teresa",
    gif: "https://pgdzrvdwgoomjnnegkcn.supabase.co/storage/v1/object/public/avatar-gifs/4_Y_yo_soy_Auxi_amo_viajar.gif.gif"
  },
  {
    id: "juan",
    gif: "https://pgdzrvdwgoomjnnegkcn.supabase.co/storage/v1/object/public/avatar-gifs/5_Y_yo_soy_Juan_ya_no_alquilo_apartamentos_turisticos.gif.gif"
  },
  {
    id: "ion",
    gif: "https://pgdzrvdwgoomjnnegkcn.supabase.co/storage/v1/object/public/avatar-gifs/6_Y_yo_soy_Ion_vivia_de_alquiler.gif.gif"
  },
  {
    id: "maria",
    gif: "https://pgdzrvdwgoomjnnegkcn.supabase.co/storage/v1/object/public/avatar-gifs/7_Y_yo_soy_Maria_vivia_afuera_de_la_ciudad.gif.gif"
  },
  {
    id: "martin",
    gif: "https://pgdzrvdwgoomjnnegkcn.supabase.co/storage/v1/object/public/avatar-gifs/8_Y_yo_soy_Martin_tengo_un_hotel.gif.gif"
  }
];

export function GlobalAvatarSystem() {
  const location = useLocation();
  const { activeAvatars } = useAvatarManager();
  const { t } = useTranslation('faq');
  const [currentRandomAvatar, setCurrentRandomAvatar] = useState<typeof avatarPool[0] | null>(null);
  const [showRandomAvatar, setShowRandomAvatar] = useState(false);

  // Page detection - Pages where avatars should NOT appear (all except hotels and faq)
  const restrictedPaths = [
    '/',
    '/affinity-stays', '/afinidades',
    '/promotor-local', '/embajador',
    '/ambassador',
    '/help', '/faq',
    '/sobre-nosotros', '/about-us', '/sobre-nos', '/despre-noi',
    '/nuestro-equipo', '/our-team', '/nossa-equipe', '/echipa-noastra',
    '/videos',
    '/search', '/buscar', '/pesquisar', '/cautare',
    '/prensa', '/press', '/imprensa', '/presa',
    '/politica-de-privacidad', '/privacy-policy', '/politica-de-privacidade', '/politica-de-confidentialitate',
    '/terminos-y-condiciones', '/terms-and-conditions', '/termos-e-condicoes', '/termeni-si-conditii',
    '/nuestros-valores', '/our-values', '/nossos-valores', '/valorile-noastre',
    '/nuestros-servicios', '/our-services', '/nossos-servicos', '/serviciile-noastre',
    '/propiedad-intelectual', '/intellectual-property', '/propriedade-intelectual', '/proprietate-intelectuala',
    '/servicio-al-cliente', '/customer-service', '/atendimento-ao-cliente', '/serviciu-clienti',
    '/contacto', '/contact', '/contato', '/contact'
  ];
  
  // Check if current path is restricted or is ANY type of dashboard/panel
  const isDashboard = location.pathname.includes('/dashboard') || 
                      location.pathname.includes('/panel') || 
                      location.pathname.includes('/agentes') ||
                      location.pathname.includes('/admin') ||
                      location.pathname.includes('/hotel') ||
                      location.pathname.includes('/association') ||
                      location.pathname.includes('/promoter') ||
                      location.pathname.includes('/user') ||
                      location.pathname.includes('/profile');
  
  const isRestrictedPage = restrictedPaths.includes(location.pathname) || isDashboard;

  // Global auto-trigger system (60 seconds, only on allowed pages)
  useEffect(() => {
    // Don't run on restricted pages or dashboards
    if (isRestrictedPage) {
      return;
    }

    const showRandomAvatarPopup = () => {
      // Don't show if there's already an active avatar
      if (activeAvatars.length > 0) return;
      
      const randomIndex = Math.floor(Math.random() * avatarPool.length);
      const randomAvatar = avatarPool[randomIndex];
      
      // Check if this specific avatar was dismissed in this session
      const avatarDismissedKey = `dismissed_avatar_${randomAvatar.id}`;
      const isAvatarDismissed = sessionStorage.getItem(avatarDismissedKey) === 'true';
      
      // Don't show if this avatar was dismissed
      if (isAvatarDismissed) return;
      
      setCurrentRandomAvatar(randomAvatar);
      setShowRandomAvatar(true);
      
      // Auto-dismiss after 10 seconds
      setTimeout(() => {
        setShowRandomAvatar(false);
        setCurrentRandomAvatar(null);
      }, 10000);
    };

    // Start the 60-second interval for random avatar popup
    const interval = setInterval(showRandomAvatarPopup, 60000);
    
    // Also trigger immediately for testing (remove this in production)
    const initialTimeout = setTimeout(showRandomAvatarPopup, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimeout);
    };
  }, [location.pathname, activeAvatars, isRestrictedPage]);

  const handleRandomAvatarClose = () => {
    if (currentRandomAvatar) {
      // Store session flag to suppress this specific avatar for the session
      const avatarDismissedKey = `dismissed_avatar_${currentRandomAvatar.id}`;
      sessionStorage.setItem(avatarDismissedKey, 'true');
    }
    
    setShowRandomAvatar(false);
    setCurrentRandomAvatar(null);
  };

  const getAvatarMessage = (avatarId: string) => {
    return t(`avatars.${avatarId}.fullMessage`, `Si quieres, podemos hablar`);
  };

  // Don't show random avatar if there's an active avatar, on restricted pages, or if this specific avatar was dismissed
  if (isRestrictedPage || activeAvatars.length > 0 || !showRandomAvatar || !currentRandomAvatar) {
    return null;
  }
  
  // Additional check for dismissed status
  const avatarDismissedKey = `dismissed_avatar_${currentRandomAvatar.id}`;
  const isCurrentAvatarDismissed = sessionStorage.getItem(avatarDismissedKey) === 'true';
  if (isCurrentAvatarDismissed) {
    return null;
  }

  return (
    <EnhancedAvatarAssistant
      avatarId={currentRandomAvatar.id as import("@/constants/avatarVoices").AvatarId}
      gif={currentRandomAvatar.gif}
      position="bottom-right"
      showMessage={true}
      message={getAvatarMessage(currentRandomAvatar.id)}
      onClose={handleRandomAvatarClose}
    />
  );
}