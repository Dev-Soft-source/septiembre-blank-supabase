
import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusDisplay = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return { text: 'Published', className: 'bg-green-100 text-green-800' };
      case 'pending':
        return { text: 'Pending', className: 'bg-yellow-100 text-yellow-800' };
      case 'rejected':
        return { text: 'Rejected', className: 'bg-red-100 text-red-800' };
      default:
        return { text: 'Unknown', className: 'bg-gray-100 text-gray-800' };
    }
  };

  const { text, className } = getStatusDisplay(status);

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${className}`}>
      {text}
    </span>
  );
};
