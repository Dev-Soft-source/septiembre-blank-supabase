import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { HotelStarfield } from '@/components/hotels/HotelStarfield';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function PromoterCardGenerator() {
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const { profile } = useAuth();
  const { toast } = useToast();
  const cardRef = useRef<HTMLDivElement>(null);

  const [cardData, setCardData] = useState({
    name: profile?.first_name && profile?.last_name ? `${profile.first_name} ${profile.last_name}` : '',
    referralCode: '',
    phone: '',
    email: profile?.email || '',
    footerText: t('card_generator.default_footer', { ns: 'promotor-local' })
  });

  const handleDownloadPDF = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: '#ffffff'
      });
      
      const pdf = new jsPDF('portrait', 'mm', 'a4');
      const pageWidth = 210;
      const pageHeight = 297;
      const cardWidth = 85;
      const cardHeight = 55;
      const cols = 2;
      const rows = 5;
      const marginX = (pageWidth - (cols * cardWidth)) / 2;
      const marginY = (pageHeight - (rows * cardHeight)) / 2;

      const imgData = canvas.toDataURL('image/png');

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = marginX + (col * cardWidth);
          const y = marginY + (row * cardHeight);
          pdf.addImage(imgData, 'PNG', x, y, cardWidth, cardHeight);
        }
      }

      pdf.save('business-cards.pdf');
      toast({
        title: "Success",
        description: "Business cards downloaded successfully!"
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <HotelStarfield />
      <Navbar />
      
      <main className="flex-1 pt-16">
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <div className="bg-[#630297]/90 backdrop-blur-sm rounded-lg p-8 text-white">
            <div className="flex items-center gap-4 mb-8">
              <Button
                onClick={() => navigate('/promoter/dashboard')}
                variant="outline"
                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-3xl font-bold">
                {t('card_generator.title', { ns: 'promotor-local' })}
              </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Live Preview */}
              <div>
                <h2 className="text-xl font-bold mb-4">
                  {t('card_generator.live_preview', { ns: 'promotor-local' })}
                </h2>
                <div ref={cardRef} className="bg-gradient-to-br from-white to-purple-50 p-0 rounded-xl shadow-xl overflow-hidden border-2 border-purple-200" style={{ width: '340px', height: '220px' }}>
                  {/* Header with logo */}
                  <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 p-2 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-transparent"></div>
                    <div className="absolute top-0 right-0 w-12 h-12 bg-white/10 rounded-full -translate-y-4 translate-x-4"></div>
                    <div className="absolute bottom-0 left-0 w-10 h-10 bg-white/5 rounded-full translate-y-3 -translate-x-2"></div>
                    <div className="relative z-10 flex items-center justify-center">
                      <img 
                        src="/lovable-uploads/bf7cca89-2cb5-4524-95aa-ec197603cdcf.png" 
                        alt="Hotel-Living Logo" 
                        className="h-12 w-auto object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const fallback = document.createElement('div');
                          fallback.className = 'flex items-center bg-white/15 rounded-lg px-2 py-1';
                          fallback.innerHTML = '<div class="w-4 h-4 bg-white rounded text-purple-600 flex items-center justify-center text-xs font-bold mr-2">HL</div><div><div class="font-bold text-sm leading-tight">Hotel-Living</div><div class="text-xs opacity-90 italic">The Art of Living</div></div>';
                          e.currentTarget.parentNode?.appendChild(fallback);
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Content exactly matching reference */}
                  <div className="p-3 pt-1 text-purple-800">
                    {/* Website URL */}
                    <div className="text-center mb-3">
                      <div className="text-sm text-purple-600 font-medium">www.hotel-living.com</div>
                    </div>
                    
                    {/* Name and Code aligned on same baseline */}
                    <div className="flex justify-between items-baseline mb-3">
                      <div className="font-bold text-base text-purple-900 uppercase whitespace-pre">{cardData.name}</div>
                      <div className="text-sm text-purple-700 whitespace-pre">Code: {cardData.referralCode}</div>
                    </div>
                    
                    {/* Phone and email centered on same line with phone icon */}
                    <div className="flex justify-center gap-4 mb-4">
                      <div className="text-sm text-purple-700 flex items-center whitespace-pre">
                        <span className="text-red-500 mr-1">📞</span>
                        {cardData.phone || '5555555555'}
                      </div>
                      <div className="text-sm text-purple-700 whitespace-pre">
                        {cardData.email || 'grand_soiree@yahoo.com'}
                      </div>
                    </div>
                    
                    {/* Footer text */}
                    <div className="text-xs text-purple-600 text-center leading-tight whitespace-pre-line">
                      {cardData.footerText}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Data Form */}
              <div>
                <h2 className="text-xl font-bold mb-4">
                  {t('card_generator.card_data', { ns: 'promotor-local' })}
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t('card_generator.name', { ns: 'promotor-local' })}
                    </label>
                    <Input
                      value={cardData.name}
                      onChange={(e) => setCardData({...cardData, name: e.target.value})}
                      className="bg-white/10 border-white/30 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t('card_generator.referral_code', { ns: 'promotor-local' })}
                    </label>
                    <Input
                      value={cardData.referralCode}
                      onChange={(e) => setCardData({...cardData, referralCode: e.target.value})}
                      className="bg-white/10 border-white/30 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t('card_generator.phone', { ns: 'promotor-local' })}
                    </label>
                    <Input
                      value={cardData.phone}
                      onChange={(e) => setCardData({...cardData, phone: e.target.value})}
                      className="bg-white/10 border-white/30 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t('card_generator.email', { ns: 'promotor-local' })}
                    </label>
                    <Input
                      value={cardData.email}
                      onChange={(e) => setCardData({...cardData, email: e.target.value})}
                      className="bg-white/10 border-white/30 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t('card_generator.footer_text', { ns: 'promotor-local' })}
                    </label>
                    <Textarea
                      value={cardData.footerText}
                      onChange={(e) => setCardData({...cardData, footerText: e.target.value})}
                      className="bg-white/10 border-white/30 text-white"
                      rows={3}
                    />
                  </div>
                  <Button
                    onClick={handleDownloadPDF}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {t('card_generator.download_cards', { ns: 'promotor-local' })}
                  </Button>
                  <p className="text-sm text-white/70">
                    {t('card_generator.download_description', { ns: 'promotor-local' })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}