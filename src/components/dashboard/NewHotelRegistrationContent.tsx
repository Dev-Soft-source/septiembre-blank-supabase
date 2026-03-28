
import React from 'react';
import { NewHotelRegistrationForm } from './hotel-registration/NewHotelRegistrationForm';
import { PDFDownloadOption } from './hotel-registration/PDFDownloadOption';

interface NewHotelRegistrationContentProps {
  editingHotelId?: string;
  onComplete?: () => void;
}

export const NewHotelRegistrationContent = ({ editingHotelId, onComplete }: NewHotelRegistrationContentProps = {}) => {
  return (
    <div className="min-h-screen p-6 py-0 px-0" style={{ backgroundColor: '#640091' }}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          {editingHotelId && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Edit Property</h2>
              <p className="text-white/80">Update your property information</p>
            </div>
          )}
        </div>
        
        {/* PDF Download Option */}
        <PDFDownloadOption />
        
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 px-0 py-0">
          <NewHotelRegistrationForm editingHotelId={editingHotelId} onComplete={onComplete} />
        </div>
      </div>
    </div>
  );
};
