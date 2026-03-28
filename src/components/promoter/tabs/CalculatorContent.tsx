import React, { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Calculator, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
export default function CalculatorContent() {
  const {
    t,
    language
  } = useTranslation('promotor-local');
  const {
    t: tHotel
  } = useTranslation('hotel-accordion');
  const [isDownloading, setIsDownloading] = useState(false);
  const {
    toast
  } = useToast();
  const handleDownloadExcel = async () => {
    if (isDownloading) return;
    
    setIsDownloading(true);
    
    try {
      const fileName = language === 'es' 
        ? 'CALCULADORA HOTEL-LIVING.xlsm'
        : 'HOTEL-LIVING CALCULATOR ENGLISH.xlsm';
      
      // Use Supabase Storage to get the file (same as Hotel Panel)
      const { data, error } = await supabase.storage
        .from('excel-calculators')
        .download(fileName);
        
      if (error) {
        throw new Error(`File not found in storage: ${error.message}`);
      }
      
      if (!data) {
        throw new Error('No file data received from storage');
      }
      
      // Create download URL and trigger download
      const downloadUrl = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
      
      toast({
        description: "The Hotel-Living Calculator has been downloaded successfully."
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        variant: "destructive",
        description: "There was a problem downloading the calculator. Please try again."
      });
    } finally {
      setIsDownloading(false);
    }
  };
  return <div className="space-y-6">
      {/* Explanatory Text */}
      <div className="bg-[#7E00B3]/60 backdrop-blur-sm rounded-2xl p-6 shadow-[0_0_30px_rgba(0,200,255,0.4)]">
        <p className="text-white text-lg leading-relaxed">
          {t('calculator.explanatoryText')}
        </p>
      </div>

      {/* Calculator Download */}
      <div className="bg-[#7E00B3]/60 backdrop-blur-sm rounded-2xl p-6 shadow-[0_0_30px_rgba(0,200,255,0.4)]">
        <div className="flex items-center gap-3 mb-6">
          <Calculator className="w-8 h-8 text-blue-400" />
          <h2 className="text-2xl font-bold text-white glow">{tHotel('calculator.title')}</h2>
        </div>
        
        <div className="bg-[#7801AA]/80 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-[0_0_40px_rgba(0,200,255,0.6),0_0_80px_rgba(0,200,255,0.3)]">
          <div className="text-center py-12">
            <Calculator className="w-16 h-16 mx-auto mb-6 text-blue-400 opacity-80" />
            
            <div className="mb-8">
              
            </div>
            
            <Button onClick={handleDownloadExcel} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white flex items-center gap-3 mx-auto px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300" disabled={isDownloading}>
              {isDownloading ? <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Downloading...
                </> : <>
                  <Download className="w-5 h-5" />
                  Download Excel Calculator
                </>}
            </Button>
            
            <p className="text-xs mt-8 text-white/60">
              © {new Date().getFullYear()} Hotel-Living Calculator. All rights reserved.
              This calculator is registered and protected by copyright laws.
            </p>
          </div>
        </div>
      </div>
    </div>;
}