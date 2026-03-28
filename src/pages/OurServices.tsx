
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Starfield } from "@/components/Starfield";
import { useTranslation } from "@/hooks/useTranslation";

export default function OurServices() {
  const { t } = useTranslation('ourServices');
  
  return (
    <div className="min-h-screen flex flex-col">
      <Starfield />
      <Navbar />
      
      <main className="flex-1 pt-20 px-4 text-white">
        <div className="container max-w-4xl mx-auto py-10 bg-[#4b0456]">
          <h1 className="text-3xl font-bold mb-6 text-center">{t('ourServices.title')}</h1>
          
          <div className="prose prose-invert max-w-none space-y-8">
            <p className="px-[28px] text-center">{t('ourServices.description')}</p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
