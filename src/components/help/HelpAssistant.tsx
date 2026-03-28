import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';

export function HelpAssistant() {
  const navigate = useNavigate();
  const { t, language } = useTranslation('home');

  const handleClick = () => {
    const helpRoute = language.startsWith('es') ? '/faq' : '/help';
    navigate(helpRoute);
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleClick}
        className="group cursor-pointer transition-transform hover:scale-105 duration-300 flex flex-col items-center"
        aria-label={t('helpAssistant.message')}
      >
        {/* Image */}
        <img
          src="/lovable-uploads/44fa6e36-177c-4ca2-aa87-fa818f7d26b7.png"
          alt="Help Assistant"
          className="w-32 h-32 object-cover rounded-lg shadow-lg mb-2"
        />
        
        {/* Text Below Image */}
        <div style={{ backgroundColor: '#581972' }} className="rounded-lg px-3 py-2">
          <div className="text-center text-white">
            <p className="text-sm font-semibold whitespace-pre-line">
              {t('helpAssistant.message')}
            </p>
          </div>
        </div>
        
        {/* Hover Effect */}
        <div className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </button>
    </div>
  );
}