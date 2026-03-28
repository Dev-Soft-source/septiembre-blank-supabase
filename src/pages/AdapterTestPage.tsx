/**
 * Adapter Test Page
 * Development page for running adapter validation tests
 */

import React from 'react';
import { AdapterTestDashboard } from '@/components/test/AdapterTestDashboard';

export const AdapterTestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <AdapterTestDashboard />
    </div>
  );
};