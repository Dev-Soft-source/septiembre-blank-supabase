
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, Users, Building, CreditCard, Calendar, Globe, Star, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PlatformStats {
  totalHotels: number;
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
  monthlyGrowth: number;
  activeCountries: number;
  averageRating: number;
  pageViews: number;
}

export default function PruebaStatistics() {
  const [stats, setStats] = useState<PlatformStats>({
    totalHotels: 0,
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    monthlyGrowth: 0,
    activeCountries: 0,
    averageRating: 0,
    pageViews: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      // Fetch hotels count
      const { data: hotels, error: hotelsError } = await supabase
        .from('hotels')
        .select('id', { count: 'exact' });

      // Fetch users count
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact' });

      // Fetch bookings count and revenue
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('id, total_price', { count: 'exact' });

      // Fetch payments for revenue calculation
      const { data: payments, error: paymentsError } = await supabase
        .from('payments')
        .select('total_paid');

      // Calculate statistics
      const totalRevenue = payments?.reduce((sum, payment) => sum + Number(payment.total_paid), 0) || 0;
      
      // Fetch unique countries
      const { data: countries, error: countriesError } = await supabase
        .from('hotels')
        .select('country');
      
      const uniqueCountries = new Set(countries?.map(h => h.country)).size || 0;

      setStats({
        totalHotels: hotels?.length || 0,
        totalUsers: users?.length || 0,
        totalBookings: bookings?.length || 0,
        totalRevenue: totalRevenue,
        monthlyGrowth: 12.5, // This would be calculated based on historical data
        activeCountries: uniqueCountries,
        averageRating: 4.2, // This would be calculated from reviews
        pageViews: 15420 // This would come from analytics
      });

    } catch (error) {
      console.error('Error fetching statistics:', error);
      toast({
        title: "Error",
        description: "Failed to fetch platform statistics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, trend, color }: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: string;
    color: string;
  }) => (
    <Card className="bg-[#7a0486] border-purple-600">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
            {trend && (
              <p className={`text-sm flex items-center gap-1 ${color}`}>
                <TrendingUp className="w-4 h-4" />
                {trend}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-full bg-purple-800/50`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <Card className="bg-[#7a0486] border-purple-600">
          <CardContent className="p-6">
            <div className="text-center text-white">Loading statistics...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Platform Statistics</h2>
        <Button className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Hotels"
          value={stats.totalHotels}
          icon={<Building className="w-6 h-6 text-white" />}
          trend="+8.2% from last month"
          color="text-green-400"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users className="w-6 h-6 text-white" />}
          trend="+15.3% from last month"
          color="text-green-400"
        />
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
          icon={<Calendar className="w-6 h-6 text-white" />}
          trend="+23.1% from last month"
          color="text-green-400"
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={<CreditCard className="w-6 h-6 text-white" />}
          trend="+18.7% from last month"
          color="text-green-400"
        />
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Countries"
          value={stats.activeCountries}
          icon={<Globe className="w-6 h-6 text-white" />}
          color="text-blue-400"
        />
        <StatCard
          title="Average Rating"
          value={stats.averageRating.toFixed(1)}
          icon={<Star className="w-6 h-6 text-white" />}
          color="text-yellow-400"
        />
        <StatCard
          title="Monthly Growth"
          value={`${stats.monthlyGrowth}%`}
          icon={<TrendingUp className="w-6 h-6 text-white" />}
          color="text-green-400"
        />
        <StatCard
          title="Page Views"
          value={stats.pageViews.toLocaleString()}
          icon={<Eye className="w-6 h-6 text-white" />}
          color="text-purple-400"
        />
      </div>

      {/* Performance Overview */}
      <Card className="bg-[#7a0486] border-purple-600">
        <CardHeader>
          <CardTitle className="text-white">Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-white font-semibold mb-4">Top Performing Metrics</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/80">User Registration Rate</span>
                  <span className="text-green-400 font-semibold">+24.3%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Hotel Approval Rate</span>
                  <span className="text-green-400 font-semibold">+18.7%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Booking Conversion</span>
                  <span className="text-green-400 font-semibold">+15.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Revenue Growth</span>
                  <span className="text-green-400 font-semibold">+31.8%</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Key Insights</h4>
              <div className="space-y-3 text-white/80 text-sm">
                <p>• Hotel registrations have increased by 8.2% this month</p>
                <p>• User engagement is at an all-time high with 15.3% growth</p>
                <p>• Booking volume shows strong seasonal growth patterns</p>
                <p>• Revenue per booking has improved by 12% on average</p>
                <p>• International expansion showing positive trends</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Summary */}
      <Card className="bg-[#7a0486] border-purple-600">
        <CardHeader>
          <CardTitle className="text-white">Recent Activity Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-white font-semibold mb-2">Last 7 Days</h4>
              <ul className="text-white/80 space-y-1 text-sm">
                <li>• 23 new hotel registrations</li>
                <li>• 156 new user signups</li>
                <li>• 89 bookings completed</li>
                <li>• $12,450 in revenue</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">Last 30 Days</h4>
              <ul className="text-white/80 space-y-1 text-sm">
                <li>• 98 hotel approvals</li>
                <li>• 642 user registrations</li>
                <li>• 387 successful bookings</li>
                <li>• $54,280 total revenue</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">Pending Actions</h4>
              <ul className="text-white/80 space-y-1 text-sm">
                <li>• 12 hotels awaiting approval</li>
                <li>• 8 user verification pending</li>
                <li>• 5 booking disputes open</li>
                <li>• 3 payment issues to resolve</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
