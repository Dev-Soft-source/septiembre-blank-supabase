import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from '@/hooks/useTranslation';
import { toast } from 'sonner';
import { type AvatarId } from '@/constants/avatarVoices';

interface VoiceChatTestResult {
  success: boolean;
  stage: string;
  processingTimeMs: number;
  error?: string;
  audioContent?: string;
  response?: string;
  testMetadata?: {
    avatarId: string;
    language: string;
    voiceUsed: string;
    processingTimeMs: number;
  };
}

interface UseVoiceChatTestProps {
  avatarId: AvatarId;
}

export const useVoiceChatTest = ({ avatarId }: UseVoiceChatTestProps) => {
  const { i18n } = useTranslation();
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<VoiceChatTestResult[]>([]);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Convert audio blob to base64
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); // Remove data:audio/webm;base64, prefix
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Play audio from base64 MP3 data
  const playTestAudio = (base64Audio: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        const audio = new HTMLAudioElement();
        audio.src = `data:audio/mp3;base64,${base64Audio}`;
        
        audio.onended = () => {
          setIsPlaying(false);
          resolve();
        };
        
        audio.onerror = () => {
          setIsPlaying(false);
          reject(new Error('Audio playback failed'));
        };
        
        audio.play().then(() => {
          setIsPlaying(true);
          currentAudioRef.current = audio;
        }).catch(reject);
        
      } catch (error) {
        setIsPlaying(false);
        reject(error);
      }
    });
  };

  // Start 3-second test recording
  const startTestRecording = useCallback(async () => {
    console.log(`🧪 TEST: Starting 3-second recording for ${avatarId} in ${i18n.language}`);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000
        } 
      });
      
      console.log('🧪 TEST: Microphone access granted');
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        console.log(`🧪 TEST: Recording complete, blob size: ${audioBlob.size} bytes`);
        await runVoiceChatTest(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      // Stop recording after 3 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current && isRecording) {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
          console.log('🧪 TEST: 3-second recording timer completed');
        }
      }, 3000);
      
    } catch (error) {
      console.error('🧪 TEST: Error starting recording:', error);
      toast.error('Could not access microphone for test');
    }
  }, [avatarId, i18n.language]);

  // Run the actual test bypassing ChatGPT
  const runVoiceChatTest = useCallback(async (audioBlob: Blob) => {
    console.log(`🧪 TEST: Running voice chat test for ${avatarId} in ${i18n.language}`);
    setIsLoading(true);
    
    const testStartTime = performance.now();
    
    try {
      const audioBase64 = await blobToBase64(audioBlob);
      console.log(`🧪 TEST: Audio converted to base64, length: ${audioBase64.length}`);
      
      console.log('🧪 TEST: Calling voice-chat-test edge function (bypassing ChatGPT)');
      const { data, error } = await supabase.functions.invoke('voice-chat-test', {
        body: {
          avatarId,
          language: i18n.language || 'es',
          audioData: audioBase64
        }
      });

      const totalTime = Math.round(performance.now() - testStartTime);
      
      if (error) {
        console.error('🧪 TEST: Edge function error:', error);
        const failResult: VoiceChatTestResult = {
          success: false,
          stage: 'edge_function_error',
          processingTimeMs: totalTime,
          error: error.message
        };
        setTestResults(prev => [...prev, failResult]);
        toast.error(`Test failed: ${error.message}`);
        return;
      }

      console.log('🧪 TEST: Edge function response received:', data);
      
      if (data.success && data.audioContent) {
        console.log('🧪 TEST: Audio content received, attempting playback');
        
        try {
          await playTestAudio(data.audioContent);
          
          const successResult: VoiceChatTestResult = {
            success: true,
            stage: 'test_completed_with_audio',
            processingTimeMs: totalTime,
            audioContent: data.audioContent,
            response: data.response,
            testMetadata: data.testMetadata
          };
          
          setTestResults(prev => [...prev, successResult]);
          
          console.log('🧪 TEST: SUCCESS - Audio played successfully!');
          toast.success(`Test successful! Processing time: ${totalTime}ms`);
          
        } catch (playbackError) {
          console.error('🧪 TEST: Audio playback failed:', playbackError);
          
          const playbackFailResult: VoiceChatTestResult = {
            success: false,
            stage: 'audio_playback_failed',
            processingTimeMs: totalTime,
            error: `Playback failed: ${playbackError.message}`,
            audioContent: data.audioContent,
            response: data.response
          };
          
          setTestResults(prev => [...prev, playbackFailResult]);
          toast.error(`Audio generation OK, but playback failed: ${playbackError.message}`);
        }
      } else {
        console.error('🧪 TEST: No audio content in response:', data);
        
        const noAudioResult: VoiceChatTestResult = {
          success: false,
          stage: data.stage || 'no_audio_content',
          processingTimeMs: totalTime,
          error: data.error || 'No audio content generated',
          response: data.response
        };
        
        setTestResults(prev => [...prev, noAudioResult]);
        toast.error(`Test failed: ${data.error || 'No audio content generated'}`);
      }

    } catch (error) {
      const totalTime = Math.round(performance.now() - testStartTime);
      console.error('🧪 TEST: Unexpected error:', error);
      
      const unexpectedErrorResult: VoiceChatTestResult = {
        success: false,
        stage: 'unexpected_error',
        processingTimeMs: totalTime,
        error: error.message
      };
      
      setTestResults(prev => [...prev, unexpectedErrorResult]);
      toast.error(`Unexpected test error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [avatarId, i18n.language]);

  // Stop current audio
  const stopTestAudio = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
      setIsPlaying(false);
    }
  }, []);

  // Clear test results
  const clearTestResults = useCallback(() => {
    setTestResults([]);
  }, []);

  return {
    isRecording,
    isPlaying,
    isLoading,
    testResults,
    startTestRecording,
    stopTestAudio,
    clearTestResults
  };
};