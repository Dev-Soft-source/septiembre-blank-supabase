// @ts-nocheck
// TypeScript checking disabled for Supabase schema compatibility
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Package, Plus, Edit2, Trash2, AlertTriangle, Info, RefreshCw } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRealTimeAvailability } from "@/hooks/useRealTimeAvailability";
import { useSecurePackageOperations } from "@/hooks/useSecurePackageOperations";
import { CreatePackageModal } from "./packages/CreatePackageModal";
import { EditPackageModal } from "./packages/EditPackageModal";
import { DeletePackageModal } from "./packages/DeletePackageModal";
import { PackagesTable } from "./packages/PackagesTable";
import { PackagesCalendar } from "./packages/PackagesCalendar";
import { AvailabilityPackage } from "@/types/availability-package";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

export function AvailabilityPackagesContent() {
  const { user, profile } = useAuth();
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<AvailabilityPackage | null>(null);
  const [deletingPackage, setDeletingPackage] = useState<AvailabilityPackage | null>(null);
  const [hotelId, setHotelId] = useState<string | undefined>(undefined);

  // Get the user's hotel ID
  useEffect(() => {
    const fetchHotelId = async () => {
      if (!user) return;
      
      try {
        const { data: hotels, error } = await supabase
          .from('hotels')
          .select('id')
          .eq('owner_id', user.id)
          .limit(1);

        if (error) {
          console.error('Error fetching hotel ID:', error);
          return;
        }

        if (hotels && hotels.length > 0) {
          setHotelId(hotels[0].id);
          console.log('Hotel ID found for availability packages:', hotels[0].id);
        }
      } catch (error) {
        console.error('Error in fetchHotelId:', error);
      }
    };

    fetchHotelId();
  }, [user]);

  // Use real-time availability and secure operations
  const { 
    packages, 
    isLoading, 
    error, 
    lastUpdated,
    refreshAvailability 
  } = useRealTimeAvailability({ hotelId });

  const {
    loading: operationLoading,
    secureCreatePackage,
    secureUpdatePackage,
    secureDeletePackage
  } = useSecurePackageOperations();

  const handleCreatePackage = async (packageData: Omit<AvailabilityPackage, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await secureCreatePackage(packageData);
      setIsCreateModalOpen(false);
      refreshAvailability();
    } catch (error) {
      console.error('Error creating package:', error);
    }
  };

  const handleEditPackage = async (packageData: Partial<AvailabilityPackage>) => {
    if (!editingPackage) return;
    
    try {
      await secureUpdatePackage(editingPackage.id, packageData);
      setEditingPackage(null);
      refreshAvailability();
    } catch (error) {
      console.error('Error updating package:', error);
    }
  };

  const handleDeletePackage = async () => {
    if (!deletingPackage) return;
    
    try {
      await secureDeletePackage(deletingPackage.id);
      setDeletingPackage(null);
      refreshAvailability();
    } catch (error) {
      console.error('Error deleting package:', error);
    }
  };

  const getPackageStatus = (pkg: AvailabilityPackage) => {
    const now = new Date();
    const startDate = new Date(pkg.start_date);
    const endDate = new Date(pkg.end_date);
    
    if (endDate < now) return 'past';
    if (startDate <= now && endDate >= now) return 'active';
    return 'upcoming';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-700 text-green-100">Active</Badge>;
      case 'upcoming':
        return <Badge className="bg-blue-700 text-blue-100">Upcoming</Badge>;
      case 'past':
        return <Badge className="bg-gray-700 text-gray-100">Past</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const canEditPackage = (pkg: AvailabilityPackage) => {
    // Can't edit if package has active bookings
    return pkg.available_rooms === pkg.total_rooms;
  };

  const canDeletePackage = (pkg: AvailabilityPackage) => {
    const status = getPackageStatus(pkg);
    // Can only delete future packages with no bookings
    return status === 'upcoming' && pkg.available_rooms === pkg.total_rooms;
  };

  if (error) {
    return (
      <Card className="bg-red-950/20 border-red-500/30">
        <div className="p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-200 mb-2">Error Loading Packages</h3>
          <p className="text-red-300/80">{error}</p>
          <Button onClick={refreshAvailability} className="mt-4" variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package className="w-8 h-8 text-blue-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">Availability Packages</h1>
            <p className="text-white/70">Manage your hotel's fixed-date availability packages</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <span>Last updated: {format(lastUpdated, 'HH:mm:ss')}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshAvailability}
              disabled={isLoading}
              className="bg-purple-800/30 border-purple-600/50 text-white hover:bg-purple-700/50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          
          <div className="flex bg-purple-800/30 rounded-lg p-1">
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="px-4"
            >
              Table
            </Button>
            <Button
              variant={viewMode === 'calendar' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('calendar')}
              className="px-4"
            >
              Calendar
            </Button>
          </div>
          
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            disabled={operationLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Package
          </Button>
        </div>
      </div>

      {/* Info Card */}
      <Card className="bg-blue-950/30 border-blue-500/30">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-400 mt-0.5" />
            <div className="text-sm text-blue-200">
              <h4 className="font-medium mb-2">Package Management Rules</h4>
              <ul className="space-y-1 text-blue-200/80">
                <li>• Packages cannot overlap in dates</li>
                <li>• Check-in day must match your hotel's preferred weekday</li>
                <li>• Duration must be 8, 15, 22, or 29 days</li>
                <li>• Packages with bookings cannot be edited or deleted</li>
                <li>• Only future packages with no bookings can be deleted</li>
                <li>• All modifications are secured with validation checks</li>
                <li>• Real-time updates prevent stale data conflicts</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Content */}
      {isLoading ? (
        <Card className="bg-[#6000B3] border-border">
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white/70">Loading packages...</p>
          </div>
        </Card>
      ) : packages.length === 0 ? (
        <Card className="bg-[#6000B3] border-border">
          <div className="p-8 text-center">
            <Calendar className="w-16 h-16 text-white/50 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white/80 mb-2">No Packages Yet</h3>
            <p className="text-white/60 mb-4">
              Create your first availability package to start accepting bookings.
            </p>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Package
            </Button>
          </div>
        </Card>
      ) : viewMode === 'table' ? (
        <PackagesTable
          packages={packages}
          getPackageStatus={getPackageStatus}
          getStatusBadge={getStatusBadge}
          canEditPackage={canEditPackage}
          canDeletePackage={canDeletePackage}
          onEditPackage={setEditingPackage}
          onDeletePackage={setDeletingPackage}
        />
      ) : (
        <PackagesCalendar
          packages={packages}
          getPackageStatus={getPackageStatus}
          onEditPackage={setEditingPackage}
          onDeletePackage={setDeletingPackage}
        />
      )}

      {/* Modals */}
      <CreatePackageModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePackage}
      />

      <EditPackageModal
        isOpen={!!editingPackage}
        onClose={() => setEditingPackage(null)}
        package={editingPackage}
        canEdit={editingPackage ? canEditPackage(editingPackage) : false}
        onSubmit={handleEditPackage}
      />

      <DeletePackageModal
        isOpen={!!deletingPackage}
        onClose={() => setDeletingPackage(null)}
        package={deletingPackage}
        onConfirm={handleDeletePackage}
      />
    </div>
  );
}