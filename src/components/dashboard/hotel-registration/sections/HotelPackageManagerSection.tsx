import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { useTranslation } from '@/hooks/useTranslation';
import { HotelRegistrationFormData } from '../NewHotelRegistrationForm';
import { HotelPackageManager } from '../../packages/HotelPackageManager';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';
import { Package, Info } from 'lucide-react';
interface HotelPackageManagerSectionProps {
  form: UseFormReturn<HotelRegistrationFormData>;
  editingHotelId?: string;
}
export const HotelPackageManagerSection = ({
  form,
  editingHotelId
}: HotelPackageManagerSectionProps) => {
  const {
    t
  } = useTranslation('dashboard/hotel-registration');
  const {
    user
  } = useAuth();

  // Always show this section when editing an existing hotel (approved, pending, or rejected)
  // For new hotel creation, show informational message
  if (!editingHotelId) {
    return <AccordionItem value="package-manager" className="bg-white/5 border-white/20 rounded-lg">
        <AccordionTrigger className="px-6 py-4 text-white hover:no-underline">
          <div className="flex items-center space-x-3">
            <span className="bg-fuchsia-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">16</span>
            <span className="text-[18px] font-semibold">Availability Package Management</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-6 pb-6">
          <Card className="bg-blue-950/30 border-blue-500/30 p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 mt-0.5" />
              <div className="text-sm text-blue-200">
                <h4 className="font-medium mb-2 text-base">Package Management Available After Hotel Creation</h4>
                <p>
                  Full package management (add, edit, delete) will be available once you complete the hotel registration. 
                  During registration, you can define initial availability periods in Step 15.
                </p>
              </div>
            </div>
          </Card>
        </AccordionContent>
      </AccordionItem>;
  }
  return <AccordionItem value="package-manager" className="bg-white/5 border-white/20 rounded-lg">
      <AccordionTrigger className="px-6 py-4 text-white hover:no-underline">
        <div className="flex items-center space-x-3">
          <span className="bg-fuchsia-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">16</span>
          <span className="text-[18px] font-semibold">Manage Availability Packages</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-6 pb-6">
        <div className="bg-white/10 rounded-lg p-6 border border-white/30">
          <div className="flex items-center gap-3 mb-4">
            <Package className="w-6 h-6 text-purple-400" />
            <h4 className="text-white text-lg font-semibold">
              Full Package Management
            </h4>
          </div>
          
          <p className="text-white/80 text-sm mb-6">
            Add, edit, and delete availability packages for this hotel. All changes sync immediately 
            across the platform and affect real-time booking availability.
          </p>

          <HotelPackageManager hotelId={editingHotelId} hotelName={form.watch('hotelName') || 'Your Hotel'} onPackageChange={() => {
          // Optionally trigger form validation or updates here
          console.log('Packages updated for hotel:', editingHotelId);
        }} />
        </div>
      </AccordionContent>
    </AccordionItem>;
};