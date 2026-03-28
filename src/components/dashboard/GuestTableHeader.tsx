
import React from 'react';

interface GuestTableHeaderProps {
  title: string;
}

export const GuestTableHeader: React.FC<GuestTableHeaderProps> = ({ title }) => {
  return (
    <h2 className="text-xl font-bold mb-6">{title}</h2>
  );
};
