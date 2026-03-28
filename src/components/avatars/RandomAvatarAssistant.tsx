import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { EnhancedAvatarAssistant } from "./EnhancedAvatarAssistant";
import { useAvatarManager } from "@/contexts/AvatarManager";
import { useTranslation } from "@/hooks/useTranslation";

const avatarPool = [
  {
    id: "maria",
    gif: "https://pgdzrvdwgoomjnnegkcn.supabase.co/storage/v1/object/public/avatar-gifs/1_Soy_Antonio_Jubilado.gif.gif"
  },
  {
    id: "antonio", 
    gif: "https://pgdzrvdwgoomjnnegkcn.supabase.co/storage/v1/object/public/avatar-gifs/1_Soy_Antonio_Jubilado.gif.gif"
  },
  {
    id: "john",
    gif: "https://pgdzrvdwgoomjnnegkcn.supabase.co/storage/v1/object/public/avatar-gifs/3_Y_yo_soy_John_trabajo_online.gif.gif"
  },
  {
    id: "ion",
    gif: "https://pgdzrvdwgoomjnnegkcn.supabase.co/storage/v1/object/public/avatar-gifs/6_Y_yo_soy_Ion_vivia_de_alquiler.gif.gif"
  },
  {
    id: "auxi",
    gif: "https://pgdzrvdwgoomjnnegkcn.supabase.co/storage/v1/object/public/avatar-gifs/4_Y_yo_soy_Auxi_amo_viajar.gif.gif"
  },
  {
    id: "juan",
    gif: "https://pgdzrvdwgoomjnnegkcn.supabase.co/storage/v1/object/public/avatar-gifs/5_Y_yo_soy_Juan_ya_no_alquilo_apartamentos_turisticos.gif.gif"
  },
  {
    id: "maria-trabajadora",
    gif: "https://pgdzrvdwgoomjnnegkcn.supabase.co/storage/v1/object/public/avatar-gifs/7_Y_yo_soy_Maria_vivia_afuera_de_la_ciudad.gif.gif"
  }
];

export function RandomAvatarAssistant() {
  const [currentRandomAvatar, setCurrentRandomAvatar] = useState<{ id: string; gif: string } | null>(null);
  const [showRandomAvatar, setShowRandomAvatar] = useState(false);
  const { activeAvatars } = useAvatarManager();
  const { t } = useTranslation('faq');
  const location = useLocation();

  // Check if avatars are allowed on current page
  const shouldShowAvatars = () => {
    const allowedPaths = [
      '/clientes'
    ];
    
    // Check if on dashboard/admin routes (always exclude)
    const isDashboard = location.pathname.includes('/dashboard') || 
                       location.pathname.includes('/panel') ||
                       location.pathname.includes('/admin') ||
                       location.pathname.includes('/login') ||
                       location.pathname.includes('/register') ||
                       location.pathname.includes('/signup') ||
                       location.pathname.includes('/auth');
    
    // Check if avatars have been dismissed this session
    const avatarsDismissed = sessionStorage.getItem('avatars_disabled') === 'true';
    
    return allowedPaths.includes(location.pathname) && !isDashboard && !avatarsDismissed;
  };

  const getMessage = () => {
    // Use translation system instead of browser language detection
    return t('avatarMessage', 'Aquí estoy.\nSi me necesitas,\npregunta lo que quieras.');
  };

  const showRandomAvatarPopup = useCallback(() => {
    // Don't show if not on allowed page or if avatars disabled
    if (!shouldShowAvatars()) return;
    
    // Don't show if there's already an active avatar
    if (activeAvatars.length > 0) return;
    
    const randomIndex = Math.floor(Math.random() * avatarPool.length);
    const randomAvatar = avatarPool[randomIndex];
    
    setCurrentRandomAvatar(randomAvatar);
    setShowRandomAvatar(true);
    
    // Auto-dismiss after 10 seconds
    setTimeout(() => {
      setShowRandomAvatar(false);
      setCurrentRandomAvatar(null);
    }, 10000);
  }, [activeAvatars, shouldShowAvatars, location.pathname]);

  useEffect(() => {
    // Only start interval if on allowed pages
    if (!shouldShowAvatars()) return;
    
    // Start the 50-second interval for random avatar popup  
    const interval = setInterval(() => {
      showRandomAvatarPopup();
    }, 50000);

    return () => clearInterval(interval);
  }, [showRandomAvatarPopup, location.pathname]);

  const handleRandomAvatarClose = () => {
    setShowRandomAvatar(false);
    setCurrentRandomAvatar(null);
    // Disable avatars for this session when user closes one
    sessionStorage.setItem('avatars_disabled', 'true');
  };

  // Don't show random avatar if not on allowed page, there's an active avatar, or component state is not ready
  if (!shouldShowAvatars() || activeAvatars.length > 0 || !showRandomAvatar || !currentRandomAvatar) {
    return null;
  }

  return (
    <EnhancedAvatarAssistant
      avatarId={currentRandomAvatar.id as import("@/constants/avatarVoices").AvatarId}
      gif={currentRandomAvatar.gif}
      position="bottom-left"
      showMessage={true}
      message={getMessage()}
      onClose={handleRandomAvatarClose}
    />
  );
}