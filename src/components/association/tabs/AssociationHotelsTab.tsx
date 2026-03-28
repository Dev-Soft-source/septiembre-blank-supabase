
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export const AssociationHotelsTab = () => {
  const { t } = useTranslation('associationDashboard');
  const [csvData, setCsvData] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setCsvData(text);
      };
      reader.readAsText(selectedFile);
    }
  };

  const processCsvData = () => {
    if (!csvData.trim()) {
      alert(t('hotels.provideCsvData'));
      return;
    }
    
    // TODO: Process CSV data
    console.log('Processing CSV data:', csvData);
    alert(t('hotels.processingCsvData'));
  };

  return (
    <div className="space-y-6">
      <Card className="glass-card border-blue-500/20 bg-slate-700/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Upload className="w-5 h-5 text-blue-400" />
            {t('hotels.uploadHotelList')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Upload Area */}
          <div className="border-2 border-dashed border-blue-400/30 rounded-lg p-8 text-center bg-slate-800/20">
            <FileText className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <p className="text-white mb-2">{t('hotels.dragDropCsv')}</p>
            <p className="text-slate-400 text-sm mb-4">{t('hotels.expectedFormat')}</p>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              id="csv-upload"
            />
            <Button
              onClick={() => document.getElementById('csv-upload')?.click()}
              variant="outline"
              className="bg-transparent border-blue-400 text-blue-400 hover:bg-blue-400/10"
            >
              {t('hotels.selectCsvFile')}
            </Button>
          </div>

          {/* Manual CSV Input */}
          <div className="space-y-2">
            <label className="text-white font-medium">{t('hotels.pasteCsvData')}</label>
            <Textarea
              value={csvData}
              onChange={(e) => setCsvData(e.target.value)}
              placeholder="hotel_name,city,contact_email&#10;Hotel Example,Madrid,contact@hotel.com"
              className="bg-slate-800/50 border-blue-500/20 text-white placeholder-slate-400 min-h-[120px] font-mono text-sm"
            />
          </div>

          <Button
            onClick={processCsvData}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            <FileText className="w-4 h-4 mr-2" />
            {t('hotels.processData')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
