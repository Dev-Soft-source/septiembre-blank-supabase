
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useTranslation } from "@/hooks/useTranslation";

export function AffinityAccordionMenu() {
  const { t } = useTranslation('affinity');
  
  return <div className="pt-6 mb-12 border-t border-yellow-300/30 bg-[#460F54]/30 rounded-lg p-6 mx-0 px-0 py-[18px]">
      <Accordion type="single" collapsible className="w-full space-y-3">
        {/* NEW MENU ITEM */}
        <AccordionItem value="item-0" className="overflow-hidden border-none shadow-2xl shadow-cyan-400/80 drop-shadow-[0_0_25px_rgba(34,211,238,0.7)]">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#7E00B3] to-[#7E00B3] rounded-t-xl border-l-6 border-[#FFF9B0] hover:from-[#9500CC] hover:to-[#9500CC] transition-all duration-300 text-lg font-normal shadow-2xl shadow-cyan-400/80 drop-shadow-[0_0_20px_rgba(34,211,238,0.8)]">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              {t('affinity.faq.whatAreAffinityHotels.question')}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#7E00B3]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#FFF9B0]/50 shadow-2xl shadow-cyan-400/80 drop-shadow-[0_0_20px_rgba(34,211,238,0.7)]">
            <p className="text-[#FFF9B0] text-base leading-relaxed">
              {t('affinity.faq.whatAreAffinityHotels.answer')}
            </p>
          </AccordionContent>
        </AccordionItem>

        {/* MENU 1 */}
        <AccordionItem value="item-1" className="overflow-hidden border-none shadow-2xl shadow-cyan-400/80 drop-shadow-[0_0_25px_rgba(34,211,238,0.7)]">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#7E00B3] to-[#7E00B3] rounded-t-xl border-l-6 border-[#FFF9B0] hover:from-[#9500CC] hover:to-[#9500CC] transition-all duration-300 shadow-2xl shadow-cyan-400/80 drop-shadow-[0_0_20px_rgba(34,211,238,0.8)]">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              {t('affinity.faq.tiredOfTravelingAlone.question')}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#7E00B3]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#FFF9B0]/50 shadow-2xl shadow-cyan-400/80 drop-shadow-[0_0_20px_rgba(34,211,238,0.7)]">
            <p className="text-[#FFF9B0] text-base leading-relaxed">
              {t('affinity.faq.tiredOfTravelingAlone.answer')}
            </p>
          </AccordionContent>
        </AccordionItem>

        {/* MENU 2 */}
        <AccordionItem value="item-2" className="overflow-hidden border-none shadow-2xl shadow-cyan-400/80 drop-shadow-[0_0_25px_rgba(34,211,238,0.7)]">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#7E00B3] to-[#7E00B3] rounded-t-xl border-l-6 border-[#FFF9B0] hover:from-[#9500CC] hover:to-[#9500CC] transition-all duration-300 shadow-2xl shadow-cyan-400/80 drop-shadow-[0_0_20px_rgba(34,211,238,0.8)]">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              {t('affinity.faq.whatExactlyIsAffinityHotel.question')}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#7E00B3]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#FFF9B0]/50 shadow-2xl shadow-cyan-400/80 drop-shadow-[0_0_20px_rgba(34,211,238,0.7)]">
            <p className="text-[#FFF9B0] text-base leading-relaxed">
              {t('affinity.faq.whatExactlyIsAffinityHotel.answer')}
            </p>
          </AccordionContent>
        </AccordionItem>
        
        {/* MENU 3 */}
        <AccordionItem value="item-3" className="overflow-hidden border-none shadow-2xl shadow-cyan-400/80 drop-shadow-[0_0_25px_rgba(34,211,238,0.7)]">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#7E00B3] to-[#7E00B3] rounded-t-xl border-l-6 border-[#FFF9B0] hover:from-[#9500CC] hover:to-[#9500CC] transition-all duration-300 shadow-2xl shadow-cyan-400/80 drop-shadow-[0_0_20px_rgba(34,211,238,0.8)]">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              {t('affinity.faq.willIMakeFriends.question')}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#7E00B3]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#FFF9B0]/50 shadow-2xl shadow-cyan-400/80 drop-shadow-[0_0_20px_rgba(34,211,238,0.7)]">
            <p className="text-[#FFF9B0] text-base leading-relaxed">
              {t('affinity.faq.willIMakeFriends.answer')}
            </p>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-4" className="overflow-hidden border-none shadow-2xl shadow-cyan-400/80 drop-shadow-[0_0_25px_rgba(34,211,238,0.7)]">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#7E00B3] to-[#7E00B3] rounded-t-xl border-l-6 border-[#FFF9B0] hover:from-[#9500CC] hover:to-[#9500CC] transition-all duration-300 shadow-2xl shadow-cyan-400/80 drop-shadow-[0_0_20px_rgba(34,211,238,0.8)]">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              {t('affinity.faq.doesHotelOrganizeActivities.question')}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#7E00B3]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#FFF9B0]/50 shadow-2xl shadow-cyan-400/80 drop-shadow-[0_0_20px_rgba(34,211,238,0.7)]">
            <p className="text-[#FFF9B0] text-base leading-relaxed">
              {t('affinity.faq.doesHotelOrganizeActivities.answer')}
            </p>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-5" className="overflow-hidden border-none shadow-2xl shadow-cyan-400/80 drop-shadow-[0_0_25px_rgba(34,211,238,0.7)]">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#7E00B3] to-[#7E00B3] rounded-t-xl border-l-6 border-[#FFF9B0] hover:from-[#9500CC] hover:to-[#9500CC] transition-all duration-300 shadow-2xl shadow-cyan-400/80 drop-shadow-[0_0_20px_rgba(34,211,238,0.8)]">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              {t('affinity.faq.isThereAlwaysGroupLeader.question')}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#7E00B3]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#FFF9B0]/50 shadow-2xl shadow-cyan-400/80 drop-shadow-[0_0_20px_rgba(34,211,238,0.7)]">
            <p className="text-[#FFF9B0] text-base leading-relaxed">
              {t('affinity.faq.isThereAlwaysGroupLeader.answer')}
            </p>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-6" className="overflow-hidden border-none shadow-2xl shadow-cyan-400/80 drop-shadow-[0_0_25px_rgba(34,211,238,0.7)]">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#7E00B3] to-[#7E00B3] rounded-t-xl border-l-6 border-[#FFF9B0] hover:from-[#9500CC] hover:to-[#9500CC] transition-all duration-300 shadow-2xl shadow-cyan-400/80 drop-shadow-[0_0_20px_rgba(34,211,238,0.8)]">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              {t('affinity.faq.isHotelDecoratedAroundTheme.question')}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#7E00B3]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#FFF9B0]/50 shadow-2xl shadow-cyan-400/80 drop-shadow-[0_0_20px_rgba(34,211,238,0.7)]">
            <p className="text-[#FFF9B0] text-base leading-relaxed">
              {t('affinity.faq.isHotelDecoratedAroundTheme.answer')}
            </p>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-7" className="overflow-hidden border-none shadow-2xl shadow-cyan-400/80 drop-shadow-[0_0_25px_rgba(34,211,238,0.7)]">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#7E00B3] to-[#7E00B3] rounded-t-xl border-l-6 border-[#FFF9B0] hover:from-[#9500CC] hover:to-[#9500CC] transition-all duration-300 shadow-2xl shadow-cyan-400/80 drop-shadow-[0_0_20px_rgba(34,211,238,0.8)]">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              {t('affinity.faq.howLongAreStays.question')}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#7E00B3]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#FFF9B0]/50 shadow-2xl shadow-cyan-400/80 drop-shadow-[0_0_20px_rgba(34,211,238,0.7)]">
            <p className="text-[#FFF9B0] text-base leading-relaxed">
              {t('affinity.faq.howLongAreStays.answer')}
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-8" className="overflow-hidden border-none shadow-2xl shadow-cyan-400/80 drop-shadow-[0_0_25px_rgba(34,211,238,0.7)]">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#7E00B3] to-[#7E00B3] rounded-t-xl border-l-6 border-[#FFF9B0] hover:from-[#9500CC] hover:to-[#9500CC] transition-all duration-300 shadow-2xl shadow-cyan-400/80 drop-shadow-[0_0_20px_rgba(34,211,238,0.8)]">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              {t('affinity.faq.canITryDifferentAffinities.question')}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#7E00B3]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#FFF9B0]/50 shadow-2xl shadow-cyan-400/80 drop-shadow-[0_0_20px_rgba(34,211,238,0.7)]">
            <p className="text-[#FFF9B0] text-base leading-relaxed">
              {t('affinity.faq.canITryDifferentAffinities.answer')}
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-9" className="overflow-hidden border-none shadow-2xl shadow-cyan-400/80 drop-shadow-[0_0_25px_rgba(34,211,238,0.7)]">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#7E00B3] to-[#7E00B3] rounded-t-xl border-l-6 border-[#FFF9B0] hover:from-[#9500CC] hover:to-[#9500CC] transition-all duration-300 shadow-2xl shadow-cyan-400/80 drop-shadow-[0_0_20px_rgba(34,211,238,0.8)]">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              {t('affinity.faq.whatIfJustWantToRelax.question')}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#7E00B3]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#FFF9B0]/50 shadow-2xl shadow-cyan-400/80 drop-shadow-[0_0_20px_rgba(34,211,238,0.7)]">
            <p className="text-[#FFF9B0] text-base leading-relaxed">
              {t('affinity.faq.whatIfJustWantToRelax.answer')}
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-10" className="overflow-hidden border-none shadow-2xl shadow-cyan-400/80 drop-shadow-[0_0_25px_rgba(34,211,238,0.7)]">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#7E00B3] to-[#7E00B3] rounded-t-xl border-l-6 border-[#FFF9B0] hover:from-[#9500CC] hover:to-[#9500CC] transition-all duration-300 shadow-2xl shadow-cyan-400/80 drop-shadow-[0_0_20px_rgba(34,211,238,0.8)]">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              {t('affinity.faq.isThisForSoloTravelers.question')}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#7E00B3]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#FFF9B0]/50 shadow-2xl shadow-cyan-400/80 drop-shadow-[0_0_20px_rgba(34,211,238,0.7)]">
            <p className="text-[#FFF9B0] text-base leading-relaxed">
              {t('affinity.faq.isThisForSoloTravelers.answer')}
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-11" className="overflow-hidden border-none shadow-2xl shadow-cyan-400/80 drop-shadow-[0_0_25px_rgba(34,211,238,0.7)]">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#7E00B3] to-[#7E00B3] rounded-t-xl border-l-6 border-[#FFF9B0] hover:from-[#9500CC] hover:to-[#9500CC] transition-all duration-300 shadow-2xl shadow-cyan-400/80 drop-shadow-[0_0_20px_rgba(34,211,238,0.8)]">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              {t('affinity.faq.whatIfDontFindTheme.question')}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#7E00B3]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#FFF9B0]/50 shadow-2xl shadow-cyan-400/80 drop-shadow-[0_0_20px_rgba(34,211,238,0.7)]">
            <p className="text-[#FFF9B0] text-base leading-relaxed">
              {t('affinity.faq.whatIfDontFindTheme.answer')}
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-12" className="overflow-hidden border-none shadow-2xl shadow-cyan-400/80 drop-shadow-[0_0_25px_rgba(34,211,238,0.7)]">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#7E00B3] to-[#7E00B3] rounded-t-xl border-l-6 border-[#FFF9B0] hover:from-[#9500CC] hover:to-[#9500CC] transition-all duration-300 shadow-2xl shadow-cyan-400/80 drop-shadow-[0_0_20px_rgba(34,211,238,0.8)]">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              {t('affinity.faq.areAffinityThemesAvailable.question')}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#7E00B3]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#FFF9B0]/50 shadow-2xl shadow-cyan-400/80 drop-shadow-[0_0_20px_rgba(34,211,238,0.7)]">
            <p className="text-[#FFF9B0] text-base leading-relaxed">
              {t('affinity.faq.areAffinityThemesAvailable.answer')}
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-13" className="overflow-hidden border-none shadow-2xl shadow-cyan-400/80 drop-shadow-[0_0_25px_rgba(34,211,238,0.7)]">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#7E00B3] to-[#7E00B3] rounded-t-xl border-l-6 border-[#FFF9B0] hover:from-[#9500CC] hover:to-[#9500CC] transition-all duration-300 shadow-2xl shadow-cyan-400/80 drop-shadow-[0_0_20px_rgba(34,211,238,0.8)]">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              {t('affinity.faq.canIConnectWithoutTheme.question')}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#7E00B3]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#FFF9B0]/50 shadow-2xl shadow-cyan-400/80 drop-shadow-[0_0_20px_rgba(34,211,238,0.7)]">
            <p className="text-[#FFF9B0] text-base leading-relaxed">
              {t('affinity.faq.canIConnectWithoutTheme.answer')}
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>;
}
