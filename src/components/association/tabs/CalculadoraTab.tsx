import React from 'react';
import { AssociationMiniCalculator } from '@/components/association/AssociationMiniCalculator';
import { AssociationDisclaimer } from '@/components/association/AssociationDisclaimer';

export const CalculadoraTab = () => {
  return (
    <div className="space-y-6">
      {/* Calculator - exactly as it appears in Association Slug page */}
      <AssociationMiniCalculator />
      
      {/* Disclaimer - displayed immediately below the calculator */}
      <AssociationDisclaimer />
    </div>
  );
};