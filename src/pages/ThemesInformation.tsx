
import React from 'react';
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FaqTabs } from "@/components/faq/FaqTabs";
import { affinitiesFaqs } from "@/components/faq/hotel-categories/affinitiesFaqs";

const themesFaqCategories = [{ id: "affinities", name: "" }];

export default function ThemesInformation() {
  const [activeTab, setActiveTab] = React.useState("affinities");
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="container max-w-4xl mx-auto px-4 pt-24 pb-12">
        <h1 className="text-3xl font-bold mb-8 text-center text-[#f9d3f6]">HOTEL'S AFFINITIES INFORMATION</h1>
        
        <div className="glass-card rounded-2xl p-8 bg-[#5c0869]/80">
          <FaqTabs 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            faqCategories={themesFaqCategories}
            faqsByCategory={{
              affinities: affinitiesFaqs
            }}
            numbered={true}
            accentTextColor="#4db74d"
            headerBgColor="#71037c"
            textSizeClass="text-base md:text-lg"
            answerTextSizeClass="text-sm md:text-base"
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
