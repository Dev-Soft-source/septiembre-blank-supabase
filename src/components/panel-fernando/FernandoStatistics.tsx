
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Building, Calendar, CreditCard, Users } from "lucide-react";

export default function FernandoStatistics() {
  const [stats, setStats] = useState({
    totalHotels: 0,
    pendingHotels: 0,
    approvedHotels: 0,
    totalBookings: 0,
    totalRevenue: 0,
    totalUsers: 0,
    recentBookings: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchStatistics = async () => {
    try {
      // Fetch hotels stats
      const { data: hotels, error: hotelsError } = await supabase
        .from('hotels')
        .select('status');
      
      if (hotelsError) throw hotelsError;

      // Fetch bookings stats
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('total_price, created_at');
      
      if (bookingsError) throw bookingsError;

      // Fetch users count directly from profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id');
      
      if (profilesError) throw profilesError;

      // Calculate statistics
      const totalHotels = hotels?.length || 0;
      const pendingHotels = hotels?.filter(h => h.status === 'pending').length || 0;
      const approvedHotels = hotels?.filter(h => h.status === 'approved').length || 0;
      const totalBookings = bookings?.length || 0;
      const totalUsers = profiles?.length || 0;
      
      // Recent bookings (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentBookings = bookings?.filter(b => 
        new Date(b.created_at) > thirtyDaysAgo
      ).length || 0;

      // Calculate revenue from bookings instead of payments to avoid policy issues
      const totalRevenue = bookings?.reduce((sum, b) => sum + Number(b.total_price || 0), 0) || 0;

      setStats({
        totalHotels,
        pendingHotels,
        approvedHotels,
        totalBookings,
        totalRevenue,
        totalUsers,
        recentBookings
      });
    } catch (error) {
      console.error('Error fetching statistics:', error);
      toast({
        title: "Error",
        description: "Failed to fetch statistics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <Card className="bg-purple-900/20 border-purple-800/30">
        <CardContent className="p-6">
          <div className="text-center text-white/60">Loading statistics...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Platform Statistics</h2>
          <p className="text-white/60">Key metrics and activity overview</p>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-purple-900/20 border-purple-800/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-blue-600/20 flex items-center justify-center">
                <Building className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-white/60">Total Hotels</h3>
                <p className="text-2xl font-bold text-white">{stats.totalHotels}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-900/20 border-purple-800/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-green-600/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-white/60">Total Bookings</h3>
                <p className="text-2xl font-bold text-white">{stats.totalBookings}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-900/20 border-purple-800/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-yellow-600/20 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-white/60">Total Revenue</h3>
                <p className="text-2xl font-bold text-white">${stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-900/20 border-purple-800/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-purple-600/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-white/60">Total Users</h3>
                <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-purple-900/20 border-purple-800/30">
          <CardHeader>
            <CardTitle className="text-white">Hotel Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/60">Approved Hotels</span>
                <span className="text-green-400 font-semibold">{stats.approvedHotels}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">Pending Hotels</span>
                <span className="text-yellow-400 font-semibold">{stats.pendingHotels}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">Rejected Hotels</span>
                <span className="text-red-400 font-semibold">{stats.totalHotels - stats.approvedHotels - stats.pendingHotels}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-900/20 border-purple-800/30">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/60">Bookings (Last 30 days)</span>
                <span className="text-blue-400 font-semibold">{stats.recentBookings}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">Average per day</span>
                <span className="text-blue-400 font-semibold">{(stats.recentBookings / 30).toFixed(1)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">Conversion Rate</span>
                <span className="text-blue-400 font-semibold">
                  {stats.totalUsers > 0 ? ((stats.totalBookings / stats.totalUsers) * 100).toFixed(1) : 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
