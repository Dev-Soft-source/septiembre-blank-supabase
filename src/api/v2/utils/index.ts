// API v2 Utilities
export const API_V2_BASE_URL = '/api/v2';

export const createApiV2Response = <T>(
  success: boolean,
  data?: T,
  error?: string
) => ({
  success,
  data,
  error,
  timestamp: new Date().toISOString()
});