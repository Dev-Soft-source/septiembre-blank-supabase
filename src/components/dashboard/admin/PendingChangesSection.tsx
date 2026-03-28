
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Clock, FileText } from "lucide-react";

interface Hotel {
  id: string;
  name: string;
  pending_changes: Record<string, any> | null;
  updated_at: string;
}

interface PendingChangesSectionProps {
  hotels: Hotel[];
}

export const PendingChangesSection: React.FC<PendingChangesSectionProps> = ({ hotels }) => {
  const navigate = useNavigate();

  // Filter hotels that have pending changes
  const hotelsWithPendingChanges = hotels.filter(
    hotel => hotel.pending_changes && Object.keys(hotel.pending_changes).length > 0
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUpdatedFields = (pendingChanges: Record<string, any>) => {
    return Object.keys(pendingChanges).join(', ');
  };

  const handleReviewChanges = (hotelId: string) => {
    navigate(`/admin/hotels/${hotelId}`);
  };

  if (hotelsWithPendingChanges.length === 0) {
    return (
      <Card className="p-6 bg-[#5C0869]">
        <h3 className="text-lg font-semibold text-fuchsia-200 mb-4">Pending Changes from Hotels</h3>
        <div className="text-center py-8 text-gray-300">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No pending changes to review</p>
          <p className="text-sm mt-2">All hotel updates have been processed</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-[#5C0869]">
      <h3 className="text-lg font-semibold text-fuchsia-200 mb-4">Pending Changes from Hotels</h3>
      <div className="space-y-4">
        {hotelsWithPendingChanges.map((hotel) => (
          <div key={hotel.id} className="bg-[#5A0080] rounded-lg p-4 border border-fuchsia-500/20">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h4 className="font-medium text-white mb-1">{hotel.name}</h4>
                <p className="text-sm text-gray-300 mb-2">ID: {hotel.id}</p>
                <div className="flex items-center text-sm text-gray-400">
                  <Clock className="w-4 h-4 mr-1" />
                  Last submission: {formatDate(hotel.updated_at)}
                </div>
              </div>
              <Button
                onClick={() => handleReviewChanges(hotel.id)}
                className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white"
                size="sm"
              >
                Review Changes
              </Button>
            </div>
            {hotel.pending_changes && (
              <div className="mt-3 pt-3 border-t border-fuchsia-500/20">
                <p className="text-sm text-gray-300">
                  <span className="font-medium">Updated fields:</span> {getUpdatedFields(hotel.pending_changes)}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default PendingChangesSection;
