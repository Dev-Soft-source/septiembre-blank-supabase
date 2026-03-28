import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface VoiceDebugEntry {
  timestamp: string;
  correlationId: string;
  scope: string;
  environment?: string;
  deploymentId?: string;
  rtMs?: number;
  error?: string;
  avatarId?: string;
  responseLength?: number;
  audioContentSize?: number;
}

export const VoiceDebugPanel: React.FC = () => {
  const [logs, setLogs] = useState<VoiceDebugEntry[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [environment, setEnvironment] = useState<string>('unknown');

  useEffect(() => {
    // Detect environment
    const hostname = window.location.hostname;
    if (hostname.includes('lovableproject.com')) {
      setEnvironment('preview');
    } else if (hostname.includes('production-domain.com')) {
      setEnvironment('production');
    } else {
      setEnvironment('local');
    }

    // Listen for voice events in console logs
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;

    const captureLog = (level: 'info' | 'error') => (message: any, ...args: any[]) => {
      // Call original function
      if (level === 'error') {
        originalConsoleError(message, ...args);
      } else {
        originalConsoleLog(message, ...args);
      }

      // Capture voice-related logs
      if (typeof message === 'string' && message.includes('voice.')) {
        try {
          const parsed = JSON.parse(message);
          if (parsed.scope?.startsWith('voice.') || parsed.scope?.startsWith('edge.') || parsed.scope?.startsWith('tts.')) {
            setLogs(prev => [...prev.slice(-19), {
              timestamp: new Date().toLocaleTimeString(),
              correlationId: parsed.correlationId || 'unknown',
              scope: parsed.scope,
              environment: parsed.environment || environment,
              deploymentId: parsed.deploymentId,
              rtMs: parsed.rtMs,
              error: parsed.error || parsed.message,
              avatarId: parsed.avatarId,
              responseLength: parsed.responseLength || parsed.textLen,
              audioContentSize: parsed.audioContentSize
            }]);
          }
        } catch (e) {
          // Not JSON, ignore
        }
      }
    };

    console.log = captureLog('info');
    console.error = captureLog('error');

    return () => {
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
    };
  }, [environment]);

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 bg-background/80 backdrop-blur-sm"
      >
        Voice Debug ({logs.length})
      </Button>
    );
  }

  const getStatusColor = (scope: string, error?: string) => {
    if (error) return 'destructive';
    if (scope.includes('error')) return 'destructive';
    if (scope.includes('complete')) return 'default';
    if (scope.includes('start')) return 'secondary';
    return 'outline';
  };

  const getPerformanceColor = (rtMs?: number) => {
    if (!rtMs) return 'outline';
    if (rtMs < 3000) return 'default';
    if (rtMs < 5000) return 'secondary';
    return 'destructive';
  };

  return (
    <Card className="fixed bottom-4 right-4 w-96 max-h-96 z-50 bg-background/95 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Voice Debug Panel</CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs">
              {environment}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLogs([])}
              className="h-6 px-2 text-xs"
            >
              Clear
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="h-6 px-2 text-xs"
            >
              ×
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 max-h-64 overflow-y-auto text-xs">
          {logs.length === 0 ? (
            <p className="text-muted-foreground">No voice events captured yet...</p>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="border-l-2 border-muted pl-2 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{log.timestamp}</span>
                  <Badge variant={getStatusColor(log.scope, log.error)} className="text-xs">
                    {log.scope}
                  </Badge>
                  {log.rtMs && (
                    <Badge variant={getPerformanceColor(log.rtMs)} className="text-xs">
                      {log.rtMs}ms
                    </Badge>
                  )}
                </div>
                <div className="text-xs space-y-1">
                  {log.avatarId && <div>Avatar: {log.avatarId}</div>}
                  {log.environment && log.environment !== 'unknown' && (
                    <div>Env: {log.environment}</div>
                  )}
                  {log.responseLength && (
                    <div>Response: {log.responseLength} chars</div>
                  )}
                  {log.audioContentSize && (
                    <div>Audio: {Math.round(log.audioContentSize / 1024)}KB</div>
                  )}
                  {log.error && (
                    <div className="text-destructive">Error: {log.error}</div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};