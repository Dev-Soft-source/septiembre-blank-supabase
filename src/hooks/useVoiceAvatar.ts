import { useState, useRef, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from '@/hooks/useTranslation';
import { toast } from 'sonner';
import { logEvt, generateCorrelationId, redactSensitive } from '@/lib/logger';
import { type AvatarId } from '@/constants/avatarVoices';
import { useIntroAudio } from '@/hooks/useIntroAudio';
import { trimResponse } from '@/utils/responseConfig';

interface VoiceMessage {
  from: 'user' | 'avatar';
  text: string;
  audioUrl?: string;
}

interface UseVoiceAvatarProps {
  avatarId: AvatarId;
  onMessage?: (message: VoiceMessage) => void;
}

export const useVoiceAvatar = ({ avatarId, onMessage }: UseVoiceAvatarProps) => {
  const { i18n } = useTranslation();
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [sessionActive, setSessionActive] = useState(false);
  const [lastInteraction, setLastInteraction] = useState<number>(Date.now());
  
  // Intro audio management
  const [waitingToRecord, setWaitingToRecord] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const sessionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioQueueRef = useRef<string[]>([]);
  const isPlayingQueueRef = useRef(false);

  // Session management - 15 minutes
  const SESSION_TIMEOUT = 15 * 60 * 1000; // 15 minutes
  const PAUSE_TIMEOUT = 60 * 1000; // 60 seconds for pause message

  // Reset session timeout
  const resetSessionTimeout = useCallback(() => {
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
    }
    
    sessionTimeoutRef.current = setTimeout(() => {
      setSessionActive(false);
      setMessages([]);
      console.log(`Session ended for avatar ${avatarId} due to inactivity`);
    }, SESSION_TIMEOUT);
  }, [avatarId]);

  // Reset pause timeout
  const resetPauseTimeout = useCallback(() => {
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }
    
    if (sessionActive) {
      pauseTimeoutRef.current = setTimeout(() => {
        sendPauseMessage();
      }, PAUSE_TIMEOUT);
    }
  }, [sessionActive]);

  // Send pause message if user is silent for 60 seconds
  const sendPauseMessage = useCallback(async () => {
    const pauseMessage = "Si me necesitas, estaré aquí."; // This will be translated by the avatar
    
    try {
      const { data, error } = await supabase.functions.invoke('google-cloud-voice-chat', {
        body: {
          messages: [],
          avatarId,
          language: i18n.language || 'es',
          userMessage: pauseMessage,
          isPauseMessage: true
        }
      });

      if (error) throw error;

      if (data.audioContent) {
        await playGoogleCloudAudio(data.audioContent);
      }
    } catch (error) {
      console.warn('Failed to send pause message:', error);
    }
  }, [avatarId, i18n.language]);

  // Actual recording function (separated from intro logic)
  const startActualRecording = useCallback(async () => {
    const correlationId = generateCorrelationId();
    console.log(`🎙️ [${correlationId}] Starting voice recording for avatar ${avatarId}`);
    logEvt("voice.start", { correlationId, avatarId, lang: i18n.language });

    try {
      console.log(`🎙️ [${correlationId}] Requesting microphone permission...`);
      
      // Check if getUserMedia is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Microphone not supported - requires HTTPS connection');
      }

      // 1) mic permission with detailed logging
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000
        } 
      });
      
      console.log(`✅ [${correlationId}] Microphone permission granted, stream tracks:`, stream.getTracks().length);
      logEvt("voice.mic.ready", { correlationId, trackCount: stream.getTracks().length });
      
      // Check MediaRecorder support
      if (!window.MediaRecorder) {
        throw new Error('MediaRecorder not supported in this browser');
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      console.log(`🎙️ [${correlationId}] MediaRecorder created, state:`, mediaRecorder.state);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        console.log(`📊 [${correlationId}] MediaRecorder.ondataavailable fired`, {
          dataSize: event.data.size,
          timecode: event.timecode,
          type: event.data.type,
          chunksCount: audioChunksRef.current.length
        });
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          console.log(`✅ [${correlationId}] Audio chunk added, total chunks:`, audioChunksRef.current.length);
        } else {
          console.warn(`⚠️ [${correlationId}] Empty audio chunk received`);
        }
      };
      
      mediaRecorder.onstop = async () => {
        console.log(`🛑 [${correlationId}] MediaRecorder.onstop fired`, {
          chunksCount: audioChunksRef.current.length,
          totalSize: audioChunksRef.current.reduce((acc, chunk) => acc + chunk.size, 0)
        });
        
        try {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          console.log(`🎵 [${correlationId}] Audio blob created`, {
            size: audioBlob.size,
            type: audioBlob.type
          });
          
          logEvt("voice.recording.complete", { correlationId, audioBlobSize: audioBlob.size });
          
          // Clear chunks immediately
          audioChunksRef.current = [];
          
          if (audioBlob.size === 0) {
            console.error(`❌ [${correlationId}] No audio data recorded`);
            toast.error('No audio was recorded. Please try again.');
            return;
          }
          
          console.log(`🚀 [${correlationId}] Processing audio...`);
          await sendVoiceMessage(audioBlob, correlationId);
          
          // Stop all tracks
          stream.getTracks().forEach(track => {
            track.stop();
            console.log(`🔇 [${correlationId}] Track stopped:`, track.kind);
          });
          
        } catch (error) {
          console.error(`❌ [${correlationId}] Error in MediaRecorder onstop:`, error);
          logEvt("voice.onstop.error", { correlationId, error: (error as Error).message }, "error");
          toast.error('Recording processing failed. Please try again.');
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error(`❌ [${correlationId}] MediaRecorder.onerror fired:`, event);
        logEvt("voice.recorder.error", { correlationId, error: event }, "error");
        toast.error("Recording failed due to technical error");
        setIsRecording(false);
      };
      
      console.log(`🎙️ [${correlationId}] Starting recording...`);
      console.log(`🎙️ [${correlationId}] MediaRecorder state before start:`, mediaRecorder.state);
      
      mediaRecorder.onstart = () => {
        console.log(`🎙️ [${correlationId}] MediaRecorder.onstart fired successfully`);
        logEvt("voice.recording.started", { correlationId });
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setSessionActive(true);
      setLastInteraction(Date.now());
      resetSessionTimeout();
      resetPauseTimeout();
      
      // Recording will continue until user stops or natural speech ends
      
      console.log(`🎙️ [${correlationId}] MediaRecorder state after start:`, mediaRecorder.state);
      
      console.log(`✅ [${correlationId}] Recording started successfully`);
      
    } catch (error) {
      console.error(`❌ [${correlationId}] Recording failed:`, error);
      logEvt("voice.mic.error", { correlationId, message: (error as Error).message }, "error");
      
      // Provide specific error messages
      let errorMessage = 'Could not access microphone';
      if ((error as Error).message.includes('Permission denied')) {
        errorMessage = 'Microphone permission denied. Please allow microphone access and try again.';
      } else if ((error as Error).message.includes('HTTPS')) {
        errorMessage = 'Microphone requires secure connection (HTTPS)';
      } else if ((error as Error).message.includes('NotFoundError')) {
        errorMessage = 'No microphone found. Please connect a microphone and try again.';
      }
      
      toast.error(errorMessage);
    }
  }, [resetSessionTimeout, resetPauseTimeout, avatarId, i18n.language]);

  // Initialize intro audio hook with proper callback
  const { isPlayingIntro, hasPlayedIntro, playIntroAudio, resetIntro } = useIntroAudio({
    avatarId,
    onIntroComplete: () => {
      console.log(`Intro complete for ${avatarId}, enabling live conversation`);
      // If user clicked mic during intro, start recording now
      if (waitingToRecord) {
        setWaitingToRecord(false);
        startActualRecording(); // Remove delay to fix immediate activation
      }
    }
  });


  // Start recording - Re-enabled automatic introduction recordings
  const startRecording = useCallback(async () => {
    console.log(`🎬 Start recording called for avatar ${avatarId}`, {
      isPlaying,
      isRecording,
      hasPlayedIntro,
      hasExistingRecorder: !!mediaRecorderRef.current
    });

    // SURGICAL FIX: Prevent multiple simultaneous recordings
    if (isRecording) {
      console.warn('⚠️ Recording already in progress, ignoring duplicate start request');
      return;
    }

    // SURGICAL FIX: Complete cleanup of any existing MediaRecorder instance
    if (mediaRecorderRef.current) {
      console.log('🧹 Cleaning up existing MediaRecorder before starting new recording');
      try {
        if (mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
        }
        if (mediaRecorderRef.current.stream) {
          mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
      } catch (error) {
        console.warn('Error cleaning up existing recorder:', error);
      }
      mediaRecorderRef.current = null;
      audioChunksRef.current = [];
    }

    // If any audio is playing, stop it and start recording immediately
    if (isPlaying) {
      console.log('🔇 Stopping current audio playback to start recording');
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
      setIsPlaying(false);
    }

    // SURGICAL FIX: Force state consistency before starting
    setIsRecording(false); // Reset to ensure clean state
    
    // ✅ RE-ENABLED: Play intro audio first if not played yet
    if (!hasPlayedIntro) {
      console.log('🎵 Playing intro audio first, then will enable recording');
      setWaitingToRecord(true);
      await playIntroAudio();
      return; // Recording will start automatically after intro completes via onIntroComplete callback
    }

    // If intro already played, start recording immediately
    console.log('🎙️ Intro already played, starting recording immediately...');
    await startActualRecording();
  }, [startActualRecording, isPlaying, avatarId, isRecording, hasPlayedIntro, playIntroAudio]);

  // Stop recording - SURGICAL FIX: Enhanced cleanup and state reset
  const stopRecording = useCallback(() => {
    const correlationId = generateCorrelationId();
    console.log(`🛑 [${correlationId}] stopRecording called, current state:`, {
      hasMediaRecorder: !!mediaRecorderRef.current,
      isRecording,
      mediaRecorderState: mediaRecorderRef.current?.state
    });
    
    // SURGICAL FIX: IMMEDIATE state change and recording cut-off enforcement
    setIsRecording(false);
    setWaitingToRecord(false); // Clear any waiting state
    
    if (mediaRecorderRef.current) {
      console.log(`🛑 [${correlationId}] Stopping MediaRecorder, current state:`, mediaRecorderRef.current.state);
      
      try {
        // SURGICAL FIX: Call mediaRecorder.stop() FIRST (instant cut-off)
        if (mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
          console.log(`🛑 [${correlationId}] MediaRecorder.stop() called successfully - NO TRAILING AUDIO`);
        }
        
        // SURGICAL FIX: INSTANTLY stop all stream tracks to prevent buffer contamination
        if (mediaRecorderRef.current.stream) {
          mediaRecorderRef.current.stream.getTracks().forEach((track, index) => {
            track.stop();
            console.log(`🔇 [${correlationId}] Track ${index} (${track.kind}) stopped INSTANTLY - no trailing capture`);
          });
        }
        
      } catch (error) {
        console.error(`❌ [${correlationId}] Error stopping MediaRecorder:`, error);
      }
      
      // SURGICAL FIX: Complete MediaRecorder cleanup after stop
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'inactive') {
          console.log(`🧹 [${correlationId}] Cleaning up MediaRecorder instance after stop`);
          mediaRecorderRef.current = null;
          audioChunksRef.current = [];
        }
      }, 100);
    }
    
    // Clear current audio to prevent interference
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    
    // SURGICAL FIX: Force state validation
    setTimeout(() => {
      if (isRecording) {
        console.warn(`⚠️ [${correlationId}] Force resetting isRecording state after cleanup`);
        setIsRecording(false);
      }
    }, 50);
  }, [isRecording]);

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

  // AUDIO FLOW CORRECTION: Enhanced playback with immediate cutoff capability
  const playGoogleCloudAudio = (base64Audio: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        const audio = new HTMLAudioElement();
        audio.src = `data:audio/mp3;base64,${base64Audio}`;
        
        // Removed: No forced audio cutoff - let audio play until natural completion
        
        audio.onended = () => {
          console.log('🔇 Audio playback ended naturally');
          setIsPlaying(false);
          currentAudioRef.current = null;
          resolve();
        };
        
        audio.onerror = (e) => {
          console.error('❌ Audio playback error:', e);
          setIsPlaying(false);
          currentAudioRef.current = null;
          reject(new Error('Audio playback failed'));
        };
        
        // Removed: No forced audio timeout - let audio play until completion
        
        audio.play().then(() => {
          console.log('🔊 Audio playback started');
          setIsPlaying(true);
          currentAudioRef.current = audio;
        }).catch((playError) => {
          reject(playError);
        });
        
      } catch (error) {
        setIsPlaying(false);
        reject(error);
      }
    });
  };

  // Process audio queue for Google Cloud TTS
  const processAudioQueue = useCallback(async () => {
    if (isPlayingQueueRef.current || audioQueueRef.current.length === 0) {
      return;
    }

    isPlayingQueueRef.current = true;
    
    while (audioQueueRef.current.length > 0) {
      const audioData = audioQueueRef.current.shift();
      if (audioData) {
        try {
          await playGoogleCloudAudio(audioData);
        } catch (error) {
          console.error('Error playing Google Cloud audio:', error);
        }
      }
    }
    
    isPlayingQueueRef.current = false;
  }, []);

  // Send voice message
  const sendVoiceMessage = useCallback(async (audioBlob: Blob, correlationId?: string) => {
    const corrId = correlationId || generateCorrelationId();
    console.log(`📤 [${corrId}] Sending voice message, blob size:`, audioBlob.size);
    setIsLoading(true);
    
    try {
      const audioBase64 = await blobToBase64(audioBlob);
      console.log(`📤 [${corrId}] Audio converted to base64, length:`, audioBase64.length);
      
      // 2) send to edge
      const t0 = performance.now();
      logEvt("voice.fetch.start", redactSensitive({ 
        correlationId: corrId, 
        audioData: audioBase64,
        lang: i18n.language,
        avatarId 
      }));

      console.log(`📤 [${corrId}] Calling google-cloud-voice-chat function...`);
      // Get current language from site language selector or browser language
      const currentLanguage = i18n.language || navigator.language?.slice(0, 2) || 'es';
      const enforceLanguage = ['es', 'en', 'pt', 'ro'].includes(currentLanguage) ? currentLanguage : 'es';

      const { data, error } = await supabase.functions.invoke('google-cloud-voice-chat', {
        body: {
          messages,
          avatarId,
          language: enforceLanguage,
          audioData: audioBase64,
          enforceLanguage: true,
          resetContext: true, // Reset context when language changes
          trimResponse: true // Enable response trimming before TTS
        },
        headers: {
          'X-Correlation-Id': corrId
        }
      });

      const rtMs = Math.round(performance.now() - t0);
      console.log(`📤 [${corrId}] Edge function response received in ${rtMs}ms`);
      logEvt("voice.fetch.done", { correlationId: corrId, rtMs, success: !error });

      if (error) {
        console.error(`❌ [${corrId}] Edge function error:`, error);
        logEvt("voice.edge.error", { correlationId: corrId, error: error.message }, "error");
        throw error;
      }

      // Response trimming applied server-side via trimResponse: true parameter

      console.log(`✅ [${corrId}] Edge function success, data:`, {
        hasResponse: !!data.response,
        hasAudioContent: !!data.audioContent,
        hasTranscription: !!data.transcribedText,
        responseLength: data.response?.length || 0
      });

      // 3) parse & process response with enhanced logging
      logEvt("voice.response.received", { 
        correlationId: corrId, 
        hasResponse: !!data.response,
        hasAudioContent: !!data.audioContent,
        hasTranscription: !!data.transcribedText,
        responseLength: data.response?.length || 0
      });

        // ENHANCED AUDIO PROCESSING: Real-time logging with environment tracking
        if (data.audioContent) {
          try {
            logEvt("voice.audio.integrated.start", { 
              correlationId: corrId,
              environment: data.metrics?.environment || 'unknown',
              totalTime: data.metrics?.totalTime || 0,
              responseLength: data.response?.length || 0
            });
            
            const audioBlob = new Blob(
              [Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))],
              { type: 'audio/mpeg' }
            );
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            
            // REAL-TIME LOGGING: Audio playback events with timestamps
            const audioStartTime = Date.now();
            
            audio.onplay = () => {
              logEvt("voice.audio.integrated.playing", { 
                correlationId: corrId,
                playbackStartMs: Date.now() - audioStartTime
              });
              setIsPlaying(true);
            };
            
            audio.onended = () => {
              logEvt("voice.audio.integrated.ended", { 
                correlationId: corrId,
                totalPlaybackMs: Date.now() - audioStartTime
              });
              setIsPlaying(false);
            };
            
            audio.onerror = (e) => {
              logEvt("voice.audio.integrated.error", { 
                correlationId: corrId, 
                error: e,
                playbackDurationMs: Date.now() - audioStartTime
              }, "error");
              setIsPlaying(false);
            };
            
            // Monitor playback progress without forced cutoff (removed 8-second limit)
            audio.ontimeupdate = () => {
              // Track progress - natural response length allowed up to 25 seconds
              logEvt("voice.audio.progress", { 
                correlationId: corrId,
                currentTime: audio.currentTime,
                duration: audio.duration
              });
            };
            
            await audio.play();
            
            logEvt("voice.reply.text", redactSensitive({ 
              correlationId: corrId, 
              text: data.response,
              hasAudio: true,
              audioSource: "google_cloud_neural_tts",
              textLen: data.response?.length || 0
            }));
            
          } catch (error) {
            logEvt("voice.audio.integrated.failed", { 
              correlationId: corrId, 
              error: (error as Error).message,
              errorType: error.constructor.name
            }, "error");
          console.error('Google Cloud Neural TTS audio failed:', error);
          setIsPlaying(false);
        }
      } else {
        // Show text response but no audio playback - Google Cloud TTS failed
        logEvt("voice.tts.no_audio_content", { 
          correlationId: corrId,
          message: "No audioContent - Google Cloud TTS failed to generate audio",
          responseText: data.response
        }, "warn");
        
        console.warn('Audio generation failed - Google Cloud TTS could not create audio');
        toast.info('Audio response unavailable - text response received');
      }

      logEvt("voice.reply.text", redactSensitive({ 
        correlationId: corrId, 
        text: data.response,
        hasAudio: !!data.audioContent 
      }));

      // Update conversation
      const userMessage: VoiceMessage = {
        from: 'user',
        text: data.transcribedText || 'Voice message'
      };

      const avatarMessage: VoiceMessage = {
        from: 'avatar',
        text: data.response,
        audioUrl: data.audioContent ? `data:audio/mp3;base64,${data.audioContent}` : undefined
      };

      const newMessages = [...messages, userMessage, avatarMessage];
      setMessages(newMessages);
      
      onMessage?.(userMessage);
      onMessage?.(avatarMessage);

      setLastInteraction(Date.now());
      resetSessionTimeout();
      resetPauseTimeout();

    } catch (error) {
      const corrId = correlationId || generateCorrelationId();
      logEvt("voice.error", { correlationId: corrId, message: (error as Error).message }, "error");
      console.error('Voice message error:', error);
      
      // User-friendly error messages with retry logic
      const getErrorMessage = () => {
        switch (i18n.language) {
          case 'en':
            return 'Voice chat temporarily unavailable. Please try again.';
          case 'pt':
            return 'Chat de voz temporariamente indisponível. Tente novamente.';
          case 'ro':
            return 'Chat vocal temporar indisponibil. Încearcă din nou.';
          default:
            return 'Chat de voz temporalmente no disponible. Inténtalo de nuevo.';
        }
      };

      toast.error(getErrorMessage());
      return { fallback: true, correlationId: corrId };
    } finally {
      setIsLoading(false);
    }
  }, [messages, avatarId, i18n.language, onMessage, resetSessionTimeout, resetPauseTimeout, processAudioQueue]);

  // Legacy text message function - disabled to prevent browser TTS
  const sendTextMessage = useCallback(async (text: string) => {
    console.warn('sendTextMessage disabled - use voice recording only for Google Cloud Neural TTS');
    toast.error('Please use voice recording for the best experience');
    return;
  }, []);

  // Stop current audio
  const stopAudio = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
      setIsPlaying(false);
    }
    // Clear audio queue
    audioQueueRef.current = [];
    isPlayingQueueRef.current = false;
  }, []);

  // End session
  const endSession = useCallback(() => {
    setSessionActive(false);
    setMessages([]);
    stopAudio();
    
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
    }
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }
    
    console.log(`Voice session ended for avatar ${avatarId}`);
  }, [avatarId, stopAudio]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      endSession();
    };
  }, [endSession]);

  return {
    isRecording, // Only show red mic when actually recording, not when waiting
    isPlaying: isPlaying || isPlayingIntro,
    isLoading,
    messages,
    sessionActive,
    hasPlayedIntro,
    isPlayingIntro,
    waitingToRecord, // Expose this state for UI feedback
    startRecording,
    stopRecording,
    sendTextMessage,
    stopAudio,
    endSession,
    resetIntro,
    lastInteraction
  };
};