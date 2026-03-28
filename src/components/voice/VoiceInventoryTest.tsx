import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Play, Download, CheckCircle, XCircle, Loader2 } from 'lucide-react';
interface TestedVoice {
  voiceName: string;
  displayName: string;
  detectedGender: string;
  languageCode: string;
  supportedLanguages: string[];
  testResults: {
    [languageCode: string]: {
      text: string;
      audioBase64: string;
      success: boolean;
      error?: string;
    };
  };
  isMultilingual: boolean;
  recommended: boolean;
}
interface VoiceInventoryData {
  summary: {
    totalVoicesFound: number;
    relevantVoices: number;
    testedVoices: number;
    multilingualVoices: number;
    recommendedMaleVoices: number;
    recommendedFemaleVoices: number;
    timestamp: string;
  };
  testedVoices: TestedVoice[];
  recommendedAssignments: {
    maleVoices: TestedVoice[];
    femaleVoices: TestedVoice[];
  };
}
export function VoiceInventoryTest() {
  const [isRunning, setIsRunning] = useState(false);
  const [inventoryData, setInventoryData] = useState<VoiceInventoryData | null>(null);
  const [selectedVoices, setSelectedVoices] = useState<Set<string>>(new Set());
  const runVoiceInventory = async () => {
    setIsRunning(true);
    try {
      toast.info('🔍 Starting comprehensive voice inventory...');
      const {
        data,
        error
      } = await supabase.functions.invoke('voice-inventory');
      if (error) throw error;
      if (!data.success) throw new Error(data.error);
      setInventoryData(data);
      toast.success(`✅ Voice inventory complete! Found ${data.summary.multilingualVoices} multilingual voices`);
    } catch (error) {
      console.error('Voice inventory error:', error);
      toast.error(`❌ Voice inventory failed: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };
  const playAudio = (audioBase64: string, voiceName: string, language: string) => {
    try {
      const audioBlob = new Blob([Uint8Array.from(atob(audioBase64), c => c.charCodeAt(0))], {
        type: 'audio/mp3'
      });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play().then(() => {
        toast.success(`🔊 Playing ${voiceName} in ${language.toUpperCase()}`);
      }).catch(err => {
        toast.error(`❌ Failed to play audio: ${err.message}`);
      });
      audio.onended = () => URL.revokeObjectURL(audioUrl);
    } catch (error) {
      toast.error(`❌ Audio error: ${error.message}`);
    }
  };
  const toggleVoiceSelection = (voiceName: string) => {
    const newSelected = new Set(selectedVoices);
    if (newSelected.has(voiceName)) {
      newSelected.delete(voiceName);
    } else {
      newSelected.add(voiceName);
    }
    setSelectedVoices(newSelected);
  };
  const generateFinalAssignments = () => {
    if (!inventoryData) return;
    const selectedVoicesList = inventoryData.testedVoices.filter(v => selectedVoices.has(v.voiceName));
    const maleVoices = selectedVoicesList.filter(v => v.detectedGender === 'male');
    const femaleVoices = selectedVoicesList.filter(v => v.detectedGender === 'female');
    console.log('Final voice assignments:', {
      male: maleVoices.map(v => v.voiceName),
      female: femaleVoices.map(v => v.voiceName)
    });
    toast.success(`📋 Generated assignments: ${maleVoices.length} male, ${femaleVoices.length} female voices`);
  };
  if (!inventoryData) {
    return <Card className="w-full max-w-4xl mx-auto">
        
        
      </Card>;
  }
  return <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>📊 Voice Inventory Summary</CardTitle>
          <CardDescription>
            Completed at {new Date(inventoryData.summary.timestamp).toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{inventoryData.summary.totalVoicesFound}</div>
              <div className="text-sm text-muted-foreground">Total Voices</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{inventoryData.summary.multilingualVoices}</div>
              <div className="text-sm text-muted-foreground">Multilingual</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{inventoryData.summary.recommendedMaleVoices}</div>
              <div className="text-sm text-muted-foreground">Male Voices</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{inventoryData.summary.recommendedFemaleVoices}</div>
              <div className="text-sm text-muted-foreground">Female Voices</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{selectedVoices.size}</div>
              <div className="text-sm text-muted-foreground">Selected</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Voice Testing Tabs */}
      <Tabs defaultValue="recommended" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="recommended">✅ Recommended</TabsTrigger>
          <TabsTrigger value="male">👨 Male Voices</TabsTrigger>
          <TabsTrigger value="female">👩 Female Voices</TabsTrigger>
          <TabsTrigger value="all">📋 All Tested</TabsTrigger>
        </TabsList>

        <TabsContent value="recommended" className="space-y-4">
          <div className="grid gap-4">
            {inventoryData.testedVoices.filter(voice => voice.recommended).map(voice => <VoiceTestCard key={voice.voiceName} voice={voice} isSelected={selectedVoices.has(voice.voiceName)} onToggleSelection={() => toggleVoiceSelection(voice.voiceName)} onPlayAudio={playAudio} />)}
          </div>
        </TabsContent>

        <TabsContent value="male" className="space-y-4">
          <div className="grid gap-4">
            {inventoryData.testedVoices.filter(voice => voice.detectedGender === 'male').map(voice => <VoiceTestCard key={voice.voiceName} voice={voice} isSelected={selectedVoices.has(voice.voiceName)} onToggleSelection={() => toggleVoiceSelection(voice.voiceName)} onPlayAudio={playAudio} />)}
          </div>
        </TabsContent>

        <TabsContent value="female" className="space-y-4">
          <div className="grid gap-4">
            {inventoryData.testedVoices.filter(voice => voice.detectedGender === 'female').map(voice => <VoiceTestCard key={voice.voiceName} voice={voice} isSelected={selectedVoices.has(voice.voiceName)} onToggleSelection={() => toggleVoiceSelection(voice.voiceName)} onPlayAudio={playAudio} />)}
          </div>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4">
            {inventoryData.testedVoices.map(voice => <VoiceTestCard key={voice.voiceName} voice={voice} isSelected={selectedVoices.has(voice.voiceName)} onToggleSelection={() => toggleVoiceSelection(voice.voiceName)} onPlayAudio={playAudio} />)}
          </div>
        </TabsContent>
      </Tabs>

      {/* Final Assignment Button */}
      {selectedVoices.size > 0 && <Card>
          <CardContent className="pt-6">
            <Button onClick={generateFinalAssignments} className="w-full">
              🔒 Generate Final Voice Assignments ({selectedVoices.size} selected)
            </Button>
          </CardContent>
        </Card>}
    </div>;
}
interface VoiceTestCardProps {
  voice: TestedVoice;
  isSelected: boolean;
  onToggleSelection: () => void;
  onPlayAudio: (audioBase64: string, voiceName: string, language: string) => void;
}
function VoiceTestCard({
  voice,
  isSelected,
  onToggleSelection,
  onPlayAudio
}: VoiceTestCardProps) {
  return <Card className={`${isSelected ? 'ring-2 ring-primary' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{voice.voiceName}</CardTitle>
            <CardDescription>{voice.displayName}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={voice.detectedGender === 'male' ? 'default' : 'secondary'}>
              {voice.detectedGender === 'male' ? '👨' : '👩'} {voice.detectedGender}
            </Badge>
            {voice.isMultilingual && <Badge variant="outline">🌍 Multilingual</Badge>}
            {voice.recommended && <Badge className="bg-green-100 text-green-800">✅ Recommended</Badge>}
            <Button variant={isSelected ? "default" : "outline"} size="sm" onClick={onToggleSelection}>
              {isSelected ? '✅ Selected' : 'Select'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['es', 'en', 'pt', 'ro'].map(lang => {
          const result = voice.testResults[lang];
          return <div key={lang} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{lang.toUpperCase()}</span>
                  {result?.success ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                </div>
                {result?.success && result.audioBase64 && <Button variant="outline" size="sm" className="w-full" onClick={() => onPlayAudio(result.audioBase64, voice.voiceName, lang)}>
                    <Play className="h-3 w-3 mr-1" />
                    Play
                  </Button>}
                {result?.error && <div className="text-xs text-red-500 truncate" title={result.error}>
                    Error
                  </div>}
              </div>;
        })}
        </div>
      </CardContent>
    </Card>;
}