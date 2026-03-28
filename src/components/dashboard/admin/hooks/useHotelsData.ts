
// @ts-nocheck
// TypeScript checking disabled for Supabase schema compatibility

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { validateAdminAccess } from "@/utils/adminAccess";

export const useHotelsData = () => {
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  // Check admin status on mount
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const result = await validateAdminAccess();
        setIsAdmin(result.isAdmin);
      } catch (error) {
        console.warn('Could not verify admin status:', error);
        setIsAdmin(false);
      }
    };
    
    checkAdminStatus();
  }, []);

  const fetchAllHotels = async () => {
    setLoading(true);
    try {
      // Check admin status first
      const adminResult = await validateAdminAccess();
      
      if (!adminResult.isAdmin) {
        toast({
          title: "Access Denied",
          description: "You need admin privileges to view all hotels",
          variant: "destructive"
        });
        setLoading(false);
        return { data: null, error: "Access denied" };
      }

      const { data, error } = await supabase
        .from('hotels')
        .select(`
          *,
          profiles:owner_id(
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        toast({
          title: "Error",
          description: `Failed to fetch hotels: ${error.message}`,
          variant: "destructive"
        });
        return { data: null, error };
      }

      setHotels(data || []);
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error in fetchAllHotels:', error);
      toast({
        title: "Error",
        description: "Failed to fetch hotels - please check your admin privileges",
        variant: "destructive"
      });
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingHotels = async () => {
    setLoading(true);
    try {
      // Check admin status first
      const adminResult = await validateAdminAccess();
      
      if (!adminResult.isAdmin) {
        toast({
          title: "Access Denied",
          description: "You need admin privileges to view pending hotels",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('hotels')
        .select(`
          *,
          profiles:owner_id(
            first_name,
            last_name
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        toast({
          title: "Error",
          description: `Failed to fetch pending hotels: ${error.message}`,
          variant: "destructive"
        });
        return;
      }

      setHotels(data || []);
    } catch (error) {
      console.error('Error fetching pending hotels:', error);
      toast({
        title: "Error", 
        description: "Failed to fetch pending hotels - please check your admin privileges",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    hotels,
    loading,
    isAdmin,
    setHotels,
    fetchAllHotels,
    fetchPendingHotels
  };
};
