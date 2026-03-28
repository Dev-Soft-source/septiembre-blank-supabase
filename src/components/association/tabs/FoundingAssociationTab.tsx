import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export const FoundingAssociationTab = () => {
  const { t } = useTranslation('associationDashboard');
  const { toast } = useToast();
  const { user } = useAuth();
  const [isFoundingAssociation, setIsFoundingAssociation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleChange = async (checked: boolean) => {
    if (!checked) {
      setIsFoundingAssociation(false);
      return;
    }

    setIsLoading(true);
    try {
      // Send notification to JocMathMixado when toggled to Yes
      const { error } = await supabase.functions.invoke('send-founding-association-notification', {
        body: {
          associationEmail: user?.email,
          associationId: user?.id,
          message: 'A new association has joined as a Founding Association',
          timestamp: new Date().toISOString()
        }
      });

      if (error) {
        throw error;
      }

      setIsFoundingAssociation(true);
      toast({
        title: "Success",
        description: t('foundingAssociation.notificationSent'),
      });
    } catch (error) {
      console.error('Error sending founding association notification:', error);
      toast({
        title: "Error",
        description: t('foundingAssociation.notificationError'),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white shadow-[0_0_30px_rgba(0,200,255,0.3)]">
      <CardHeader>
        <CardTitle className="text-white text-xl font-bold glow">
          {t('foundingAssociation.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-white/90 text-lg leading-relaxed">
          {t('foundingAssociation.description')}
        </p>
        
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center space-x-4">
            <span className={`text-lg font-medium ${!isFoundingAssociation ? 'text-white' : 'text-white/60'}`}>
              {t('foundingAssociation.no')}
            </span>
            <Switch
              checked={isFoundingAssociation}
              onCheckedChange={handleToggleChange}
              disabled={isLoading}
              className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-white/20"
            />
            <span className={`text-lg font-medium ${isFoundingAssociation ? 'text-white' : 'text-white/60'}`}>
              {t('foundingAssociation.yes')}
            </span>
          </div>
        </div>

        {isFoundingAssociation && (
          <div className="p-4 bg-primary/20 rounded-lg border border-primary/30 animate-fade-in">
            <p className="text-white font-medium text-center">
              ¡Felicidades! Ahora es una Asociación Fundadora de Hotel Living.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};