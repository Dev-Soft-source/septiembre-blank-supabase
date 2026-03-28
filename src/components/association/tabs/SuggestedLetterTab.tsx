import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Download, FileText } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/hooks/use-toast';

export const SuggestedLetterTab = () => {
  const { t } = useTranslation('associationLetter');
  const { toast } = useToast();

  const handleCopyText = async () => {
    try {
      const fullText = `${t('associationLetter.subject')}\n\n${t('associationLetter.content')}`;
      await navigator.clipboard.writeText(fullText);
      toast({
        title: t('associationLetter.copySuccess'),
        description: "El texto ha sido copiado y está listo para ser pegado en su email o sistema de comunicación.",
      });
    } catch (err) {
      console.error('Failed to copy text: ', err);
      toast({
        title: "Error",
        description: "No se pudo copiar el texto. Intente seleccionar y copiar manualmente.",
        variant: "destructive"
      });
    }
  };

  const handleDownloadWord = () => {
    const fullText = `${t('associationLetter.subject')}\n\n${t('associationLetter.content')}`;
    
    // Create a simple HTML structure for Word document
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Carta Sugerida para Hoteles</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
          .subject { font-weight: bold; margin-bottom: 20px; }
          .content { white-space: pre-line; }
        </style>
      </head>
      <body>
        <div class="subject">${t('associationLetter.subject')}</div>
        <div class="content">${t('associationLetter.content')}</div>
      </body>
      </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'carta-sugerida-hoteles.doc';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Descarga iniciada",
      description: "El documento Word se está descargando.",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-[0_0_20px_rgba(0,200,255,0.3)]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {t('associationLetter.title')}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              onClick={handleCopyText}
              className="bg-white/20 hover:bg-white/30 text-white border-white/20 transition-all duration-300 hover:scale-105"
              variant="outline"
            >
              <Copy className="w-4 h-4 mr-2" />
              {t('associationLetter.copyButton')}
            </Button>
            <Button
              onClick={handleDownloadWord}
              className="bg-white/20 hover:bg-white/30 text-white border-white/20 transition-all duration-300 hover:scale-105"
              variant="outline"
            >
              <Download className="w-4 h-4 mr-2" />
              {t('associationLetter.downloadButton')}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="text-white">
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <div className="space-y-4">
              <div className="font-semibold text-cyan-200 border-b border-white/20 pb-2">
                {t('associationLetter.subject')}
              </div>
              <div className="whitespace-pre-line leading-relaxed text-white/90">
                {t('associationLetter.content')}
              </div>
            </div>
          </div>
          <div className="mt-4 text-sm text-white/70 bg-white/5 rounded-lg p-4 border border-white/10">
            <p className="mb-2">
              <strong>📋 Instrucciones de uso:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Este texto puede ser copiado y pegado directamente en su sistema de email</li>
              <li>Personalice [Nombre de la Asociación] con el nombre de su asociación</li>
              <li>Reemplace [Nombre del responsable] y [Cargo] con sus datos</li>
              <li>El código de asociación debe ser proporcionado por Hotel Living</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};