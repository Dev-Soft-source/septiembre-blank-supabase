import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Package, Users, Calendar, BarChart3 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { usePackageAnalytics } from '@/hooks/usePackageAnalytics';
import { format } from 'date-fns';

export function PackageAnalyticsDashboard() {
  const { profile } = useAuth();
  const { analytics, isLoading, error } = usePackageAnalytics(profile?.id);

  if (error) {
    return (
      <Card className="bg-red-950/20 border-red-500/30 p-6">
        <div className="text-center">
          <p className="text-red-300">Failed to load analytics: {error}</p>
        </div>
      </Card>
    );
  }

  if (isLoading || !analytics) {
    return (
      <Card className="bg-[#6000B3] border-border p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-purple-800/30 rounded"></div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-purple-800/30 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-blue-950/30 border-blue-500/30 p-4">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-blue-400" />
            <div>
              <p className="text-blue-200/80 text-sm">Total Packages</p>
              <p className="text-2xl font-bold text-white">{analytics.totalPackages}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-green-950/30 border-green-500/30 p-4">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-green-400" />
            <div>
              <p className="text-green-200/80 text-sm">Total Bookings</p>
              <p className="text-2xl font-bold text-white">{analytics.totalBookings}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-purple-950/30 border-purple-500/30 p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-purple-400" />
            <div>
              <p className="text-purple-200/80 text-sm">Conversion Rate</p>
              <p className="text-2xl font-bold text-white">{analytics.conversionRate.toFixed(1)}%</p>
            </div>
          </div>
        </Card>

        <Card className="bg-orange-950/30 border-orange-500/30 p-4">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-orange-400" />
            <div>
              <p className="text-orange-200/80 text-sm">Avg Occupancy</p>
              <p className="text-2xl font-bold text-white">
                {analytics.occupancyByDuration.length > 0 
                  ? (analytics.occupancyByDuration.reduce((sum, d) => sum + d.occupancyRate, 0) / analytics.occupancyByDuration.length).toFixed(1)
                  : 0}%
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Occupancy by Duration */}
      <Card className="bg-[#6000B3] border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-white" />
          <h3 className="text-lg font-semibold text-white">Occupancy by Duration</h3>
        </div>
        
        {analytics.occupancyByDuration.length === 0 ? (
          <p className="text-white/60">No data available</p>
        ) : (
          <div className="space-y-3">
            {analytics.occupancyByDuration.map(duration => (
              <div key={duration.duration} className="flex items-center justify-between p-3 bg-purple-800/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge className="bg-purple-700 text-purple-100">
                    {duration.duration} days
                  </Badge>
                  <span className="text-white/80">
                    {duration.bookedRooms}/{duration.totalRooms} rooms
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-purple-900/50 rounded-full h-2">
                    <div 
                      className="bg-purple-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(duration.occupancyRate, 100)}%` }}
                    />
                  </div>
                  <span className="text-white font-medium w-12 text-right">
                    {duration.occupancyRate.toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Popular and Least Popular Packages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Popular */}
        <Card className="bg-green-950/20 border-green-500/30 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-semibold text-green-200">Most Popular Packages</h3>
          </div>
          
          {analytics.popularPackages.length === 0 ? (
            <p className="text-green-200/60">No packages available</p>
          ) : (
            <div className="space-y-3">
              {analytics.popularPackages.map((pkg, index) => (
                <div key={pkg.packageId} className="flex items-center justify-between p-3 bg-green-900/20 rounded-lg">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-green-300 border-green-500">
                        #{index + 1}
                      </Badge>
                      <span className="text-green-200 font-medium">
                        {format(new Date(pkg.startDate), 'MMM dd')} - {format(new Date(pkg.endDate), 'MMM dd')}
                      </span>
                    </div>
                    <p className="text-green-200/70 text-sm">
                      {pkg.duration} days • {pkg.bookingCount} bookings
                    </p>
                  </div>
                  <span className="text-green-300 font-bold">
                    {pkg.conversionRate.toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Least Popular */}
        <Card className="bg-red-950/20 border-red-500/30 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="w-5 h-5 text-red-400" />
            <h3 className="text-lg font-semibold text-red-200">Needs Attention</h3>
          </div>
          
          {analytics.leastPopularPackages.length === 0 ? (
            <p className="text-red-200/60">No packages available</p>
          ) : (
            <div className="space-y-3">
              {analytics.leastPopularPackages.map((pkg, index) => (
                <div key={pkg.packageId} className="flex items-center justify-between p-3 bg-red-900/20 rounded-lg">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-red-300 border-red-500">
                        Low
                      </Badge>
                      <span className="text-red-200 font-medium">
                        {format(new Date(pkg.startDate), 'MMM dd')} - {format(new Date(pkg.endDate), 'MMM dd')}
                      </span>
                    </div>
                    <p className="text-red-200/70 text-sm">
                      {pkg.duration} days • {pkg.bookingCount} bookings
                    </p>
                  </div>
                  <span className="text-red-300 font-bold">
                    {pkg.conversionRate.toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}