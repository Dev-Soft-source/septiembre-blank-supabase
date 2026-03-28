import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, AlertTriangle, Info } from "lucide-react";
import { format } from "date-fns";
import { AvailabilityPackage } from "@/types/availability-package";

interface EditPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  package: AvailabilityPackage | null;
  canEdit: boolean;
  onSubmit: (updates: Partial<AvailabilityPackage>) => void;
}

export function EditPackageModal({ isOpen, onClose, package: pkg, canEdit, onSubmit }: EditPackageModalProps) {
  const [totalRooms, setTotalRooms] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (pkg) {
      setTotalRooms(pkg.total_rooms);
    }
  }, [pkg]);

  const validateEdit = () => {
    const newErrors: string[] = [];

    if (!canEdit) {
      newErrors.push("Cannot edit package with active bookings");
      setErrors(newErrors);
      return false;
    }

    if (!pkg) {
      newErrors.push("No package selected");
      setErrors(newErrors);
      return false;
    }

    const bookedRooms = pkg.total_rooms - pkg.available_rooms;

    if (totalRooms < bookedRooms) {
      newErrors.push(`Cannot reduce rooms below ${bookedRooms} (already booked)`);
    }

    if (totalRooms < 1) {
      newErrors.push("Total rooms must be at least 1");
    }

    if (totalRooms > 100) {
      newErrors.push("Total rooms cannot exceed 100");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEdit() || !pkg) {
      return;
    }

    setLoading(true);

    try {
      const roomDifference = totalRooms - pkg.total_rooms;
      const updates: Partial<AvailabilityPackage> = {
        total_rooms: totalRooms,
        available_rooms: pkg.available_rooms + roomDifference
      };

      await onSubmit(updates);
      handleClose();
    } catch (error) {
      console.error('Error updating package:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setErrors([]);
    onClose();
  };

  if (!pkg) return null;

  const bookedRooms = pkg.total_rooms - pkg.available_rooms;
  const hasBookings = bookedRooms > 0;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Edit Package
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!canEdit && (
            <div className="bg-orange-950/20 border border-orange-500/30 rounded-lg p-3">
              <div className="flex items-center gap-2 text-orange-400 mb-2">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium">Cannot Edit Package</span>
              </div>
              <p className="text-sm text-orange-300">
                This package has active bookings and cannot be edited. You can only view the details.
              </p>
            </div>
          )}

          {hasBookings && (
            <div className="bg-blue-950/20 border border-blue-500/30 rounded-lg p-3">
              <div className="flex items-center gap-2 text-blue-400 mb-2">
                <Info className="h-4 w-4" />
                <span className="font-medium">Booking Information</span>
              </div>
              <p className="text-sm text-blue-300">
                {bookedRooms} room(s) are already booked. You can only increase the total rooms.
              </p>
            </div>
          )}

          {errors.length > 0 && (
            <div className="bg-red-950/20 border border-red-500/30 rounded-lg p-3">
              <div className="flex items-center gap-2 text-red-400 mb-2">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium">Validation Errors</span>
              </div>
              <ul className="text-sm text-red-300 space-y-1">
                {errors.map((error, index) => (
                  <li key={`edit-error-${index}`}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Start Date:</span>
                <div className="font-medium">{format(new Date(pkg.start_date), 'MMM dd, yyyy')}</div>
              </div>
              <div>
                <span className="text-muted-foreground">End Date:</span>
                <div className="font-medium">{format(new Date(pkg.end_date), 'MMM dd, yyyy')}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Duration:</span>
                <div className="font-medium">{pkg.duration_days} days</div>
              </div>
              <div>
                <span className="text-muted-foreground">Available:</span>
                <div className="font-medium">{pkg.available_rooms} rooms</div>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="totalRooms">Total Rooms</Label>
              <Input
                id="totalRooms"
                type="number"
                min={bookedRooms}
                max="100"
                value={totalRooms}
                onChange={(e) => setTotalRooms(parseInt(e.target.value) || 0)}
                disabled={!canEdit}
              />
              {hasBookings && (
                <p className="text-sm text-muted-foreground">
                  Minimum: {bookedRooms} (rooms already booked)
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
                {canEdit ? 'Cancel' : 'Close'}
              </Button>
              {canEdit && (
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Updating..." : "Update Package"}
                </Button>
              )}
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}