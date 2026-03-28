
import React from "react";

interface SuccessMessageProps {
  isEditingMode?: boolean;
  showFallback?: boolean;
  onFallbackRedirect?: () => void;
}

export default function SuccessMessage({ 
  isEditingMode = false, 
  showFallback = false, 
  onFallbackRedirect 
}: SuccessMessageProps) {
  return (
    <div className="p-6 border rounded-md bg-[#5d0083]/30 text-white mb-6">
      {isEditingMode ? (
        <>
          <h3 className="text-lg font-medium mb-2 text-white">✅ Changes Submitted!</h3>
          <p className="text-white">Thank you for submitting your property changes. They have been successfully received and are now awaiting administrator review.</p>
          <p className="mt-2 text-white">You'll receive a notification once the review is complete. Please note that you cannot make additional changes until these are reviewed.</p>
        </>
      ) : (
        <>
          <h3 className="text-lg font-medium mb-2 text-white">✅ Property Submitted!</h3>
          <p className="text-white">Thank you for submitting your property. It has been successfully received and is now awaiting administrator review.</p>
          <p className="mt-2 text-white">You'll receive a notification once the review is complete.</p>
        </>
      )}
      
      {showFallback && onFallbackRedirect && (
        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-white text-sm mb-3">
            If you weren't redirected automatically to your dashboard:
          </p>
          <button
            type="button"
            onClick={onFallbackRedirect}
            className="w-full py-2 px-4 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
          >
            Click here to view your property
          </button>
        </div>
      )}
    </div>
  );
}
