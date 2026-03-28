import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from '@/hooks/useTranslation';
import { useVoiceAvatar } from '@/hooks/useVoiceAvatar';
import { getIntroAudioPath, type AvatarId } from '@/constants/avatarVoices';

interface AudioTestResult {
  step: string;
  status: 'success' | 'error' | 'warning' | 'pending';
  details: string;
  timestamp: string;
}

interface LanguageTest {
  es: AudioTestResult[];
  en: AudioTestResult[];
  pt: AudioTestResult[];
  ro: AudioTestResult[];
}

export function CompleteAudioSystemAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<Record<AvatarId, LanguageTest> | null>(null);
  const [currentTest, setCurrentTest] = useState('');
  const { i18n } = useTranslation();

  const avatars: AvatarId[] = ['antonio', 'luisa', 'john', 'teresa', 'juan', 'ion', 'maria', 'martin'];
  const languages = ['es', 'en', 'pt', 'ro'];

  const addResult = (avatarId: AvatarId, lang: keyof LanguageTest, result: AudioTestResult) => {
    setResults(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [avatarId]: {
          ...prev[avatarId],
          [lang]: [...(prev[avatarId]?.[lang] || []), result]
        }
      };
    });
  };

  const testIntroAudioMapping = async (avatarId: AvatarId, language: string): Promise<AudioTestResult[]> => {
    const results: AudioTestResult[] = [];
    
    try {
      // Test current mapping
      const currentPath = getIntroAudioPath(avatarId, language);
      setCurrentTest(`Testing ${avatarId} ${language}: ${currentPath}`);
      
      const { data, error } = await supabase.storage
        .from('avatars-intros')
        .download(currentPath);

      if (error || !data) {
        results.push({
          step: 'Intro Audio Download',
          status: 'error',
          details: `Failed to load ${currentPath}: ${error?.message || 'No data'}`,
          timestamp: new Date().toISOString()
        });
      } else {
        results.push({
          step: 'Intro Audio Download',
          status: 'success',
          details: `Successfully loaded ${currentPath} (${data.size} bytes)`,
          timestamp: new Date().toISOString()
        });
      }
    } catch (err) {
      results.push({
        step: 'Intro Audio Download',
        status: 'error',
        details: `Exception: ${err instanceof Error ? err.message : 'Unknown error'}`,
        timestamp: new Date().toISOString()
      });
    }

    return results;
  };

  const testEdgeFunctionConnectivity = async (): Promise<AudioTestResult[]> => {
    const results: AudioTestResult[] = [];
    
    try {
      setCurrentTest('Testing Google Cloud Voice Chat function...');
      
      // Test with minimal valid request
      const { data, error } = await supabase.functions.invoke('google-cloud-voice-chat', {
        body: {
          messages: [],
          avatarId: 'antonio',
          language: 'es',
          userMessage: 'Test connectivity'
        }
      });

      if (error) {
        results.push({
          step: 'Edge Function Connectivity',
          status: 'error',
          details: `google-cloud-voice-chat error: ${error.message}`,
          timestamp: new Date().toISOString()
        });
      } else {
        results.push({
          step: 'Edge Function Connectivity',
          status: 'success',
          details: `google-cloud-voice-chat responding correctly`,
          timestamp: new Date().toISOString()
        });
      }
    } catch (err) {
      results.push({
        step: 'Edge Function Connectivity',
        status: 'error',
        details: `Exception: ${err instanceof Error ? err.message : 'Unknown error'}`,
        timestamp: new Date().toISOString()
      });
    }

    try {
      setCurrentTest('Testing Google Cloud TTS function...');
      
      const { data, error } = await supabase.functions.invoke('google-cloud-tts', {
        body: {
          text: 'Test',
          avatarId: 'antonio',
          language: 'es'
        }
      });

      if (error) {
        results.push({
          step: 'TTS Function Connectivity',
          status: 'error',
          details: `google-cloud-tts error: ${error.message}`,
          timestamp: new Date().toISOString()
        });
      } else {
        results.push({
          step: 'TTS Function Connectivity',
          status: 'success',
          details: `google-cloud-tts responding correctly`,
          timestamp: new Date().toISOString()
        });
      }
    } catch (err) {
      results.push({
        step: 'TTS Function Connectivity',
        status: 'error',
        details: `Exception: ${err instanceof Error ? err.message : 'Unknown error'}`,
        timestamp: new Date().toISOString()
      });
    }

    return results;
  };

  const testMicrophoneAccess = async (): Promise<AudioTestResult[]> => {
    const results: AudioTestResult[] = [];
    
    try {
      setCurrentTest('Testing microphone access...');
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000
        } 
      });
      
      results.push({
        step: 'Microphone Access',
        status: 'success',
        details: `Microphone access granted, ${stream.getAudioTracks().length} audio tracks`,
        timestamp: new Date().toISOString()
      });
      
      // Test MediaRecorder
      try {
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm;codecs=opus'
        });
        
        results.push({
          step: 'MediaRecorder Support',
          status: 'success',
          details: `MediaRecorder created successfully with audio/webm;codecs=opus`,
          timestamp: new Date().toISOString()
        });
        
        mediaRecorder.stop();
      } catch (err) {
        results.push({
          step: 'MediaRecorder Support',
          status: 'error',
          details: `MediaRecorder failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
          timestamp: new Date().toISOString()
        });
      }
      
      // Clean up
      stream.getTracks().forEach(track => track.stop());
      
    } catch (err) {
      results.push({
        step: 'Microphone Access',
        status: 'error',
        details: `Microphone access denied: ${err instanceof Error ? err.message : 'Unknown error'}`,
        timestamp: new Date().toISOString()
      });
    }

    return results;
  };

  const runCompleteAnalysis = async () => {
    setIsAnalyzing(true);
    setResults({} as Record<AvatarId, LanguageTest>);
    setCurrentTest('Starting comprehensive analysis...');

    try {
      // Initialize results structure
      const initialResults: Record<AvatarId, LanguageTest> = {} as Record<AvatarId, LanguageTest>;
      for (const avatar of avatars) {
        initialResults[avatar] = { es: [], en: [], pt: [], ro: [] };
      }
      setResults(initialResults);

      // Test system-wide components
      const micResults = await testMicrophoneAccess();
      const edgeResults = await testEdgeFunctionConnectivity();
      
      // Add system results to first avatar for display
      micResults.forEach(result => addResult('antonio', 'es', result));
      edgeResults.forEach(result => addResult('antonio', 'es', result));

      // Test each avatar in each language
      for (const avatar of avatars) {
        for (const lang of languages) {
          setCurrentTest(`Testing ${avatar} in ${lang}...`);
          
          const introResults = await testIntroAudioMapping(avatar, lang);
          introResults.forEach(result => addResult(avatar, lang as keyof LanguageTest, result));

          // Brief delay to prevent overwhelming the system
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      setCurrentTest('Analysis complete!');
    } catch (error) {
      console.error('Analysis failed:', error);
      setCurrentTest(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getStatusColor = (status: AudioTestResult['status']) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      case 'pending': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: AudioTestResult['status']) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'pending': return '⏳';
      default: return '?';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Complete Avatar Audio System Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              onClick={runCompleteAnalysis} 
              disabled={isAnalyzing}
              className="w-full"
            >
              {isAnalyzing ? 'Analyzing...' : 'Run Complete Analysis'}
            </Button>
            
            {isAnalyzing && (
              <div className="text-sm text-gray-600 p-2 bg-blue-50 rounded">
                Current Test: {currentTest}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {results && (
        <div className="space-y-4">
          {avatars.map(avatar => (
            <Card key={avatar}>
              <CardHeader>
                <CardTitle className="text-lg">{avatar.toUpperCase()}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {languages.map(lang => (
                    <div key={`${avatar}-${lang}`} className="space-y-2">
                      <h4 className="font-semibold text-center">{lang.toUpperCase()}</h4>
                      <div className="space-y-1">
                        {results[avatar]?.[lang as keyof LanguageTest]?.map((result, index) => (
                          <div 
                            key={index} 
                            className="text-xs p-2 border rounded"
                          >
                            <div className={`font-medium ${getStatusColor(result.status)}`}>
                              {getStatusIcon(result.status)} {result.step}
                            </div>
                            <div className="text-gray-600 mt-1">{result.details}</div>
                            <div className="text-gray-400 text-xs mt-1">
                              {new Date(result.timestamp).toLocaleTimeString()}
                            </div>
                          </div>
                        )) || []}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}