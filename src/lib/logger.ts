/**
 * Structured logging utility for voice chat diagnostics
 * Provides consistent JSON-formatted logging across client and server
 */

export type LogLevel = "info" | "warn" | "error";

interface LogEntry {
  ts: string;
  level: LogLevel;
  scope: string;
  [key: string]: unknown;
}

/**
 * Log event with structured format
 * @param scope - Logical scope like 'voice.start', 'voice.mic.ready'
 * @param data - Additional structured data (correlationId, durations, etc.)
 * @param level - Log level (info, warn, error)
 */
export function logEvt(
  scope: string, 
  data: Record<string, unknown>, 
  level: LogLevel = "info"
): LogEntry {
  const entry: LogEntry = { 
    ts: new Date().toISOString(), 
    level, 
    scope, 
    ...data 
  };
  
  // Console for now; can POST to /logs later if needed
  // Force console.warn for voice chat events to ensure visibility in DevTools
  // eslint-disable-next-line no-console
  if (scope.startsWith("voice.")) {
    console.warn(JSON.stringify(entry));
  } else {
    const consoleMethod = level === "error" ? "error" : level;
    console[consoleMethod](JSON.stringify(entry));
  }
  
  return entry;
}

/**
 * Redact sensitive information from logs
 */
export function redactSensitive(data: Record<string, unknown>): Record<string, unknown> {
  const redacted = { ...data };
  
  // Redact API keys
  if (typeof redacted.apiKey === 'string') {
    redacted.apiKey = `***${redacted.apiKey.slice(-4)}`;
  }
  
  // Redact full text content, keep only length
  if (typeof redacted.text === 'string') {
    redacted.textLen = redacted.text.length;
    delete redacted.text;
  }
  
  // Redact audio data, keep only metadata
  if (typeof redacted.audioData === 'string') {
    redacted.audioDataLen = redacted.audioData.length;
    delete redacted.audioData;
  }
  
  return redacted;
}

/**
 * Generate correlation ID for tracking requests
 */
export function generateCorrelationId(): string {
  // Using crypto.randomUUID if available, fallback to timestamp-based UUID
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback UUID v4 generation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
