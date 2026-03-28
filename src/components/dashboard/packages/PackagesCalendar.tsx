import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Edit2, Trash2 } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from "date-fns";
import { AvailabilityPackage } from "@/types/availability-package";

interface PackagesCalendarProps {
  packages: AvailabilityPackage[];
  getPackageStatus: (pkg: AvailabilityPackage) => string;
  onEditPackage: (pkg: AvailabilityPackage) => void;
  onDeletePackage: (pkg: AvailabilityPackage) => void;
}

export function PackagesCalendar({
  packages,
  getPackageStatus,
  onEditPackage,
  onDeletePackage
}: PackagesCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getPackagesForDate = (date: Date) => {
    return packages.filter(pkg => {
      const startDate = new Date(pkg.start_date);
      const endDate = new Date(pkg.end_date);
      return date >= startDate && date <= endDate;
    });
  };

  const getPackageStartsOnDate = (date: Date) => {
    return packages.filter(pkg => isSameDay(new Date(pkg.start_date), date));
  };

  const getDayColor = (date: Date) => {
    const packagesOnDate = getPackagesForDate(date);
    if (packagesOnDate.length === 0) return 'bg-gray-800';
    
    const hasActive = packagesOnDate.some(pkg => getPackageStatus(pkg) === 'active');
    const hasUpcoming = packagesOnDate.some(pkg => getPackageStatus(pkg) === 'upcoming');
    const hasPast = packagesOnDate.some(pkg => getPackageStatus(pkg) === 'past');
    
    if (hasActive) return 'bg-green-600';
    if (hasUpcoming) return 'bg-blue-600';
    if (hasPast) return 'bg-gray-600';
    
    return 'bg-gray-800';
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(direction === 'prev' ? subMonths(currentMonth, 1) : addMonths(currentMonth, 1));
  };

  return (
    <div className="space-y-4">
      <Card className="bg-[#6000B3] border-border">
        <div className="p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">
              {format(currentMonth, 'MMMM yyyy')}
            </h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('prev')}
                className="border-purple-400/30 text-white hover:bg-purple-800"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('next')}
                className="border-purple-400/30 text-white hover:bg-purple-800"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-white/70 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {daysInMonth.map(date => {
              const packagesStarting = getPackageStartsOnDate(date);
              const packagesOnDate = getPackagesForDate(date);
              const dayColor = getDayColor(date);

              return (
                <div
                  key={date.toISOString()}
                  className={`relative min-h-[80px] rounded-lg p-2 ${dayColor} transition-colors`}
                >
                  <div className="text-sm font-medium text-white mb-1">
                    {format(date, 'd')}
                  </div>
                  
                  {packagesStarting.map(pkg => (
                    <div
                      key={pkg.id}
                      className="text-xs bg-white/20 rounded px-1 py-0.5 mb-1 text-white truncate"
                      title={`${pkg.duration_days} days - ${pkg.available_rooms}/${pkg.total_rooms} available`}
                    >
                      {pkg.duration_days}d
                    </div>
                  ))}
                  
                  {packagesOnDate.length > 0 && (
                    <div className="absolute bottom-1 right-1">
                      <div className="w-2 h-2 bg-white rounded-full opacity-70"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-600 rounded"></div>
              <span className="text-white/70">Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-600 rounded"></div>
              <span className="text-white/70">Upcoming</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-600 rounded"></div>
              <span className="text-white/70">Past</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-800 rounded"></div>
              <span className="text-white/70">No packages</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Package List for Current Month */}
      {packages.filter(pkg => {
        const startDate = new Date(pkg.start_date);
        return startDate.getMonth() === currentMonth.getMonth() && 
               startDate.getFullYear() === currentMonth.getFullYear();
      }).length > 0 && (
        <Card className="bg-[#6000B3] border-border">
          <div className="p-6">
            <h4 className="text-lg font-semibold text-white mb-4">
              Packages in {format(currentMonth, 'MMMM yyyy')}
            </h4>
            
            <div className="space-y-3">
              {packages
                .filter(pkg => {
                  const startDate = new Date(pkg.start_date);
                  return startDate.getMonth() === currentMonth.getMonth() && 
                         startDate.getFullYear() === currentMonth.getFullYear();
                })
                .map(pkg => {
                  const status = getPackageStatus(pkg);
                  const bookedRooms = pkg.total_rooms - pkg.available_rooms;

                  return (
                    <div key={pkg.id} className="flex items-center justify-between p-4 bg-purple-800/30 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="font-medium text-white">
                            {format(new Date(pkg.start_date), 'MMM dd')} - {format(new Date(pkg.end_date), 'MMM dd')}
                          </div>
                          <div className="text-sm text-white/70">
                            {pkg.duration_days} days • {pkg.total_rooms} rooms
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          {status === 'active' && (
                            <Badge className="bg-green-700 text-green-100">Active</Badge>
                          )}
                          {status === 'upcoming' && (
                            <Badge className="bg-blue-700 text-blue-100">Upcoming</Badge>
                          )}
                          {status === 'past' && (
                            <Badge className="bg-gray-700 text-gray-100">Past</Badge>
                          )}
                          
                          {bookedRooms > 0 && (
                            <Badge className="bg-orange-700 text-orange-100">
                              {bookedRooms} booked
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditPackage(pkg)}
                          className="text-blue-300 hover:text-blue-200"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeletePackage(pkg)}
                          className="text-red-300 hover:text-red-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}