
import React from "react";
import { AlertCircle } from "lucide-react";

interface ValidationErrorBannerProps {
  errorFields: string[];
}

export default function ValidationErrorBanner({
  errorFields
}: ValidationErrorBannerProps) {
  if (errorFields.length === 0) return null;
  return <div className="mb-6 p-4 border rounded-md bg-[#5d0083] text-white py-[3px]">
      <div className="flex items-start gap-2">
        <AlertCircle className="h-5 w-5 mt-0.5" />
        <div>
          <p className="font-medium text-sm">Please complete all required fields:</p>
          <ul className="list-disc pl-5 mt-2">
            {errorFields.map((field, index) => <li key={`error-${field}-${index}`}>{field}</li>)}
          </ul>
        </div>
      </div>
    </div>;
}
