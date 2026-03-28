// @ts-nocheck
// TypeScript checking disabled for Supabase schema compatibility
import React, { useState, useEffect } from "react";
import { History, Loader2, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import { formatDate, calculateDaysBetween } from "../../utils/dateUtils";

export default function HistoryContent() {
  const [pastStays, setPastStays] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation('dashboard/user');

  useEffect(() => {
    const fetchPastStays = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
          .from('bookings')
          .select('*, hotels(name, city, country)')
          .eq('user_id', user.id)
          .lt('check_out', today)
          .order('check_out', { ascending: false });
        
        if (error) throw error;
        
        setPastStays(data || []);
      } catch (error) {
        console.error("Error fetching stay history:", error);
        toast({
          title: t('userDashboard.history.errorLoading') || "Error loading stay history",
          description: t('userDashboard.history.errorDescription') || "We couldn't load your stay history. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPastStays();
  }, [user, toast, t]);
  
  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-6">{t('userDashboard.history.title')}</h2>
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-6 h-6 animate-spin text-fuchsia-500" />
          <span className="ml-2">{t('userDashboard.history.loading') || 'Loading history...'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6">
      <h2 className="text-xl font-bold mb-6">{t('userDashboard.history.title')}</h2>
      <p className="text-muted-foreground mb-6">{t('userDashboard.history.subtitle')}</p>
      
      {pastStays.length > 0 ? (
        <div className="space-y-4">
          {pastStays.map((stay) => (
            <Card key={stay.id} className="p-4 bg-card/50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{stay.hotels?.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {stay.hotels?.city}, {stay.hotels?.country}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatDate(stay.check_in)} - {formatDate(stay.check_out)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm">Rate Stay</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="mb-2">{t('userDashboard.history.noHistory') || "No stay history"}</p>
          <p className="text-sm">{t('userDashboard.history.noHistoryDesc') || "You don't have any past stays."}</p>
        </div>
      )}
    </div>
  );
}