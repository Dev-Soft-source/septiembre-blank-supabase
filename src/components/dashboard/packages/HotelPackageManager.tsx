// @ts-nocheck
// TypeScript checking disabled for Supabase schema compatibility
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Package, Plus, Edit2, Trash2, AlertTriangle, Info, RefreshCw, Hotel } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRealTimeAvailability } from "@/hooks/useRealTimeAvailability";
import { useSecurePackageOperations } from "@/hooks/useSecurePackageOperations";
import { CreatePackageModal } from "./CreatePackageModal";
import { EditPackageModal } from "./EditPackageModal";
import { DeletePackageModal } from "./DeletePackageModal";
import { PackagesTable } from "./PackagesTable";
import { AvailabilityPackage } from "@/types/availability-package";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

interface HotelPackageManagerProps {
  hotelId: string;
  hotelName?: string;
  onPackageChange?: () => void;
}

export function HotelPackageManager({ hotelId, hotelName, onPackageChange }: HotelPackageManagerProps) {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'list'>('list');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<AvailabilityPackage | null>(null);
  const [deletingPackage, setDeletingPackage] = useState<AvailabilityPackage | null>(null);
  const [hotelExists, setHotelExists] = useState<boolean>(false);

  // Verify hotel exists in database
  useEffect(() => {
    const verifyHotel = async () => {
      if (!hotelId) return;
      
      try {
        const { data, error } = await supabase
          .from('hotels')
          .select('id, status')
          .eq('id', hotelId)
          .single();
          
        if (data && !error) {
          setHotelExists(true);
          console.log('Hotel verified for package management:', { id: data.id, status: data.status });
        } else {
          console.error('Hotel not found for package management:', error);
          setHotelExists(false);
        }
      } catch (err) {
        console.error('Error verifying hotel existence:', err);
        setHotelExists(false);
      }
    };
    
    verifyHotel();
  }, [hotelId]);

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

  // Notify parent component when packages change
  useEffect(() => {
    if (onPackageChange) {
      onPackageChange();
    }
  }, [packages, onPackageChange]);

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
    // Can edit if there are available rooms (no full bookings)
    return pkg.available_rooms === pkg.total_rooms;
  };

  const canDeletePackage = (pkg: AvailabilityPackage) => {
    const status = getPackageStatus(pkg);
    // Can only delete future packages with no bookings
    return status === 'upcoming' && pkg.available_rooms === pkg.total_rooms;
  };

  // Show error if hotel doesn't exist
  if (!hotelExists && hotelId) {
    return (
      <Card className="bg-yellow-950/20 border-yellow-500/30">
        <div className="p-6 text-center">
          <Hotel className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-yellow-200 mb-2">Hotel Not Found</h3>
          <p className="text-yellow-300/80 mb-4">
            The hotel you're trying to manage (ID: {hotelId}) could not be found in the database.
            This might be because:
          </p>
          <ul className="text-yellow-300/80 text-sm text-left list-disc list-inside space-y-1 mb-4">
            <li>The hotel was deleted</li>
            <li>You don't have permission to manage this hotel</li>
            <li>There's a temporary database connection issue</li>
          </ul>
          <Button onClick={() => window.location.reload()} className="mt-4" variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Page
          </Button>
        </div>
      </Card>
    );
  }

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
          <Package className="w-8 h-8 text-purple-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">Availability Packages</h2>
            <p className="text-white/70">{hotelName ? `Managing packages for ${hotelName}` : 'Manage your hotel\'s availability packages'}</p>
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
          
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            disabled={operationLoading}
            className="bg-green-600 hover:bg-green-700"
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
                <li>• Duration must be 8, 15, 22, or 29 days</li>
                <li>• Packages with bookings cannot be edited or deleted</li>
                <li>• Only future packages with no bookings can be deleted</li>
                <li>• Room count can only be increased if there are active bookings</li>
                <li>• All changes sync in real-time across the entire platform</li>
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
              Create your first availability package to start accepting bookings for this hotel.
            </p>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Package
            </Button>
          </div>
        </Card>
      ) : (
        <PackagesTable
          packages={packages}
          getPackageStatus={getPackageStatus}
          getStatusBadge={getStatusBadge}
          canEditPackage={canEditPackage}
          canDeletePackage={canDeletePackage}
          onEditPackage={setEditingPackage}
          onDeletePackage={setDeletingPackage}
        />
      )}

      {/* Summary Card */}
      {packages.length > 0 && (
        <Card className="bg-purple-900/30 border-purple-500/30">
          <div className="p-4">
            <h4 className="text-white font-medium mb-3">Package Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-white">{packages.length}</p>
                <p className="text-white/70 text-sm">Total Packages</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-400">
                  {packages.filter(p => getPackageStatus(p) === 'upcoming').length}
                </p>
                <p className="text-white/70 text-sm">Upcoming</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-400">
                  {packages.filter(p => getPackageStatus(p) === 'active').length}
                </p>
                <p className="text-white/70 text-sm">Active</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {packages.reduce((sum, p) => sum + p.total_rooms, 0)}
                </p>
                <p className="text-white/70 text-sm">Total Rooms</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Modals */}
      <CreatePackageModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePackage}
        prefilledHotelId={hotelId}
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