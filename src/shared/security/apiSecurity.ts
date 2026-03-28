/**
 * API Security Layer with Request Signing and Validation
 * Implements API key validation, request signing, and replay protection
 */
import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

interface SecureRequest extends Request {
  apiKeyValid?: boolean;
  signatureValid?: boolean;
}

export class ApiSecurity {
  private static readonly VALID_API_KEYS = new Set([
    process.env.HOTEL_API_KEY || 'hotel-living-api-key-2024',
    process.env.ADMIN_API_KEY || 'admin-api-key-2024'
  ]);
  
  private static readonly REQUEST_WINDOW = 5 * 60 * 1000; // 5 minutes
  private static readonly recentNonces = new Set<string>();
  
  // Cleanup old nonces periodically
  static {
    setInterval(() => {
      ApiSecurity.recentNonces.clear();
    }, ApiSecurity.REQUEST_WINDOW);
  }
  
  /**
   * Validate API Key from X-API-Key header
   */
  static validateApiKey(req: SecureRequest, res: Response, next: NextFunction): void {
    const apiKey = req.get('X-API-Key');
    
    if (!apiKey) {
      res.status(401).json({ 
        error: 'API key required',
        code: 'MISSING_API_KEY'
      });
      return;
    }
    
    if (!ApiSecurity.VALID_API_KEYS.has(apiKey)) {
      // Log security event
      const SecurityMonitor = require('./securityMonitor').SecurityMonitor;
      SecurityMonitor.logSecurityEvent('invalid_api_key', 'high', {
        ip: req.ip,
        apiKey: apiKey.substring(0, 8) + '...',
        endpoint: req.path
      });
      
      res.status(401).json({ 
        error: 'Invalid API key',
        code: 'INVALID_API_KEY'
      });
      return;
    }
    
    req.apiKeyValid = true;
    next();
  }
  
  /**
   * Validate request signature and prevent replay attacks
   */
  static validateSignature(req: SecureRequest, res: Response, next: NextFunction): void {
    const signature = req.get('X-Signature');
    const timestamp = req.get('X-Timestamp');
    const nonce = req.get('X-Nonce') || crypto.randomUUID();
    
    if (!signature || !timestamp) {
      res.status(401).json({ 
        error: 'Request signature required',
        code: 'MISSING_SIGNATURE'
      });
      return;
    }
    
    // Check timestamp window
    const requestTime = parseInt(timestamp);
    const now = Date.now();
    
    if (Math.abs(now - requestTime) > ApiSecurity.REQUEST_WINDOW) {
      res.status(401).json({ 
        error: 'Request timestamp outside valid window',
        code: 'TIMESTAMP_INVALID'
      });
      return;
    }
    
    // Check for replay attacks
    if (ApiSecurity.recentNonces.has(nonce)) {
      const SecurityMonitor = require('./securityMonitor').SecurityMonitor;
      SecurityMonitor.logSecurityEvent('replay_attack', 'critical', {
        ip: req.ip,
        nonce,
        endpoint: req.path
      });
      
      res.status(401).json({ 
        error: 'Replay attack detected',
        code: 'REPLAY_ATTACK'
      });
      return;
    }
    
    // Generate expected signature
    const apiKey = req.get('X-API-Key') || '';
    const method = req.method;
    const path = req.path;
    const body = req.method !== 'GET' ? JSON.stringify(req.body) : '';
    
    const payload = `${method}|${path}|${timestamp}|${nonce}|${body}`;
    const expectedSignature = crypto
      .createHmac('sha256', apiKey)
      .update(payload)
      .digest('hex');
    
    if (signature !== expectedSignature) {
      const SecurityMonitor = require('./securityMonitor').SecurityMonitor;
      SecurityMonitor.logSecurityEvent('invalid_signature', 'high', {
        ip: req.ip,
        endpoint: req.path,
        method
      });
      
      res.status(401).json({ 
        error: 'Invalid request signature',
        code: 'INVALID_SIGNATURE'
      });
      return;
    }
    
    // Store nonce to prevent replay
    ApiSecurity.recentNonces.add(nonce);
    req.signatureValid = true;
    next();
  }
  
  /**
   * Combined API security middleware
   */
  static middleware() {
    return [
      ApiSecurity.validateApiKey,
      ApiSecurity.validateSignature
    ];
  }
  
  /**
   * Generate signature for outgoing requests
   */
  static generateSignature(
    method: string,
    path: string,
    body: any,
    apiKey: string,
    timestamp?: number,
    nonce?: string
  ): { signature: string; timestamp: number; nonce: string } {
    const ts = timestamp || Date.now();
    const n = nonce || crypto.randomUUID();
    const bodyStr = body ? JSON.stringify(body) : '';
    
    const payload = `${method}|${path}|${ts}|${n}|${bodyStr}`;
    const signature = crypto
      .createHmac('sha256', apiKey)
      .update(payload)
      .digest('hex');
    
    return { signature, timestamp: ts, nonce: n };
  }
}