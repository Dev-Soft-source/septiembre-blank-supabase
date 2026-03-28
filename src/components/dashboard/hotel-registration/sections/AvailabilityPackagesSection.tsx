import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Edit, Trash2 } from 'lucide-react';
import { format, differenceInDays, isAfter, isBefore, isSameDay } from 'date-fns';
import { useTranslation } from '@/hooks/useTranslation';
import { HotelRegistrationFormData } from '../NewHotelRegistrationForm';
import { cn } from '@/lib/utils';
import { duration } from 'html2canvas/dist/types/css/property-descriptors/duration';

interface AvailabilityPackagesSectionProps {
  form: UseFormReturn<HotelRegistrationFormData>;
}

interface AvailabilityPackage {
  id?: string;
  startDate: Date;
  endDate: Date;
  duration: number;
  availableRooms: number;
}

interface PackageFormData {
  id: string;
  startDate: Date | null;
  endDate: Date | null;
  availableRooms: number;
  duration: number;
}

export const AvailabilityPackagesSection = ({ form }: AvailabilityPackagesSectionProps) => {
  const { t } = useTranslation('dashboard/hotel-registration');
  
  const [showForm, setShowForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState<string | null>(null);
  const [packageForm, setPackageForm] = useState<PackageFormData>({
    id: null,
    startDate: null,
    endDate: null,    
    availableRooms: 1,
    duration: 0
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  
  // Get current form values
  const stayLengths = form.watch('stayLengths') || [];
  const checkInDay = form.watch('checkInDay') || 'Monday';
  const availabilityPackages = form.watch('availabilityPackages') || [];

  // Convert weekday name to number (Monday = 1, Sunday = 0)
  const getWeekdayNumber = (weekday: string): number => {
    const weekdays = { 'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5, 'Saturday': 6 };
    return weekdays[weekday as keyof typeof weekdays] || 1;
  };

  const preferredWeekdayNum = getWeekdayNumber(checkInDay as string);

  // Validation functions
  const isDateSelectable = (date: Date): boolean => {
    if (date < new Date()) return false;
    if (date.getDay() !== preferredWeekdayNum) return false;
    return true;
  };

  const validatePackage = (data: PackageFormData): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    if (!data.startDate) {
      newErrors.startDate = t('availabilityPackages.validation.startDateRequired');
    } else {
      if (data.startDate < new Date()) {
        newErrors.startDate = t('availabilityPackages.validation.pastDate');
      } else if (data.startDate.getDay() !== preferredWeekdayNum) {
        newErrors.startDate = t('availabilityPackages.validation.invalidWeekday');
      }
    }

    if (!data.endDate) {
      newErrors.endDate = t('availabilityPackages.validation.endDateRequired');
    } else if (data.startDate && data.endDate <= data.startDate) {
      newErrors.endDate = t('availabilityPackages.validation.endDateBeforeStart');
    }

    if (!data.availableRooms || data.availableRooms < 1) {
      newErrors.availableRooms = t('availabilityPackages.validation.roomsMinimum');
    }

    // Check duration matches stay lengths
    if (data.startDate && data.endDate) {
      const duration = differenceInDays(data.endDate, data.startDate) + 1;
      const validDurations = (stayLengths as ("8" | "15" | "22" | "29")[]).map(s => parseInt(s));
      if (!validDurations.includes(duration)) {
        newErrors.duration = t('availabilityPackages.validation.invalidDuration');
      }
      // Check for overlaps with existing packages
      const hasOverlap = availabilityPackages.some((pkg, index) => {
        // Skip the package being edited
        if (editingPackage && pkg.id === editingPackage) {
          return false;
        }
          
        return (
          (isAfter(data.startDate!, pkg.startDate) && isBefore(data.startDate!, pkg.endDate)) ||
          (isAfter(data.endDate!, pkg.startDate) && isBefore(data.endDate!, pkg.endDate)) ||
          (isBefore(data.startDate!, pkg.startDate) && isAfter(data.endDate!, pkg.endDate)) ||
          isSameDay(data.startDate!, pkg.startDate) || 
          isSameDay(data.startDate!, pkg.endDate) ||
          isSameDay(data.endDate!, pkg.startDate) || 
          isSameDay(data.endDate!, pkg.endDate)
        );
      });

      if (hasOverlap) {
        newErrors.overlap = t('availabilityPackages.validation.dateOverlap');
      }
    }
    return newErrors;
  };

  const handleAddPackage = () => {
    setShowForm(true);
    setEditingPackage(null);
    setPackageForm({ startDate: null, endDate: null, availableRooms: 1, id: null, duration: 0});
    setErrors({});
  };

  const handleEditPackage = (packageId: string) => {
    
    const packageToEdit = availabilityPackages.find(pkg => pkg.id === packageId);
    if (packageToEdit) {
      setShowForm(true);
      setEditingPackage(packageId);
      setPackageForm({
        id: packageToEdit.id,
        startDate: packageToEdit.startDate,
        endDate: packageToEdit.endDate,
        availableRooms: packageToEdit.availableRooms,
        duration: packageToEdit.duration
      });
      setErrors({});
    }
  };

  const handleSavePackage = () => {
    const validationErrors = validatePackage(packageForm);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      const duration = differenceInDays(packageForm.endDate!, packageForm.startDate!) + 1;
      
      const newPackage: AvailabilityPackage = {
        id: editingPackage || `pkg-${Date.now()}`,
        startDate: packageForm.startDate!,
        endDate: packageForm.endDate!,
        duration,
        availableRooms: packageForm.availableRooms
      };

      let updatedPackages;
      if (editingPackage) {
        updatedPackages = availabilityPackages.map(pkg => 
          pkg.id === editingPackage ? newPackage : pkg
        );
      } else {
        updatedPackages = [...availabilityPackages, newPackage];
      }
      
      form.setValue('availabilityPackages', updatedPackages);
      setShowForm(false);
      setEditingPackage(null);
    }
  };

  const handleDeletePackage = (packageId: string) => {

    const updatedPackages = availabilityPackages.filter(pkg => pkg.id !== packageId);
    
    form.setValue('availabilityPackages', updatedPackages);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPackage(null);
    setErrors({});
  };

  return (
    <AccordionItem value="availability-packages" className="bg-white/5 border-white/20 rounded-lg">
      <AccordionTrigger className="px-6 py-4 text-white hover:no-underline">
        <div className="flex items-center space-x-3">
          <span className="bg-fuchsia-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">15</span>
          <span className="text-[18px] font-semibold">{t('availabilityPackages.title')}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-6 pb-6">
        <div className="space-y-6">
          <div className="text-white/80 text-sm">
            {t('availabilityPackages.description')}
          </div>

          {/* Package Creation/Editing Form */}
          {showForm && (
            <div className="bg-white/10 rounded-lg p-6 border border-white/30">
              <h4 className="text-white mb-4" style={{ fontSize: '20px', fontWeight: '600' }}>
                {editingPackage ? t('availabilityPackages.editing') : t('availabilityPackages.creating')}
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Start Date */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    {t('availabilityPackages.startDate')}
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type='button'
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-white/10 border-white/30 text-white",
                          !packageForm.startDate && "text-white/60"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {packageForm.startDate ? format(packageForm.startDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={packageForm.startDate || undefined}
                        onSelect={(date) => setPackageForm(prev => ({ ...prev, startDate: date || null }))}
                        disabled={(date) => !isDateSelectable(date)}
                        modifiers={{
                          preferredWeekday: (date) => date.getDay() === preferredWeekdayNum,
                        }}
                        modifiersClassNames={{
                          preferredWeekday: "bg-white text-[#73149E] font-bold hover:bg-white/90",
                        }}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.startDate && <p className="text-red-400 text-xs mt-1">{errors.startDate}</p>}
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    {t('availabilityPackages.endDate')}
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type='button'
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-white/10 border-white/30 text-white",
                          !packageForm.endDate && "text-white/60"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {packageForm.endDate ? format(packageForm.endDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={packageForm.endDate || undefined}
                        onSelect={(date) => setPackageForm(prev => ({ ...prev, endDate: date || null }))}
                        disabled={(date) => date < new Date()}
                        modifiers={{
                          preferredWeekday: (date) => date.getDay() === preferredWeekdayNum,
                        }}
                        modifiersClassNames={{
                          preferredWeekday: "bg-white text-[#73149E] font-bold hover:bg-white/90",
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.endDate && <p className="text-red-400 text-xs mt-1">{errors.endDate}</p>}
                </div>
              </div>

              {/* Available Rooms */}
              <div className="mb-4">
                <label className="block text-white text-sm font-medium mb-2">
                  {t('availabilityPackages.availableRooms')}
                </label>
                <Input
                  type="number"
                  min="1"
                  value={packageForm.availableRooms}
                  onChange={(e) => setPackageForm(prev => ({ ...prev, availableRooms: parseInt(e.target.value) || 1 }))}
                  className="bg-white/10 border-white/30 text-white"
                />
                {errors.availableRooms && <p className="text-red-400 text-xs mt-1">{errors.availableRooms}</p>}
              </div>

              {/* Duration Display */}
              {packageForm.startDate && packageForm.endDate && (
                <div className="mb-4">
                  <p className="text-white text-sm">
                    {t('availabilityPackages.duration')}: {differenceInDays(packageForm.endDate, packageForm.startDate) + 1} {t('availabilityPackages.days')}
                  </p>
                </div>
              )}

              {/* Error Messages */}
              {(errors.duration || errors.overlap) && (
                <div className="mb-4">
                  {errors.duration && <p className="text-red-400 text-xs">{errors.duration}</p>}
                  {errors.overlap && <p className="text-red-400 text-xs">{errors.overlap}</p>}
                </div>
              )}

              {/* Form Actions */}
              <div className="flex gap-2">
                <Button type='button' onClick={handleSavePackage} className="bg-fuchsia-600 hover:bg-fuchsia-700">
                  {t('availabilityPackages.save')}
                </Button>
                <Button type='button' onClick={handleCancel} variant="outline" className="border-white/30 text-white">
                  {t('availabilityPackages.cancel')}
                </Button>
              </div>
            </div>
          )}

          {/* Existing Packages List */}
          {availabilityPackages.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-white font-semibold">{t('availabilityPackages.packageDetails')}</h4>
              {availabilityPackages.map((pkg, index) => (
                <div key={pkg.id || index} className="bg-white/10 rounded-lg p-4 border border-white/20">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-white text-sm">
                        <span className="font-medium">{t('availabilityPackages.startDate')}:</span> {format(pkg.startDate, "PPP")}
                      </p>
                      <p className="text-white text-sm">
                        <span className="font-medium">{t('availabilityPackages.endDate')}:</span> {format(pkg.endDate, "PPP")}
                      </p>
                      <p className="text-white text-sm">
                        <span className="font-medium">{t('availabilityPackages.duration')}:</span> {pkg.duration} {t('availabilityPackages.days')}
                      </p>
                      <p className="text-white text-sm">
                        <span className="font-medium">{t('availabilityPackages.availableRooms')}:</span> {pkg.availableRooms}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type='button'
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditPackage(pkg.id!)}
                        className="border-white/30 text-white hover:bg-white/10"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        type='button'
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeletePackage(pkg.id!)}
                        className="border-red-400/30 text-red-400 hover:bg-red-400/10"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Packages Message */}
          {availabilityPackages.length === 0 && !showForm && (
            <div className="text-center py-8">
              <p className="text-white/60 mb-4">{t('availabilityPackages.noPackages')}</p>
            </div>
          )}

          {/* Add Package Button */}
          {!showForm && availabilityPackages.length < 20 && (
            <div className="flex justify-center">
              <Button type='button' onClick={handleAddPackage} className="bg-fuchsia-600 hover:bg-fuchsia-700">
                <Plus className="h-4 w-4 mr-2" />
                {availabilityPackages.length === 0 ? t('availabilityPackages.addPackage') : t('availabilityPackages.addAnotherPackage')}
              </Button>
            </div>
          )}

          {/* Max Packages Message */}
          {availabilityPackages.length >= 20 && (
            <div className="text-center">
              <p className="text-yellow-400 text-sm">{t('availabilityPackages.maxPackagesReached')}</p>
            </div>
          )}

          {/* Form Field for React Hook Form */}
          <FormField
            control={form.control}
            name="availabilityPackages"
            render={({ field }) => (
              <FormItem className="hidden">
                <FormControl>
                  <input 
                    {...field} 
                    type="hidden" 
                    value={JSON.stringify(field.value || [])}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        field.onChange(parsed);
                      } catch {
                        field.onChange([]);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
