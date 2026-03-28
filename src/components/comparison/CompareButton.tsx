
import React from 'react';
import { Button } from '@/components/ui/button';
import { GitCompare } from 'lucide-react';
import { useHotelComparison } from '@/hooks/useHotelComparison';
import { useNavigate } from 'react-router-dom';

export const CompareButton: React.FC = () => {
  const { selectedHotels, canCompare } = useHotelComparison();
  const navigate = useNavigate();

  if (!canCompare) return null;

  const handleCompare = () => {
    navigate('/compare');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={handleCompare}
        className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg px-6 py-3 rounded-full"
        size="lg"
      >
        <GitCompare className="w-5 h-5 mr-2" />
        Compare Now ({selectedHotels.length})
      </Button>
    </div>
  );
};
