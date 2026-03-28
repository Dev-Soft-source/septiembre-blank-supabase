// API v2 Type Definitions
export interface ApiV2Response<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface ApiV2Request {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: any;
  params?: Record<string, string>;
}