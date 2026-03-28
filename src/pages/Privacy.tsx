
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Starfield } from "@/components/Starfield";
import { useTranslation } from "@/hooks/useTranslation";

export default function Privacy() {
  const { t } = useTranslation('privacy');
  
  return (
    <div className="min-h-screen flex flex-col">
      <Starfield />
      <Navbar />
      
      <main className="flex-1 pt-20 px-4 text-white">
        <div className="container max-w-4xl mx-auto py-10 bg-[#4b0456] px-6 md:px-8">
          <h1 className="text-3xl font-bold mb-6">{t('privacy.title')}</h1>
          
          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-3">{t('privacy.introduction.title')}</h2>
              <p>{t('privacy.introduction.content1')}</p>
              <p>{t('privacy.introduction.content2')}</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-3">{t('privacy.informationWeCollect.title')}</h2>
              <p>{t('privacy.informationWeCollect.content')}</p>
              <ul className="list-disc pl-6 space-y-2">
                {(t('privacy.informationWeCollect.points', { returnObjects: true }) as string[]).map((point: string, index: number) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-3">{t('privacy.howWeUseInformation.title')}</h2>
              <p>{t('privacy.howWeUseInformation.content')}</p>
              <ul className="list-disc pl-6 space-y-2">
                {(t('privacy.howWeUseInformation.points', { returnObjects: true }) as string[]).map((point: string, index: number) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-3">{t('privacy.cookiesAndTracking.title')}</h2>
              <p>{t('privacy.cookiesAndTracking.content1')}</p>
              <p>{t('privacy.cookiesAndTracking.content2')}</p>
              <p>{t('privacy.cookiesAndTracking.content3')}</p>
              <p>{t('privacy.cookiesAndTracking.content4')}</p>
              <ul className="list-disc pl-6 space-y-2">
                {(t('privacy.cookiesAndTracking.cookieTypes', { returnObjects: true }) as string[]).map((type: string, index: number) => (
                  <li key={index}><strong>{type.split(':')[0]}:</strong> {type.split(':')[1]}</li>
                ))}
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-3">{t('privacy.dataSecurity.title')}</h2>
              <p>{t('privacy.dataSecurity.content1')}</p>
              <p>{t('privacy.dataSecurity.content2')}</p>
              <p>{t('privacy.dataSecurity.content3')}</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-3">{t('privacy.yourRights.title')}</h2>
              <p>{t('privacy.yourRights.content')}</p>
              <ul className="list-disc pl-6 space-y-2">
                {(t('privacy.yourRights.points', { returnObjects: true }) as string[]).map((point: string, index: number) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
              <p>{t('privacy.yourRights.contact')}</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-3">{t('privacy.policyChanges.title')}</h2>
              <p>{t('privacy.policyChanges.content1')}</p>
              <p>{t('privacy.policyChanges.content2')}</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-3">{t('privacy.contactUs.title')}</h2>
              <p>{t('privacy.contactUs.content')}</p>
              <ul className="list-disc pl-6 space-y-2">
                {(t('privacy.contactUs.points', { returnObjects: true }) as string[]).map((point: string, index: number) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
