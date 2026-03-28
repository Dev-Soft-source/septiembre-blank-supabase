import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X } from "lucide-react";
import { format } from "date-fns";
import { AvailabilityPackage } from "@/types/availability-package";

interface DeletePackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  package: AvailabilityPackage | null;
  onConfirm: () => void;
}

export function DeletePackageModal({ isOpen, onClose, package: pkg, onConfirm }: DeletePackageModalProps) {
  if (!pkg) return null;

  const hasBookings = pkg.available_rooms < pkg.total_rooms;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Delete Package
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-red-950/20 border border-red-500/30 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            <div>
              <h3 className="font-medium text-red-200">Confirm Deletion</h3>
              <p className="text-sm text-red-300">
                This action cannot be undone.
              </p>
            </div>
          </div>

          {hasBookings && (
            <div className="p-4 bg-orange-950/20 border border-orange-500/30 rounded-lg">
              <h4 className="font-medium text-orange-200 mb-2">Cannot Delete Package</h4>
              <p className="text-sm text-orange-300">
                This package has active bookings and cannot be deleted. 
                {pkg.total_rooms - pkg.available_rooms} room(s) are currently booked.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <h4 className="font-medium">Package Details:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm bg-secondary/10 p-3 rounded">
              <div>
                <span className="text-muted-foreground">Dates:</span>
                <div>{format(new Date(pkg.start_date), 'MMM dd')} - {format(new Date(pkg.end_date), 'MMM dd')}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Duration:</span>
                <div>{pkg.duration_days} days</div>
              </div>
              <div>
                <span className="text-muted-foreground">Total Rooms:</span>
                <div>{pkg.total_rooms}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Available:</span>
                <div>{pkg.available_rooms}</div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={onConfirm} 
              disabled={hasBookings}
              className="flex-1"
            >
              {hasBookings ? 'Cannot Delete' : 'Delete Package'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}