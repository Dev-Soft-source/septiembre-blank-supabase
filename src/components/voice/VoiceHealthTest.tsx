import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { logEvt, generateCorrelationId } from "@/lib/logger";
import { toast } from "sonner";

interface VoiceHealthTestProps {
  className?: string;
}

export function VoiceHealthTest({ className }: VoiceHealthTestProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);

  const runVoiceTest = async () => {
    const correlationId = generateCorrelationId();
    setIsRunning(true);
    setLastResult(null);

    try {
      logEvt("voice.test.start", { correlationId });

      // 1. Test microphone permission
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        logEvt("voice.test.mic.ok", { correlationId });
        stream.getTracks().forEach(track => track.stop()); // Clean up
      } catch (e) {
        logEvt("voice.test.mic.fail", { correlationId, error: (e as Error).message }, "error");
        throw new Error("Microphone permission denied");
      }

      // 2. Test health endpoint
      const { data: healthData, error: healthError } = await supabase.functions.invoke('voice-health');
      
      if (healthError) {
        logEvt("voice.test.health.fail", { correlationId, error: healthError.message }, "error");
        throw new Error("Health check failed");
      }

      logEvt("voice.test.health.ok", { correlationId, health: healthData });

      // 3. Test voice chat edge function
      const { data: voiceData, error: voiceError } = await supabase.functions.invoke('google-cloud-voice-chat', {
        body: {
          messages: [],
          avatarId: 'maria',
          language: 'es',
          userMessage: 'Test message'
        },
        headers: {
          'X-Correlation-Id': correlationId
        }
      });

      if (voiceError) {
        logEvt("voice.test.edge.fail", { correlationId, error: voiceError.message }, "error");
        throw new Error("Voice chat test failed");
      }

      logEvt("voice.test.edge.ok", { correlationId, response: voiceData });

      // 4. Test TTS (Web Speech API)
      if (voiceData.response) {
        try {
          const utterance = new SpeechSynthesisUtterance("Test OK");
          utterance.lang = 'es-ES';
          
          utterance.onstart = () => logEvt("voice.test.tts.start", { correlationId });
          utterance.onend = () => logEvt("voice.test.tts.end", { correlationId });
          utterance.onerror = (e) => logEvt("voice.test.tts.error", { correlationId, error: e.error }, "error");
          
          speechSynthesis.speak(utterance);
          logEvt("voice.test.tts.ok", { correlationId });
        } catch (e) {
          logEvt("voice.test.tts.fail", { correlationId, error: (e as Error).message }, "error");
        }
      }

      logEvt("voice.test.complete", { correlationId });
      setLastResult(`✅ Voice test completed successfully. Correlation ID: ${correlationId}`);
      toast.success("Voice test completed successfully!");

    } catch (error) {
      logEvt("voice.test.error", { correlationId, message: (error as Error).message }, "error");
      setLastResult(`❌ Voice test failed: ${(error as Error).message}. Correlation ID: ${correlationId}`);
      toast.error(`Voice test failed: ${(error as Error).message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className={className}>
      <Button 
        onClick={runVoiceTest} 
        disabled={isRunning}
        variant="outline"
        size="sm"
      >
        {isRunning ? "Running voice test..." : "Voice self-test"}
      </Button>
      {lastResult && (
        <div className="mt-2 text-xs text-muted-foreground font-mono">
          {lastResult}
        </div>
      )}
    </div>
  );
}