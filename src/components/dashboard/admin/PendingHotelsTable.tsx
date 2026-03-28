
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Eye } from "lucide-react";
import { useHotelsData } from './hooks/useHotelsData';
import { useHotelActions } from './hooks/useHotelActions';
import { useNavigate } from 'react-router-dom';

export default function PendingHotelsTable() {
  const { hotels, loading, fetchPendingHotels, fetchAllHotels } = useHotelsData();
  const { handleApprove, handleReject } = useHotelActions(fetchPendingHotels);
  const [allHotels, setAllHotels] = useState<any[]>([]);
  const [allHotelsLoading, setAllHotelsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadAllHotels();
  }, []);

  const loadAllHotels = async () => {
    setAllHotelsLoading(true);
    try {
      const { data, error } = await fetchAllHotels();
      if (!error && data) {
        setAllHotels(data);
      }
    } catch (error) {
      console.error('Error loading all hotels:', error);
    } finally {
      setAllHotelsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-600', text: 'Pending' },
      under_review: { color: 'bg-blue-600', text: 'Under Review' },
      approved: { color: 'bg-green-600', text: 'Approved' },
      rejected: { color: 'bg-red-600', text: 'Rejected' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <Badge className={`${config.color} text-white`}>
        {config.text}
      </Badge>
    );
  };

  const handleViewHotel = (hotelId: string) => {
    navigate(`/admin/hotel/${hotelId}`);
  };

  if (loading || allHotelsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Hotels Management</h2>
            <p className="text-white/60">Review and manage hotel submissions</p>
          </div>
        </div>
        <Card className="bg-purple-900/20 border-purple-800/30">
          <CardContent className="p-6">
            <div className="text-center text-white/60">Loading hotels...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Hotels Management</h2>
          <p className="text-white/60">Review and manage hotel submissions</p>
        </div>
      </div>

      {/* Pending Hotels Section - Only show if there are pending hotels */}
      {hotels.length > 0 && (
        <Card className="bg-purple-900/20 border-purple-800/30">
          <CardHeader>
            <CardTitle className="text-white">Pending Hotel Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {hotels.map((hotel) => (
                <div key={hotel.id} className="flex items-center justify-between p-4 bg-purple-800/20 rounded-lg border border-purple-700/30">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">{hotel.name}</h3>
                    <p className="text-white/60 text-sm">{hotel.city}, {hotel.country}</p>
                    <p className="text-white/40 text-xs">
                      Submitted by {hotel.profiles?.first_name} {hotel.profiles?.last_name} on {new Date(hotel.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {getStatusBadge(hotel.status)}
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-white border-purple-600 hover:bg-purple-800/50"
                        onClick={() => handleViewHotel(hotel.id)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      
                      {hotel.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleApprove(hotel.id)}
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Approve
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="destructive"
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => handleReject(hotel.id, "Rejected by admin")}
                          >
                            <X className="h-3 w-3 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Hotels Section */}
      <Card className="bg-purple-900/20 border-purple-800/30">
        <CardHeader>
          <CardTitle className="text-white">All Hotels ({allHotels.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {allHotels.length === 0 ? (
            <div className="text-center py-8 text-white/60">
              <p>No hotels found in the database.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {allHotels.map((hotel) => (
                <div key={hotel.id} className="flex items-center justify-between p-4 bg-purple-800/20 rounded-lg border border-purple-700/30">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">{hotel.name}</h3>
                    <p className="text-white/60 text-sm">{hotel.city}, {hotel.country}</p>
                    <p className="text-white/40 text-xs">
                      Created on {new Date(hotel.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {getStatusBadge(hotel.status)}
                    
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-white border-purple-600 hover:bg-purple-800/50"
                      onClick={() => handleViewHotel(hotel.id)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
