
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function FernandoBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    completedBookings: 0
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      // Fetch bookings without trying to join profiles (relationship doesn't exist)
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          hotels(name)
        `)
        .order('created_at', { ascending: false });

      if (bookingsError) throw bookingsError;
      
      const bookings = bookingsData || [];
      
      // Fetch user profiles separately to get user names
      const userIds = [...new Set(bookings.map(b => b.user_id).filter(Boolean))];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', userIds);

      // Combine bookings with profile data
      const enrichedBookings = bookings.map(booking => {
        const profile = profilesData?.find(p => p.id === booking.user_id);
        return {
          ...booking,
          user_name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown' : 'Unknown'
        };
      });

      setBookings(enrichedBookings);

      // Calculate stats
      setStats({
        totalBookings: enrichedBookings.length,
        pendingBookings: enrichedBookings.filter(b => b.status === 'pending').length,
        confirmedBookings: enrichedBookings.filter(b => b.status === 'confirmed').length,
        completedBookings: enrichedBookings.filter(b => b.status === 'completed').length
      });
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch bookings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleViewHotel = (hotelId: string) => {
    navigate(`/hotel/${hotelId}`);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-600', text: 'Pending' },
      confirmed: { color: 'bg-blue-600', text: 'Confirmed' },
      completed: { color: 'bg-green-600', text: 'Completed' },
      cancelled: { color: 'bg-red-600', text: 'Cancelled' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <Badge className={`${config.color} text-white`}>
        {config.text}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card className="bg-purple-900/20 border-purple-800/30">
        <CardContent className="p-6">
          <div className="text-center text-white/60">Loading bookings...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Bookings Management</h2>
          <p className="text-white/60">View and manage all bookings on the platform</p>
        </div>
      </div>

      {/* Booking Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-purple-900/20 border-purple-800/30">
          <CardContent className="p-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white">Total Bookings</h3>
              <p className="text-2xl font-bold text-blue-400">{stats.totalBookings}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-900/20 border-purple-800/30">
          <CardContent className="p-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white">Pending</h3>
              <p className="text-2xl font-bold text-yellow-400">{stats.pendingBookings}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-900/20 border-purple-800/30">
          <CardContent className="p-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white">Confirmed</h3>
              <p className="text-2xl font-bold text-blue-400">{stats.confirmedBookings}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-900/20 border-purple-800/30">
          <CardContent className="p-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white">Completed</h3>
              <p className="text-2xl font-bold text-green-400">{stats.completedBookings}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bookings List */}
      <Card className="bg-purple-900/20 border-purple-800/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            All Bookings ({bookings.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <div className="text-center py-8 text-white/60">
              <p>No bookings found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 bg-purple-800/20 rounded-lg border border-purple-700/30">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">${Number(booking.total_price).toLocaleString()}</h3>
                    <p className="text-white/60 text-sm">
                      Hotel: {booking.hotels?.name || 'N/A'}
                    </p>
                    <p className="text-white/40 text-xs">
                      Guest: {booking.user_name}
                    </p>
                    <p className="text-white/40 text-xs">
                      Check-in: {new Date(booking.check_in).toLocaleDateString()} | 
                      Check-out: {new Date(booking.check_out).toLocaleDateString()}
                    </p>
                    <p className="text-white/40 text-xs">
                      Booked: {new Date(booking.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {booking.hotel_id && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-white border-purple-600"
                        onClick={() => handleViewHotel(booking.hotel_id)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View Hotel
                      </Button>
                    )}
                    {getStatusBadge(booking.status)}
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
