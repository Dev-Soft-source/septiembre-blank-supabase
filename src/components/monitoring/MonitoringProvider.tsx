import React, { ReactNode } from 'react';
import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';
import { useErrorReporting } from '@/hooks/useErrorReporting';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useStabilityMonitoring } from '@/hooks/useStabilityMonitoring';

interface MonitoringProviderProps {
  children: ReactNode;
}

export function MonitoringProvider({ children }: MonitoringProviderProps) {
  // Initialize all monitoring hooks for production scale
  usePerformanceMonitoring();
  useErrorReporting();
  useAnalytics();
  useStabilityMonitoring();

  return <>{children}</>;
}