import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Play, Square, TestTube, Trash2 } from 'lucide-react';
import { useVoiceChatTest } from '@/hooks/useVoiceChatTest';
import { useTranslation } from '@/hooks/useTranslation';
import { type AvatarId } from '@/constants/avatarVoices';

interface VoiceChatTestComponentProps {
  avatarId: AvatarId;
}

export const VoiceChatTestComponent: React.FC<VoiceChatTestComponentProps> = ({ avatarId }) => {
  const { i18n } = useTranslation();
  const {
    isRecording,
    isPlaying,
    isLoading,
    testResults,
    startTestRecording,
    stopTestAudio,
    clearTestResults
  } = useVoiceChatTest({ avatarId });

  const getStatusBadge = (success: boolean, stage: string) => {
    if (success) {
      return <Badge variant="default" className="bg-green-600">SUCCESS</Badge>;
    }
    
    switch (stage) {
      case 'edge_function_error':
        return <Badge variant="destructive">EDGE FUNCTION ERROR</Badge>;
      case 'tts_api_error':
        return <Badge variant="destructive">TTS API ERROR</Badge>;
      case 'audio_playback_failed':
        return <Badge variant="secondary">PLAYBACK FAILED</Badge>;
      case 'no_audio_content':
        return <Badge variant="destructive">NO AUDIO</Badge>;
      default:
        return <Badge variant="destructive">FAILED</Badge>;
    }
  };

  const getStageDescription = (stage: string) => {
    const descriptions = {
      'test_completed_with_audio': 'Complete flow successful - audio generated and played',
      'edge_function_error': 'Edge function call failed - check network/API keys',
      'tts_api_error': 'Google Cloud TTS API failed - check API key/voice config',
      'audio_playback_failed': 'TTS generated audio but browser playback failed',
      'no_audio_content': 'TTS request completed but no audio content returned',
      'unexpected_error': 'Unexpected error in test flow'
    };
    
    return descriptions[stage as keyof typeof descriptions] || `Stage: ${stage}`;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          Voice Chat Test - {avatarId.toUpperCase()}
        </CardTitle>
        <CardDescription>
          Isolated test bypassing ChatGPT - Language: {i18n.language?.toUpperCase() || 'ES'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Test Controls */}
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={startTestRecording}
            disabled={isRecording || isLoading || isPlaying}
            variant={isRecording ? "destructive" : "default"}
            className="flex items-center gap-2"
          >
            {isRecording ? (
              <>
                <MicOff className="h-4 w-4" />
                Recording (3s)...
              </>
            ) : (
              <>
                <Mic className="h-4 w-4" />
                Start Test Recording
              </>
            )}
          </Button>
          
          {isPlaying && (
            <Button
              onClick={stopTestAudio}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <Square className="h-4 w-4" />
              Stop Audio
            </Button>
          )}
          
          {testResults.length > 0 && (
            <Button
              onClick={clearTestResults}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear Results
            </Button>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-blue-800 font-medium">
              🧪 Running test: Record → TTS (skip ChatGPT) → Playback
            </p>
          </div>
        )}

        {/* Test Status */}
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className={`p-2 rounded text-center ${isRecording ? 'bg-red-100 text-red-800' : 'bg-gray-100'}`}>
            Recording: {isRecording ? 'ACTIVE' : 'IDLE'}
          </div>
          <div className={`p-2 rounded text-center ${isLoading ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100'}`}>
            Processing: {isLoading ? 'ACTIVE' : 'IDLE'}
          </div>
          <div className={`p-2 rounded text-center ${isPlaying ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
            Playback: {isPlaying ? 'PLAYING' : 'IDLE'}
          </div>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold">Test Results ({testResults.length}):</h3>
            {testResults.map((result, index) => (
              <div key={index} className="border rounded-lg p-3 bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  {getStatusBadge(result.success, result.stage)}
                  <span className="text-sm text-gray-500">
                    {result.processingTimeMs}ms
                  </span>
                </div>
                
                <p className="text-sm text-gray-700 mb-1">
                  {getStageDescription(result.stage)}
                </p>
                
                {result.error && (
                  <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
                    Error: {result.error}
                  </p>
                )}
                
                {result.response && (
                  <p className="text-sm text-green-700 bg-green-50 p-2 rounded mt-1">
                    Response: {result.response}
                  </p>
                )}
                
                {result.testMetadata && (
                  <div className="text-xs text-gray-500 mt-2">
                    Voice: {result.testMetadata.voiceUsed} | 
                    Lang: {result.testMetadata.language} | 
                    Avatar: {result.testMetadata.avatarId}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Instructions */}
        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
          <p className="font-medium mb-1">Test Process:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Click "Start Test Recording" - records 3 seconds of audio</li>
            <li>Audio sent to voice-chat-test function (bypasses ChatGPT)</li>
            <li>Fixed test text sent directly to Google Cloud TTS</li>
            <li>Generated audio played immediately in browser</li>
          </ol>
          <p className="mt-2 text-xs">
            <strong>Expected result:</strong> If audio plays, TTS pipeline works. 
            If it fails, the issue is in TTS or playback, not ChatGPT.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};