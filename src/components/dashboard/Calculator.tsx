
import { useState } from "react";
import { Calculator, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { createExcelFile } from "@/utils/lazyExcel";

export default function CalculatorContent() {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();
  
  const handleDownloadExcel = async () => {
    try {
      setIsDownloading(true);
      
      // Create sample calculator data
      const calculatorData = [
        {
          "Property Type": "Hotel Room",
          "Location": "City Center",
          "Monthly Rate": 2500,
          "Occupancy Rate": "85%",
          "Annual Revenue": 25500,
          "Profit Margin": "35%"
        },
        {
          "Property Type": "Apartment",
          "Location": "Suburb",
          "Monthly Rate": 1800,
          "Occupancy Rate": "92%",
          "Annual Revenue": 19872,
          "Profit Margin": "40%"
        }
      ];
      
      // Use dynamic import for XLSX
      await createExcelFile(calculatorData, 'hotel-living-calculator.xlsx');
      
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
  
  return (
    <div className="glass-card rounded-2xl p-6 bg-[#430254]">
      <h2 className="text-xl font-bold mb-6">Hotel-Living Calculator</h2>
      <p className="text-foreground/80 mb-4">Calculate potential revenue and occupancy for your properties.</p>
      
      <div className="text-center py-12 text-muted-foreground">
        <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p className="mb-6">Our advanced calculator tool helps you project earnings based on local market data.</p>
        
        <Button 
          onClick={handleDownloadExcel} 
          className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white flex items-center gap-2 mx-auto"
          disabled={isDownloading}
        >
          {isDownloading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Downloading...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Download Excel Calculator
            </>
          )}
        </Button>
        
        <p className="text-xs mt-8 text-foreground/60">
          © {new Date().getFullYear()} Hotel-Living Calculator. All rights reserved.
          This calculator is registered and protected by copyright laws.
        </p>
      </div>
    </div>
  );
}
