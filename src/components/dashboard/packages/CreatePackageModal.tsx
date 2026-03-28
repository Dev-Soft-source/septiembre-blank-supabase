// @ts-nocheck
// TypeScript checking disabled for Supabase schema compatibility
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, AlertTriangle } from "lucide-react";
import { format, addDays } from "date-fns";
import { AvailabilityPackage } from "@/types/availability-package";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface CreatePackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (packageData: Omit<AvailabilityPackage, 'id' | 'created_at' | 'updated_at' | 'base_price_usd' | 'current_price_usd'>) => void;
  prefilledHotelId?: string;
}

export function CreatePackageModal({ isOpen, onClose, onSubmit, prefilledHotelId }: CreatePackageModalProps) {
  const { profile } = useAuth();
  const [hotels, setHotels] = useState<Array<{ id: string; name: string; check_in_weekday: string }>>([]);
  const [selectedHotelId, setSelectedHotelId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [duration, setDuration] = useState<number>(8);
  const [totalRooms, setTotalRooms] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const durations = [8, 15, 22, 29];

  useEffect(() => {
    if (isOpen) {
      fetchUserHotels();
      // Set prefilled hotel if provided
      if (prefilledHotelId) {
        setSelectedHotelId(prefilledHotelId);
      }
    }
  }, [isOpen, profile?.id, prefilledHotelId]);

  const fetchUserHotels = async () => {
    if (!profile?.id) return;

    try {
      const { data, error } = await supabase
        .from('hotels')
        .select('id, name, check_in_weekday')
        .eq('owner_id', profile.id);

      if (error) {
        console.error('Error fetching hotels:', error);
        return;
      }

      setHotels(data || []);
      if (data && data.length > 0 && !prefilledHotelId) {
        setSelectedHotelId(data[0].id);
      } else if (prefilledHotelId) {
        setSelectedHotelId(prefilledHotelId);
      }
    } catch (error) {
      console.error('Error fetching hotels:', error);
    }
  };

  const validatePackage = () => {
    const newErrors: string[] = [];

    if (!selectedHotelId) {
      newErrors.push("Please select a hotel");
    }

    if (!startDate) {
      newErrors.push("Please select a start date");
    }

    if (startDate) {
      const selectedDate = new Date(startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.push("Start date cannot be in the past");
      }

      // Check if start date matches hotel's preferred weekday
      const selectedHotel = hotels.find(h => h.id === selectedHotelId);
      if (selectedHotel) {
        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const selectedWeekday = weekdays[selectedDate.getDay()];
        
        if (selectedWeekday !== selectedHotel.check_in_weekday) {
          newErrors.push(`Check-in day must be ${selectedHotel.check_in_weekday}`);
        }
      }
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
    
    if (!validatePackage()) {
      return;
    }

    setLoading(true);

    try {
      const startDateObj = new Date(startDate);
      const endDateObj = addDays(startDateObj, duration - 1);

      const packageData: Omit<AvailabilityPackage, 'id' | 'created_at' | 'updated_at' | 'base_price_usd' | 'current_price_usd'> = {
        hotel_id: selectedHotelId,
        start_date: format(startDateObj, 'yyyy-MM-dd'),
        end_date: format(endDateObj, 'yyyy-MM-dd'),
        duration_days: duration,
        total_rooms: totalRooms,
        available_rooms: totalRooms,
        room_type: 'Double Room',
        occupancy_mode: 'per_person'
      };

      await onSubmit(packageData);
      handleClose();
    } catch (error) {
      console.error('Error creating package:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedHotelId(prefilledHotelId || "");
    setStartDate("");
    setDuration(8);
    setTotalRooms(1);
    setErrors([]);
    onClose();
  };

  const selectedHotel = hotels.find(h => h.id === selectedHotelId);
  const endDate = startDate ? format(addDays(new Date(startDate), duration - 1), 'yyyy-MM-dd') : '';

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-auto bg-[#300047] text-white">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center justify-between">
            Create Availability Package
            <Button variant="ghost" size="sm" onClick={handleClose} className="text-white hover:text-white/80">
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.length > 0 && (
            <div className="bg-red-950/20 border border-red-500/30 rounded-lg p-3">
              <div className="flex items-center gap-2 text-red-400 mb-2">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium">Validation Errors</span>
              </div>
              <ul className="text-sm text-red-300 space-y-1">
                {errors.map((error, index) => (
                  <li key={`create-error-${index}`}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-3">
            <Label htmlFor="hotel" className="text-white">Hotel</Label>
            <Select value={selectedHotelId} onValueChange={setSelectedHotelId} disabled={!!prefilledHotelId}>
              <SelectTrigger className="bg-white/10 border-white/20">
                <SelectValue placeholder="Select a hotel" />
              </SelectTrigger>
              <SelectContent>
                {hotels.map(hotel => (
                  <SelectItem key={hotel.id} value={hotel.id}>
                    {hotel.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {prefilledHotelId && (
              <p className="text-sm text-white/70">
                Hotel selection is fixed for this context
              </p>
            )}
            {selectedHotel && (
              <p className="text-sm text-white/70">
                Check-in day: {selectedHotel.check_in_weekday}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Label htmlFor="startDate" className="text-white">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={format(new Date(), 'yyyy-MM-dd')}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
            {endDate && (
              <p className="text-sm text-white/70">
                End Date: {format(new Date(endDate), 'MMM dd, yyyy')}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Label htmlFor="duration" className="text-white">Duration (Days)</Label>
            <Select value={duration.toString()} onValueChange={(value) => setDuration(parseInt(value))}>
              <SelectTrigger className="bg-white/10 border-white/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {durations.map(d => (
                  <SelectItem key={d} value={d.toString()}>
                    {d} days
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label htmlFor="totalRooms" className="text-white">Total Rooms</Label>
            <Input
              id="totalRooms"
              type="number"
              min="1"
              max="100"
              value={totalRooms}
              onChange={(e) => setTotalRooms(parseInt(e.target.value) || 1)}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1 border-white/20 text-white hover:text-white/80">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Creating..." : "Create Package"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}