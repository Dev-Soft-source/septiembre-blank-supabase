import { useTranslation } from "@/hooks/useTranslation";
export function HotelSlogansPT() {
  const {
    t
  } = useTranslation('hotels');
  return <>
      {/* Main slogans */}
      <div className="space-y-3 animate-fade-in px-8">
        {/* Blue glow wrapper for main title */}
        <div className="relative group w-fit mx-auto">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl blur-xl opacity-85 group-hover:opacity-100 transition-opacity duration-300"></div>
          <h1 className="relative text-3xl font-bold text-center text-white border-b border-yellow-300/40 pb-4 mx-auto shadow-sm whitespace-nowrap">
            <span className="px-[8px] text-center uppercase font-bold animate-pulse block" style={{
            color: '#FFD700',
            animation: 'gentle-gold 3s ease-in-out infinite'
          }}>
            <span dangerouslySetInnerHTML={{ __html: t('slogans.mainTitle') }} />
          </span>
          </h1>
        </div>
        
        {/* Blue glow wrapper for slogans block */}
        <div className="relative group mx-8">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl blur-xl opacity-85 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative space-y-2 bg-[#460F54]/40 backdrop-blur-sm border border-fuchsia-400/20 rounded-xl px-6 py-[13px] my-[17px]">
          <p className="text-xl text-center text-[#8017B0] font-bold animate-text-slow py-[11px] my-[17px] px-4">{t('slogans.slogan1')}</p>
          <p className="text-xl text-center text-[#8017B0] font-bold animate-text-slow py-[11px] my-[17px] px-4">{t('slogans.slogan2')}</p>
          <p className="text-xl text-center text-[#8017B0] font-bold animate-text-slow py-[12px] my-[16px] px-4 mb-20">{t('slogans.slogan3')}</p>
          
          <p className="text-xl text-center text-[#8017B0] font-bold animate-text-slow py-[12px] px-4">{t('slogans.slogan4')}</p>
          <p className="text-xl text-center text-[#8017B0] font-bold animate-text-slow py-[12px] my-[18px] px-4">{t('slogans.slogan5')}</p>
          <p className="text-center text-[#8017B0] font-bold animate-text-slow py-[12px] my-[17px] text-xl px-4 mb-20">{t('slogans.slogan6')}</p>
          
          <p className="text-xl text-center text-[#8017B0] font-bold animate-text-slow py-[12px] my-[18px] px-4">{t('slogans.slogan7')}</p>
          <p className="text-xl text-center text-[#8017B0] font-bold animate-text-slow py-[12px] my-[17px] px-4">{t('slogans.slogan8')}</p>
          <p className="text-xl text-center text-[#8017B0] font-bold animate-text-slow py-[12px] my-[18px] px-4 mb-20">{t('slogans.slogan9')}</p>
          
          <p className="text-xl text-center text-[#8017B0] font-bold animate-text-slow py-[12px] my-[17px] px-4">{t('slogans.slogan10')}</p>
          <p className="text-xl text-center text-[#8017B0] font-bold animate-text-slow py-[12px] my-[18px] px-4">{t('slogans.slogan11')}</p>
          <p className="text-xl text-center text-[#8017B0] font-bold animate-text-slow py-[12px] my-[17px] px-4 mb-20">{t('slogans.slogan12')}</p>
          
          <p className="text-xl text-center text-[#8017B0] font-bold animate-text-slow py-[12px] my-[18px] px-4">{t('slogans.slogan13')}</p>
          <p className="text-xl text-center text-[#8017B0] font-bold animate-text-slow py-[12px] my-[17px] px-4">{t('slogans.slogan14')}</p>
          <p className="text-xl text-center text-[#8017B0] font-bold animate-text-slow py-[12px] my-[18px] px-4 mb-20">{t('slogans.slogan15')}</p>
          
          <p className="text-xl text-center text-[#8017B0] font-bold animate-text-slow py-[12px] my-[17px] px-4">{t('slogans.slogan16')}</p>
          <p className="text-xl text-center text-[#8017B0] font-bold animate-text-slow py-[12px] my-[18px] px-4">{t('slogans.slogan17')}</p>
          <p className="text-xl text-center text-[#8017B0] font-bold animate-text-slow py-[12px] my-[17px] px-4 whitespace-pre-line mb-20">{t('slogans.slogan18')}</p>
          
          <p className="text-xl text-center text-[#8017B0] font-bold animate-text-slow py-[12px] my-[18px] px-4">{t('slogans.slogan19')}</p>
          <p className="text-xl text-center text-[#8017B0] font-bold animate-text-slow py-[12px] my-[17px] px-4">{t('slogans.slogan20')}</p>
          <p className="text-xl text-center text-[#8017B0] font-bold animate-text-slow py-[12px] my-[18px] px-4 whitespace-pre-line">{t('slogans.slogan21')}</p>
          </div>
        </div>
      </div>
    </>;
}