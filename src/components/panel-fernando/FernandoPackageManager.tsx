import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback';
import FernandoPriceCorrector from './FernandoPriceCorrector';
import { FernandoPackageCreator } from './FernandoPackageCreator';
import { Loader2, CheckCircle, AlertCircle, Package, DollarSign, Wrench } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const FernandoPackageManager: React.FC = () => {
  const { t } = useTranslationWithFallback('admin');
  const [activeTab, setActiveTab] = useState('overview');

  const runCompletePackageFixing = async () => {
    console.log('🚀 Starting Complete Package Fixing Process...');
    
    try {
      // Step 1: Create missing packages
      console.log('📦 Step 1: Creating missing packages...');
      const { data: createData, error: createError } = await supabase.functions.invoke('create-missing-packages');
      
      if (createError) {
        throw new Error(`Package creation failed: ${createError.message}`);
      }
      
      console.log('✅ Package creation completed:', createData);
      
      // Step 2: Wait a moment for database consistency
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Step 3: Run price corrector
      console.log('💰 Step 2: Running price corrector...');
      const { data: correctData, error: correctError } = await supabase.functions.invoke('global-price-corrector');
      
      if (correctError) {
        throw new Error(`Price correction failed: ${correctError.message}`);
      }
      
      console.log('✅ Price correction completed:', correctData);
      
      // Success!
      console.log('🎉 Complete package fixing process finished successfully!');
      
    } catch (error) {
      console.error('❌ Complete package fixing failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Complete Package Management System
          </CardTitle>
          <CardDescription>
            One-click solution to fix all hotel package issues permanently
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">🔧 Complete Fix Process:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>1. Creates missing packages for hotels with no packages in database</li>
              <li>2. Applies Sacred Pricing Table corrections to all packages</li>
              <li>3. Ensures progressive pricing (8-day &lt; 15-day &lt; 22-day &lt; 29-day)</li>
              <li>4. Validates price endings (must end in 0, 5, or 9)</li>
              <li>5. Fixes currency and meal plan percentage issues</li>
            </ul>
          </div>
          
          <Button 
            onClick={runCompletePackageFixing}
            className="w-full"
            size="lg"
          >
            <Wrench className="mr-2 h-4 w-4" />
            Run Complete Package Fix (Creates + Corrects)
          </Button>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Create Missing Packages
          </TabsTrigger>
          <TabsTrigger value="correct" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Correct Existing Prices
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="create" className="space-y-4">
          <FernandoPackageCreator />
        </TabsContent>
        
        <TabsContent value="correct" className="space-y-4">
          <FernandoPriceCorrector />
        </TabsContent>
      </Tabs>
    </div>
  );
};