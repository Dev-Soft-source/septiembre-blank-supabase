import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useTranslation } from '@/hooks/useTranslation';
import { Starfield } from '@/components/Starfield';
import { EnhancedAvatarAssistant } from '@/components/avatars/EnhancedAvatarAssistant';
import { VoiceInventoryTest } from '@/components/voice/VoiceInventoryTest';


export default function Ayuda() {
  const { t, i18n } = useTranslation('home');

  // Debug avatar greetings
  console.log('🎭 Ayuda component - Avatar greetings:', {
    antonio: t('helpAssistant.avatars.antonio.greeting'),
    hasNewlines: t('helpAssistant.avatars.antonio.greeting').includes('\n'),
    splitGreeting: t('helpAssistant.avatars.antonio.greeting').split('\n')
  });


  const avatarsData = [
    {
      id: "antonio",
      gif: "https://pgdzrvdwgoomjnnegkcn.supabase.co/storage/v1/object/public/avatar-gifs/1_Soy_Antonio_Jubilado.gif.gif",
      name: t('helpAssistant.avatars.antonio.name'),
      greeting: t('helpAssistant.avatars.antonio.greeting')
    },
    {
      id: "luisa", 
      gif: "https://pgdzrvdwgoomjnnegkcn.supabase.co/storage/v1/object/public/avatar-gifs/2_Y_yo_soy_Luisa_jubilada.gif.gif",
      name: t('helpAssistant.avatars.luisa.name'),
      greeting: t('helpAssistant.avatars.luisa.greeting')
    },
    {
      id: "john",
      gif: "https://pgdzrvdwgoomjnnegkcn.supabase.co/storage/v1/object/public/avatar-gifs/3_Y_yo_soy_John_trabajo_online.gif.gif", 
      name: t('helpAssistant.avatars.john.name'),
      greeting: t('helpAssistant.avatars.john.greeting')
    },
    {
      id: "teresa",
      gif: "https://pgdzrvdwgoomjnnegkcn.supabase.co/storage/v1/object/public/avatar-gifs/4_Y_yo_soy_Auxi_amo_viajar.gif.gif",
      name: t('helpAssistant.avatars.teresa.name'),
      greeting: t('helpAssistant.avatars.teresa.greeting')
    },
    {
      id: "juan",
      gif: "https://pgdzrvdwgoomjnnegkcn.supabase.co/storage/v1/object/public/avatar-gifs/5_Y_yo_soy_Juan_ya_no_alquilo_apartamentos_turisticos.gif.gif",
      name: t('helpAssistant.avatars.juan.name'),
      greeting: t('helpAssistant.avatars.juan.greeting')
    },
    {
      id: "ion",
      gif: "https://pgdzrvdwgoomjnnegkcn.supabase.co/storage/v1/object/public/avatar-gifs/6_Y_yo_soy_Ion_vivia_de_alquiler.gif.gif",
      name: t('helpAssistant.avatars.ion.name'),
      greeting: t('helpAssistant.avatars.ion.greeting')
    },
    {
      id: "maria",
      gif: "https://pgdzrvdwgoomjnnegkcn.supabase.co/storage/v1/object/public/avatar-gifs/7_Y_yo_soy_Maria_vivia_afuera_de_la_ciudad.gif.gif",
      name: t('helpAssistant.avatars.maria.name'),
      greeting: t('helpAssistant.avatars.maria.greeting')
    },
    {
      id: "martin",
      gif: "https://pgdzrvdwgoomjnnegkcn.supabase.co/storage/v1/object/public/avatar-gifs/8_Y_yo_soy_Martin_tengo_un_hotel.gif.gif",
      name: t('helpAssistant.avatars.martin.name'),
      greeting: t('helpAssistant.avatars.martin.greeting')
    }
  ];

  return (
    <div className="flex flex-col min-h-screen relative">
      <Starfield />
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-4 relative z-10">

        {/* Voice Testing Section */}
        <div className="max-w-6xl mx-auto mt-4 mb-8">
          <VoiceInventoryTest />
        </div>

        {/* Main Section - Avatar Group */}
        <div className="max-w-6xl mx-auto mt-4">
          {/* Single grid for all avatars - responsive layout */}
          <div className="grid grid-cols-4 md:grid-cols-4 max-md:grid-cols-1 gap-6 mb-12 help-avatars-grid">
            {avatarsData.map((avatar) => (
              <div key={avatar.id} className="flex flex-col items-center help-avatar-item">
                {/* Speech bubble above avatar */}
                <div className="relative mb-4 rounded-lg px-1 py-1 shadow-lg font-medium text-gray-800 text-center leading-tight border border-gray-200 help-avatar-bubble md:text-[8px] md:max-w-[100px] max-md:text-[24px] max-md:max-w-none" style={{ backgroundColor: '#FBF3B4' }}>
                  <div 
                    className="whitespace-pre-line help-avatar-greeting"
                    style={{ whiteSpace: 'pre-line !important' }}
                    dangerouslySetInnerHTML={{ 
                      __html: avatar.greeting.replace(/\n/g, '<br>') 
                    }}
                  />
                  {/* Bubble tail pointing down */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent" style={{ borderTopColor: '#FBF3B4' }}></div>
                </div>
                
                {/* Avatar using EnhancedAvatarAssistant for chat functionality */}
                <div className="help-avatar-wrapper">
                  <EnhancedAvatarAssistant 
                    avatarId={avatar.id as import("@/constants/avatarVoices").AvatarId}
                    gif={avatar.gif}
                    position="content"
                    showMessage={false}
                    size="help-page"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}