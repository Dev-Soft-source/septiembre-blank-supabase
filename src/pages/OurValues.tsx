
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Starfield } from "@/components/Starfield";
import { useTranslation } from "@/hooks/useTranslation";

export default function OurValues() {
  const { t } = useTranslation('ourValues');
  
  return (
    <div className="min-h-screen flex flex-col">
      <Starfield />
      <Navbar />
      
      <main className="flex-1 pt-20 px-4 text-white">
        <div className="container max-w-4xl mx-auto py-10 bg-[#4b0456]">
          <h1 className="text-3xl font-bold mb-6 text-center">{t('ourValues.title')}</h1>
          
          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-3 px-[18px] text-center my-0">{t('ourValues.respect.title')}</h2>
              <p className="text-center px-[28px]">{t('ourValues.respect.content')}</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-3 px-[18px] text-center">{t('ourValues.community.title')}</h2>
              <p className="text-center px-[37px]">{t('ourValues.community.content')}</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-3 px-[21px] text-center">{t('ourValues.integrity.title')}</h2>
              <p className="text-center px-[31px]">{t('ourValues.integrity.content')}</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-3 text-center">{t('ourValues.compliance.title')}</h2>
              <p className="text-center px-[26px]">{t('ourValues.compliance.content')}</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-3 text-center">{t('ourValues.safety.title')}</h2>
              <p className="text-center px-[33px]">{t('ourValues.safety.content')}</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-3 px-[23px] my-[8px] mx-[20px] py-[5px]">{t('ourValues.personalInfo.title')}</h2>
              <p className="text-center px-[41px]">{t('ourValues.personalInfo.content')}</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-3 px-[44px] text-center">{t('ourValues.recordings.title')}</h2>
              <ul className="list-disc pl-6 space-y-2">
                {(t('ourValues.recordings.points', { returnObjects: true }) as string[]).map((point: string, index: number) => (
                  <li key={index} className="px-[11px]">{point}</li>
                ))}
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-3 px-[35px] text-center">{t('ourValues.privacy.title')}</h2>
              <ul className="list-disc pl-6 space-y-2">
                {(t('ourValues.privacy.points', { returnObjects: true }) as string[]).map((point: string, index: number) => (
                  <li key={index} className="px-[11px]">{point}</li>
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
