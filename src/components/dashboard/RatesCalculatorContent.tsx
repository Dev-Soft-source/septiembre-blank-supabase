import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CostItemsTab } from "./rates-calculator/CostItemsTab";
import { DefaultCostsTab } from "./rates-calculator/DefaultCostsTab";
import { RatesCalculatorTab } from "./rates-calculator/RatesCalculatorTab";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { ModelRatesTabs } from "./rates-calculator/ModelRatesTabs";
import { useTranslation } from "@/hooks/useTranslation";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
export const RatesCalculatorContent: React.FC = () => {
  const {
    t,
    language
  } = useTranslation("dashboard");
  const {
    toast
  } = useToast();
  const [mainMenuExpanded, setMainMenuExpanded] = useState(true);
  const [mainTab, setMainTab] = useState<string>("costs-profits");
  const [costsSubTab, setCostsSubTab] = useState<string>("");
  const [profitsSubTab, setProfitsSubTab] = useState<string>("");
  const [modelExpanded, setModelExpanded] = useState(false);
  const [costsExpanded, setCostsExpanded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // New: States for the two submenus in the "BUILD YOUR OWN MODEL & RATES" section
  const [tipsExpanded, setTipsExpanded] = useState(false);
  const [downloadExpanded, setDownloadExpanded] = useState(false);

  // New: Which TIPS submenu (if any) is open
  const [openTipsSubmenu, setOpenTipsSubmenu] = useState<string | null>(null);

  // Handler to open/close TIPS submenus (only one open at a time in expanded view)
  const handleTipsSubmenuToggle = (submenuKey: string) => {
    setOpenTipsSubmenu(prev => prev === submenuKey ? null : submenuKey);
  };

  // For the Build Model section tabs
  const [modelTab, setModelTab] = useState<string>("read-this"); // default

  // Handle Excel calculator download based on language
  const handleExcelDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const fileName = language === 'es' ? 'CALCULADORA HOTEL-LIVING.xlsm' : 'HOTEL-LIVING CALCULATOR ENGLISH.xlsm';
      console.log('=== EXCEL DOWNLOAD DEBUG ===');
      console.log('Language:', language);
      console.log('Filename:', fileName);

      // Use Supabase Storage to get the file
      const {
        data,
        error
      } = await supabase.storage.from('excel-calculators').download(fileName);
      console.log('Supabase storage response:', {
        data,
        error
      });
      if (error) {
        console.error('Supabase storage error:', error);
        throw new Error(`File not found in storage: ${error.message}`);
      }
      if (!data) {
        throw new Error('No file data received from storage');
      }
      console.log('File downloaded from storage:', {
        type: data.type,
        size: data.size
      });

      // Create download URL and trigger download
      const downloadUrl = URL.createObjectURL(data);
      console.log('Download URL created:', downloadUrl);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      console.log('Download link created and clicked');
      link.click();
      document.body.removeChild(link);

      // Clean up the URL object
      URL.revokeObjectURL(downloadUrl);
      console.log('Download completed successfully');
      toast({
        title: "Download Started",
        description: `${fileName} is being downloaded`,
        variant: "success"
      });
    } catch (error) {
      console.error('=== DOWNLOAD ERROR ===');
      console.error('Error details:', error);
      console.error('Error message:', error.message);
      toast({
        title: "Download Failed",
        description: `Could not download the Excel calculator. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // Single-click to toggle top-level main menu
  const handleHeaderClick = () => {
    setMainMenuExpanded(prev => {
      if (prev) {
        setMainTab("");
        setCostsExpanded(false);
        setModelExpanded(false);
        setCostsSubTab("");
        setProfitsSubTab("");
        // Also collapse submenus in model section if open
        setTipsExpanded(false);
        setDownloadExpanded(false);
      }
      return !prev;
    });
  };

  // Single-click to toggle COSTS & PROFITS menu
  const handleCostsMainTabClick = () => {
    setCostsExpanded(prev => {
      if (prev) {
        setMainTab("");
        setCostsSubTab("");
        setProfitsSubTab("");
      } else {
        setMainTab("costs-profits");
        setModelExpanded(false);
        setCostsSubTab("");
        setProfitsSubTab("");
        // Model submenus stay collapsed
      }
      return !prev;
    });
  };

  // Single-click to toggle BUILD YOUR OWN MODEL & RATES menu
  const handleModelTabClick = () => {
    setModelExpanded(prev => {
      if (prev) {
        setMainTab("");
        // Also collapse submenus
        setTipsExpanded(false);
        setDownloadExpanded(false);
      } else {
        setMainTab("model-rates-calculator");
        setCostsExpanded(false);
        setCostsSubTab("");
        setProfitsSubTab("");
        // Model submenus start collapsed
        setTipsExpanded(false);
        setDownloadExpanded(false);
      }
      return !prev;
    });
  };

  // COSTS/PROFITS submenu behavior
  const handleCostsSubTabClick = () => {
    setCostsSubTab(prev => prev === "costs" ? "" : "costs");
    setProfitsSubTab(""); // Close profits menu if opening costs
  };
  const handleProfitsSubTabClick = () => {
    setCostsSubTab(prev => prev === "profits" ? "" : "profits");
    setProfitsSubTab(""); // Reset 3/4/5-star submenu on open/close
  };

  // 3/4/5-star submenu
  const handleProfitsStarTabClick = (star: string) => {
    setProfitsSubTab(prev => prev === star ? "" : star);
  };

  // Handlers for new submenus (single click toggles)
  const handleTipsClick = () => {
    setTipsExpanded(prev => !prev);
    if (!tipsExpanded) setDownloadExpanded(false);
  };
  const handleDownloadClick = () => {
    setDownloadExpanded(prev => !prev);
    if (!downloadExpanded) setTipsExpanded(false);
  };

  // Handlers for download calculator tab
  const handleDownloadCalculatorClick = () => {
    setMainTab("download-calculator");
    setCostsExpanded(false);
    setModelExpanded(false);
    setCostsSubTab("");
    setProfitsSubTab("");
    setTipsExpanded(false);
    setDownloadExpanded(false);
  };
  return <div className="space-y-6">
      {/* Header MENU */}
      <div className="glass-card rounded-lg p-6 text-white border-fuchsia-500/20 bg-[#68178D] cursor-pointer" onClick={handleHeaderClick}>
        <h2 className="text-xl font-bold text-center">
          {t('general.standardEconomicModel')}
        </h2>
      </div>

      {mainMenuExpanded && <Tabs value={mainTab} onValueChange={() => {}} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-[#460F54]/30 backdrop-blur-sm h-16 p-2">
            <TabsTrigger value="costs-profits" className={`py-4 px-6 data-[state=active]:bg-gradient-to-br data-[state=active]:from-cyan-400 data-[state=active]:via-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg bg-[#8017B0] text-white hover:bg-[#8017B0]/80 transition-all duration-300 font-bold text-sm cursor-pointer ${costsExpanded ? "border border-white/40" : ""}`} onClick={handleCostsMainTabClick} aria-pressed={costsExpanded}>
              <div className="flex flex-col items-center text-center leading-tight">
                <span className="text-xs font-bold mb-1">1</span>
                {t('general.costsAndProfits').split('\n').map((line, index) => <span key={index} className="block">{line}</span>)}
              </div>
            </TabsTrigger>
            <TabsTrigger value="model-rates-calculator" className={`py-4 px-6 data-[state=active]:bg-gradient-to-br data-[state=active]:from-cyan-400 data-[state=active]:via-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg bg-[#8017B0] text-white hover:bg-[#8017B0]/80 transition-all duration-300 font-bold text-sm cursor-pointer ${modelExpanded ? "border border-white/40" : ""}`} onClick={handleModelTabClick} aria-pressed={modelExpanded}>
              <div className="flex flex-col items-center text-center leading-tight">
                <span className="text-xs font-bold mb-1">2</span>
                {t('general.buildOwnModel').split('\n').map((line, index) => <span key={index} className="block">{line}</span>)}
              </div>
            </TabsTrigger>
            <TabsTrigger value="download-calculator" className={`py-4 px-6 data-[state=active]:bg-gradient-to-br data-[state=active]:from-cyan-400 data-[state=active]:via-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg bg-[#8017B0] text-white hover:bg-[#8017B0]/80 transition-all duration-300 font-bold text-sm cursor-pointer`} onClick={handleDownloadCalculatorClick}>
              <div className="flex flex-col items-center text-center leading-tight">
                <span className="text-xs font-bold mb-1">3</span>
                {t('general.downloadCalculator').split('\n').map((line, index) => <span key={index} className="block">{line}</span>)}
              </div>
            </TabsTrigger>
          </TabsList>

          {/* COSTS & PROFITS Section - Direct display of CostItemsTab with proper spacing */}
          {mainTab === "costs-profits" && <TabsContent value="costs-profits" className="mt-12">
              <CostItemsTab />
            </TabsContent>}

          {/* BUILD YOUR OWN MODEL & RATES Section */}
          {mainTab === "model-rates-calculator" && <TabsContent value="model-rates-calculator" className="mt-8">
              <div className="mb-8">
                {/* Hotel Living Pricing Policy */}
                <div className="p-6 rounded-xl bg-gradient-to-br from-fuchsia-800/20 via-purple-800/30 to-fuchsia-800/20 border-2 border-fuchsia-400/40 shadow-2xl backdrop-blur-sm">
                  <div className="text-white/95 text-[0.6125rem] leading-relaxed font-medium whitespace-pre-line">
                    {t('ratesCalculator.strategicGuidelines.section8.content')}
                  </div>
                </div>
              </div>
              
              {/* Strategic Guidelines Accordion - positioned below */}
              <div className="mt-12">
                <Accordion type="single" collapsible className="w-full space-y-3">
                  {Array.from({
              length: 8
            }, (_, index) => {
              const sectionKey = `section${index + 1}`;
              return <AccordionItem key={sectionKey} value={sectionKey} className="border-2 border-fuchsia-400/40 rounded-xl bg-gradient-to-r from-purple-900/50 to-fuchsia-900/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:border-fuchsia-300/60">
                        <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                          <span className="text-white font-bold text-[0.7rem] uppercase tracking-wide leading-tight">
                            {index + 1}. {t(`ratesCalculator.strategicGuidelines.${sectionKey}.title`)}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6 pt-2">
                          <div className="text-white/95 text-[0.6125rem] leading-relaxed font-medium">
                            {t(`ratesCalculator.strategicGuidelines.${sectionKey}.content`)}
                          </div>
                        </AccordionContent>
                      </AccordionItem>;
            })}
                </Accordion>
              </div>
            </TabsContent>}

          {/* DOWNLOAD CALCULATOR Section */}
          {mainTab === "download-calculator" && <TabsContent value="download-calculator">
              {/* Excel Calculator Download Section */}
              <div className="mt-12 p-8 rounded-xl bg-gradient-to-br from-fuchsia-800/20 via-purple-800/30 to-fuchsia-800/20 border-2 border-fuchsia-400/40 shadow-2xl backdrop-blur-sm">
                <div className="text-center space-y-6">
                  <p className="text-[0.875rem] font-bold tracking-wide text-white uppercase leading-relaxed">
                    {t("ratesCalculator.excelCalculator.description")}
                  </p>
                  <Button size="lg" className="bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white font-bold px-10 py-5 shadow-2xl hover:shadow-3xl transition-all duration-300 text-[0.875rem] uppercase tracking-wider rounded-xl border border-fuchsia-300/30 disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleExcelDownload} disabled={isDownloading}>
                    {isDownloading ? <>
                        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                        Downloading...
                      </> : t("ratesCalculator.excelCalculator.buttonLabel")}
                  </Button>
                </div>
              </div>
            </TabsContent>}
        </Tabs>}
    </div>;
};