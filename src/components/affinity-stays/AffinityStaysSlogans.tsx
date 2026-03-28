import { useTranslation } from "@/hooks/useTranslation";
import { useIsMobile } from "@/hooks/use-mobile";

export function AffinityStaysSlogans() {
  const {
    t
  } = useTranslation('affinity');
  const isMobile = useIsMobile();
  
  return <>
      {/* Main header and quote section */}
      <div className="space-y-4 mb-8">
        <div className="text-center mb-6">
          {/* Dynamic multilingual title using exact WHY HOTEL-LIVING styling */}
          <div className="flex justify-center mb-2 my-[19px] py-[23px]">
            <div className="relative group w-fit">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl blur-xl opacity-100 group-hover:opacity-100 transition-opacity duration-300" style={{
                boxShadow: '0 0 160px rgba(0,200,255,1), 0 0 320px rgba(0,200,255,0.8), 0 0 480px rgba(0,200,255,0.6)',
                filter: 'blur(24px)'
              }}></div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[#eedbf7] glow tracking-tight leading-tight bg-[#8017B0] py-2 px-8 rounded-lg inline-block relative whitespace-pre-line text-center">
                {t('affinity.affinityStaysTitle').toUpperCase()}
              </h1>
            </div>
          </div>
          
          {/* "Created by" text and Hotel-Living logo were already removed */}
        </div>
        
        {/* Quote section - mobile font size doubled */}
        <div className="max-w-2xl mx-auto text-center mb-8">
          <p className={`text-white italic font-semibold py-0 ${isMobile ? 'text-base' : 'text-lg'}`}>
            "{t('affinity.howardSchultzQuote')}"
          </p>
          <p className={`text-right text-white mt-2 mr-12 mb-[60px] font-bold ${isMobile ? 'text-sm' : 'text-base'}`}>{t('affinity.howardSchultzAuthor')}</p>
        </div>
        
        {/* Slogans - reduced font size by 20% */}
        <div className="space-y-5 mb-8 max-w-3xl mx-auto flex flex-col items-center py-0 mt-6">
          <div className={`bg-[#FFC700] affinity-slogan-block text-center my-[2px] px-[7px] py-[4px] ${isMobile ? 'rounded-xl w-full' : 'rounded-xl'}`}>
            <p 
              className={`text-[#8017B0] font-bold ${isMobile ? 'leading-[1.4]' : 'leading-[1]'}`} 
              style={{ 
                fontSize: isMobile ? '18px' : '22px',
                fontWeight: 'bold',
                fontFamily: 'inherit',
                lineHeight: isMobile ? '1.4' : '1',
                display: 'block',
                width: '100%'
              }}
            >
              {t('affinity.slogans.notJustStay')}
            </p>
          </div>
          <div className={`bg-[#FFC700] affinity-slogan-block text-center py-[4px] px-[23px] my-[7px] ${isMobile ? 'rounded-xl w-full' : 'rounded-xl'}`}>
            <p 
              className={`text-[#8017B0] font-bold ${isMobile ? 'leading-[1.4]' : 'leading-[1]'}`} 
              style={{ 
                fontSize: isMobile ? '18px' : '22px',
                fontWeight: 'bold',
                fontFamily: 'inherit',
                lineHeight: isMobile ? '1.4' : '1',
                display: 'block',
                width: '100%'
              }}
            >
              {t('affinity.slogans.meetShareBelong')}
            </p>
          </div>
          <div className={`bg-[#FFC700] affinity-slogan-block py-2 text-center px-[3px] my-[10px] ${isMobile ? 'rounded-xl w-full' : 'rounded-xl'}`}>
            <p 
              className={`text-[#8017B0] font-bold mobile-break ${isMobile ? 'leading-[1.4]' : 'leading-[1]'}`} 
              style={{ 
                fontSize: isMobile ? '18px' : '22px',
                fontWeight: 'bold',
                fontFamily: 'inherit',
                lineHeight: isMobile ? '1.4' : '1',
                display: 'block',
                width: '100%'
              }}
              dangerouslySetInnerHTML={{ __html: t('affinity.slogans.stayWithThoseWhoGetYou') }} 
            />
          </div>
          <div className={`bg-[#FFC700] affinity-slogan-block text-center px-[7px] my-[2px] py-[4px] ${isMobile ? 'rounded-xl w-full' : 'rounded-xl'}`}>
            <p 
              className={`text-[#8017B0] font-bold mobile-break ${isMobile ? 'leading-[1.4]' : 'leading-[1]'}`} 
              style={{ 
                fontSize: isMobile ? '18px' : '22px',
                fontWeight: 'bold',
                fontFamily: 'inherit',
                lineHeight: isMobile ? '1.4' : '1',
                display: 'block',
                width: '100%'
              }}
              dangerouslySetInnerHTML={{ __html: t('affinity.slogans.tiredOfRandom') }} 
            />
          </div>
          <div className={`bg-[#FFC700] affinity-slogan-block text-center py-[4px] px-[41px] my-[9px] ${isMobile ? 'rounded-xl w-full' : 'rounded-xl'}`}>
            <p 
              className={`text-[#8017B0] font-bold mobile-break ${isMobile ? 'leading-[1.4]' : 'leading-[1]'}`} 
              style={{ 
                fontSize: isMobile ? '18px' : '22px',
                fontWeight: 'bold',
                fontFamily: 'inherit',
                lineHeight: isMobile ? '1.4' : '1',
                display: 'block',
                width: '100%'
              }}
              dangerouslySetInnerHTML={{ __html: t('affinity.slogans.stayAndConnect') }} 
            />
          </div>
        </div>
      </div>
    </>;
}