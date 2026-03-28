
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Starfield } from "@/components/Starfield";
import { useTranslation } from "@/hooks/useTranslation";

export default function Terms() {
  const { t } = useTranslation('terms');
  
  return (
    <div className="min-h-screen flex flex-col">
      <Starfield />
      <Navbar />
      
      <main className="flex-1 pt-20 px-4 text-white">
        <div className="container max-w-4xl mx-auto py-10 bg-[#4b0456] px-6 md:px-8">
          <h1 className="font-bold mb-6 text-2xl text-center">{t('terms.title')}</h1>
          
          <div className="prose prose-invert max-w-none text-sm">
            <h2 className="font-semibold mb-4 text-lg px-[21px] text-center">{t('terms.subtitle')}</h2>
            <p className="text-xs text-right text-gray-400 mb-6">{t('terms.lastUpdated')}</p>
            
            <p className="mb-4 px-[17px]">{t('terms.intro')}</p>
            
            <p className="mb-4 px-[20px]">{t('terms.invalidProvision')}</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              {(t('terms.invalidPoints', { returnObjects: true }) as string[]).map((point: string, index: number) => (
                <li key={index} className="px-[5px]">{point}</li>
              ))}
            </ul>
            
            <section className="mb-8">
              <h3 className="text-xl font-medium mb-4 text-slate-50 text-center">{t('terms.aboutHotelLiving.title')}</h3>
              <p className="mb-4 px-[16px]">{t('terms.aboutHotelLiving.content1')}</p>
              <p className="mb-4 px-[18px]">{t('terms.aboutHotelLiving.content2')}</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                {(t('terms.aboutHotelLiving.points', { returnObjects: true }) as string[]).map((point: string, index: number) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
              <p className="mb-4 px-[20px]">{t('terms.aboutHotelLiving.content3')}</p>
              <p className="mb-4">{t('terms.aboutHotelLiving.content4')}</p>
              <p className="mb-4">{t('terms.aboutHotelLiving.content5')}</p>
              <p className="mb-4">{t('terms.aboutHotelLiving.content6')}</p>
              <p className="mb-4">{t('terms.aboutHotelLiving.content7')}</p>
              <p className="mb-4">{t('terms.aboutHotelLiving.content8')}</p>
            </section>
            
            <section className="mb-8">
              <h3 className="text-xl font-medium mb-4 text-[#f6e7f8]">{t('terms.ourValues.title')}</h3>
              <p className="mb-4">{t('terms.ourValues.content')}</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                {(t('terms.ourValues.points', { returnObjects: true }) as string[]).map((point: string, index: number) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </section>
            
            <section className="mb-8">
              <h3 className="text-xl font-medium mb-4 text-[#e2dce2]">{t('terms.prices.title')}</h3>
              <p className="mb-4">{t('terms.prices.content1')}</p>
              <p className="mb-4">{t('terms.prices.content2')}</p>
              <p className="mb-4">{t('terms.prices.content3')}</p>
              <p className="mb-4">{t('terms.prices.content4')}</p>
            </section>
            
            <section className="mb-8">
              <h3 className="text-xl font-medium mb-4 text-[#efe6ef]">{t('terms.payment.title')}</h3>
              <p className="mb-4">{t('terms.payment.content1')}</p>
              <p className="mb-4">{t('terms.payment.content2')}</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                {(t('terms.payment.paymentPoints', { returnObjects: true }) as string[]).map((point: string, index: number) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
              <p className="mb-4">{t('terms.payment.content3')}</p>
              <p className="mb-4">{t('terms.payment.content4')}</p>
            </section>
            
            <section className="mb-8">
              <h3 className="text-xl font-medium mb-4 text-[#faeefb]">{t('terms.conditions.title')}</h3>
              <p className="mb-4">{t('terms.conditions.content1')}</p>
              <p className="mb-4">{t('terms.conditions.content2')}</p>
              <p className="mb-4">{t('terms.conditions.content3')}</p>
              <p className="mb-4">{t('terms.conditions.content4')}</p>
              <p className="mb-4">{t('terms.conditions.content5')}</p>
            </section>
            
            <section className="mb-8">
              <h3 className="text-xl font-medium mb-4 text-[#f2e1f4]">{t('terms.privacyAndCookies.title')}</h3>
              <p className="mb-4">{t('terms.privacyAndCookies.content')}</p>
            </section>
            
            <section className="mb-8">
              <h3 className="text-xl font-medium mb-4 text-[#eae2eb]">{t('terms.accessibilityRequests.title')}</h3>
              <p className="mb-4">{t('terms.accessibilityRequests.content')}</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                {(t('terms.accessibilityRequests.points', { returnObjects: true }) as string[]).map((point: string, index: number) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </section>
            
            <section className="mb-8">
              <h3 className="text-xl font-medium mb-4 text-[#f6e5f8]">{t('terms.intellectualProperty.title')}</h3>
              <p className="mb-4">{t('terms.intellectualProperty.content1')}</p>
              <p className="mb-4">{t('terms.intellectualProperty.content2')}</p>
              <p className="mb-4">{t('terms.intellectualProperty.content3')}</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                {(t('terms.intellectualProperty.monitoringPoints', { returnObjects: true }) as string[]).map((point: string, index: number) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
              <p className="mb-4">{t('terms.intellectualProperty.content4')}</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                {(t('terms.intellectualProperty.uploadPoints', { returnObjects: true }) as string[]).map((point: string, index: number) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
              <p className="mb-4">{t('terms.intellectualProperty.content5')}</p>
            </section>
            
            <section className="mb-8">
              <p className="mb-4 px-[16px] text-center font-medium text-white">{t('terms.demoDisclaimer.content')}</p>
            </section>
            
            <section className="mb-8">
              <h3 className="text-xl font-medium mb-4 text-[#e9e1ea]">{t('terms.dictionary.title')}</h3>
              <p className="mb-4">{t('terms.dictionary.account')}</p>
              <p className="mb-4">{t('terms.dictionary.accommodation')}</p>
              <p className="mb-4">{t('terms.dictionary.reservation')}</p>
              <p className="mb-4">{t('terms.dictionary.hotelLiving')}</p>
              <p className="mb-4">{t('terms.dictionary.transferableCredit')}</p>
              <p className="mb-4">{t('terms.dictionary.credit')}</p>
              <p className="mb-4">{t('terms.dictionary.creditCardRefund')}</p>
              <p className="mb-4">{t('terms.dictionary.currencyExchangeRate')}</p>
              <p className="mb-4">{t('terms.dictionary.eligibleReservation')}</p>
              <p className="mb-4">{t('terms.dictionary.particularRewardCriteria')}</p>
              <p className="mb-4">{t('terms.dictionary.payInYourCurrency')}</p>
              <p className="mb-4">{t('terms.dictionary.paymentMethod')}</p>
              <p className="mb-4">{t('terms.dictionary.platform')}</p>
              <p className="mb-4">{t('terms.dictionary.reward')}</p>
              <p className="mb-4">{t('terms.dictionary.serviceProvider')}</p>
              <p className="mb-4">{t('terms.dictionary.conditions')}</p>
              <p className="mb-4">{t('terms.dictionary.externalAggregator')}</p>
              <p className="mb-4">{t('terms.dictionary.thirdPartyTerms')}</p>
              <p className="mb-4">{t('terms.dictionary.travelCredit')}</p>
              <p className="mb-4">{t('terms.dictionary.advancePayment')}</p>
              <p className="mb-4">{t('terms.dictionary.wallet')}</p>
              <p className="mb-6">{t('terms.dictionary.updateNote')}</p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
