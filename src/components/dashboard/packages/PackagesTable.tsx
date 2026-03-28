import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";
import { AvailabilityPackage } from "@/types/availability-package";

interface PackagesTableProps {
  packages: AvailabilityPackage[];
  getPackageStatus: (pkg: AvailabilityPackage) => string;
  getStatusBadge: (status: string) => React.ReactNode;
  canEditPackage: (pkg: AvailabilityPackage) => boolean;
  canDeletePackage: (pkg: AvailabilityPackage) => boolean;
  onEditPackage: (pkg: AvailabilityPackage) => void;
  onDeletePackage: (pkg: AvailabilityPackage) => void;
}

export function PackagesTable({
  packages,
  getPackageStatus,
  getStatusBadge,
  canEditPackage,
  canDeletePackage,
  onEditPackage,
  onDeletePackage
}: PackagesTableProps) {
  return (
    <Card className="bg-[#6000B3] border-border">
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-purple-400/20">
                <th className="text-left py-3 px-2 text-white font-medium">Dates</th>
                <th className="text-left py-3 px-2 text-white font-medium">Duration</th>
                <th className="text-left py-3 px-2 text-white font-medium">Rooms</th>
                <th className="text-left py-3 px-2 text-white font-medium">Status</th>
                <th className="text-left py-3 px-2 text-white font-medium">Availability</th>
                <th className="text-right py-3 px-2 text-white font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg) => {
                const status = getPackageStatus(pkg);
                const bookedRooms = pkg.total_rooms - pkg.available_rooms;
                const isPartiallyBooked = bookedRooms > 0;
                const isFullyBooked = pkg.available_rooms === 0;

                return (
                  <tr key={pkg.id} className="border-b border-purple-400/10 hover:bg-purple-800/20">
                    <td className="py-4 px-2">
                      <div className="text-white">
                        <div className="font-medium">
                          {format(new Date(pkg.start_date), 'MMM dd')} - {format(new Date(pkg.end_date), 'MMM dd')}
                        </div>
                        <div className="text-sm text-white/70">
                          {format(new Date(pkg.start_date), 'yyyy')}
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-2 text-white">
                        <Calendar className="w-4 h-4" />
                        {pkg.duration_days} days
                      </div>
                    </td>
                    
                    <td className="py-4 px-2">
                      <div className="text-white">
                        <div className="font-medium">{pkg.total_rooms} total</div>
                        {isPartiallyBooked && (
                          <div className="text-sm text-orange-300">
                            {bookedRooms} booked
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="py-4 px-2">
                      {getStatusBadge(status)}
                    </td>
                    
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-2">
                        {isFullyBooked ? (
                          <Badge variant="destructive" className="bg-red-700 text-red-100">
                            Sold Out
                          </Badge>
                        ) : isPartiallyBooked ? (
                          <Badge className="bg-orange-700 text-orange-100">
                            {pkg.available_rooms} left
                          </Badge>
                        ) : (
                          <Badge className="bg-green-700 text-green-100">
                            {pkg.available_rooms} available
                          </Badge>
                        )}
                      </div>
                    </td>
                    
                    <td className="py-4 px-2">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditPackage(pkg)}
                          className="text-blue-300 hover:text-blue-200 hover:bg-blue-900/20"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeletePackage(pkg)}
                          disabled={!canDeletePackage(pkg)}
                          className="text-red-300 hover:text-red-200 hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}