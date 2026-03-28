import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Calendar, 
  Users, 
  Hotel, 
  DollarSign, 
  Plus, 
  Edit2, 
  Trash2,
  CalendarCheck
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { isLovableDevelopmentMode } from '@/utils/dashboardSecurity';

interface GroupBooking {
  id: string;
  hotel_id: string;
  group_name: string;
  total_participants: number;
  check_in: string;
  check_out: string;
  total_price: number;
  status: string;
  special_requirements: string;
  created_at: string;
  hotel?: {
    name: string;
    city: string;
    country: string;
  };
}

interface BookingForm {
  hotel_id: string;
  group_name: string;
  total_participants: number;
  check_in: string;
  check_out: string;
  total_price: number;
  special_requirements: string;
}

export default function GroupBookingIntegrationContent() {
  const [bookings, setBookings] = useState<GroupBooking[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<BookingForm>({
    hotel_id: '',
    group_name: '',
    total_participants: 1,
    check_in: '',
    check_out: '',
    total_price: 0,
    special_requirements: ''
  });
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchBookings();
    fetchHotels();
  }, [user]);

  const fetchBookings = async () => {
    try {
      const userId = isLovableDevelopmentMode() ? 'dev-user' : user?.id;
      if (!userId) return;

      if (isLovableDevelopmentMode()) {
        // Mock data for development
        const mockBookings: GroupBooking[] = [
          {
            id: '1',
            hotel_id: 'hotel-1',
            group_name: 'Technology Retreat',
            total_participants: 15,
            check_in: '2024-03-15',
            check_out: '2024-03-17',
            total_price: 1200,
            status: 'confirmed',
            special_requirements: 'Meeting room, strong WiFi, vegetarian options',
            created_at: new Date().toISOString(),
            hotel: {
              name: 'Tech Hub Hotel',
              city: 'San Francisco',
              country: 'USA'
            }
          }
        ];
        setBookings(mockBookings);
        setLoading(false);
        return;
      }

      // Group bookings feature has been discontinued
      setBookings([]);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHotels = async () => {
    try {
      const { data, error } = await supabase
        .from('hotels')
        .select('id, name, city, country')
        .eq('status', 'approved')
        .limit(20);

      if (error) throw error;
      setHotels(data || []);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const userId = isLovableDevelopmentMode() ? 'dev-user' : user?.id;
      if (!userId) return;

      const bookingData = {
        ...formData,
        leader_id: userId,
        total_price: parseFloat(formData.total_price.toString())
      };

      // Group bookings feature has been discontinued
      toast({
        title: "Feature Unavailable",
        description: "Group booking feature is currently discontinued.",
        variant: "destructive"
      });
      return;

      toast({
        title: editingId ? "Booking Updated" : "Booking Created",
        description: `Group booking has been ${editingId ? 'updated' : 'created'} successfully.`
      });

      setShowForm(false);
      setEditingId(null);
      resetForm();
      fetchBookings();
    } catch (error) {
      console.error('Error saving booking:', error);
      toast({
        title: "Error",
        description: "Failed to save booking. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (booking: GroupBooking) => {
    setFormData({
      hotel_id: booking.hotel_id,
      group_name: booking.group_name,
      total_participants: booking.total_participants,
      check_in: booking.check_in,
      check_out: booking.check_out,
      total_price: booking.total_price,
      special_requirements: booking.special_requirements
    });
    setEditingId(booking.id);
    setShowForm(true);
  };

  const handleDelete = async (bookingId: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;

    try {
      // Group bookings feature has been discontinued
      toast({
        title: "Feature Unavailable",
        description: "Group booking feature is currently discontinued.",
        variant: "destructive"
      });
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast({
        title: "Error",
        description: "Failed to delete booking. Please try again.",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      hotel_id: '',
      group_name: '',
      total_participants: 1,
      check_in: '',
      check_out: '',
      total_price: 0,
      special_requirements: ''
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500';
      case 'draft':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      case 'completed':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Group Booking Integration</h2>
        <Button onClick={() => { setShowForm(true); resetForm(); }}>
          <Plus className="w-4 h-4 mr-2" />
          New Group Booking
        </Button>
      </div>

      {/* Booking Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit' : 'Create'} Group Booking</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Hotel</label>
                  <select
                    value={formData.hotel_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, hotel_id: e.target.value }))}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select a hotel</option>
                    {hotels.map(hotel => (
                      <option key={hotel.id} value={hotel.id}>
                        {hotel.name} - {hotel.city}, {hotel.country}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Group Name</label>
                  <Input
                    value={formData.group_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, group_name: e.target.value }))}
                    placeholder="Enter group name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Total Participants</label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.total_participants}
                    onChange={(e) => setFormData(prev => ({ ...prev, total_participants: parseInt(e.target.value) }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Total Price ($)</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.total_price}
                    onChange={(e) => setFormData(prev => ({ ...prev, total_price: parseFloat(e.target.value) }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Check-in Date</label>
                  <Input
                    type="date"
                    value={formData.check_in}
                    onChange={(e) => setFormData(prev => ({ ...prev, check_in: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Check-out Date</label>
                  <Input
                    type="date"
                    value={formData.check_out}
                    onChange={(e) => setFormData(prev => ({ ...prev, check_out: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Special Requirements</label>
                <Textarea
                  value={formData.special_requirements}
                  onChange={(e) => setFormData(prev => ({ ...prev, special_requirements: e.target.value }))}
                  placeholder="Any special requirements for the group..."
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">
                  {editingId ? 'Update' : 'Create'} Booking
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => { setShowForm(false); setEditingId(null); }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Bookings List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarCheck className="w-5 h-5" />
            Group Bookings
          </CardTitle>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <div className="text-center py-8">
              <CalendarCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Group Booking Feature Discontinued</h3>
              <p className="text-muted-foreground">
                The group booking feature is currently not available. Please contact support for assistance.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <Card key={booking.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{booking.group_name}</h3>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Hotel className="w-4 h-4" />
                            <span>{booking.hotel?.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>{booking.total_participants} participants</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{booking.check_in} to {booking.check_out}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            <span>${booking.total_price}</span>
                          </div>
                        </div>

                        {booking.special_requirements && (
                          <div className="mt-3 p-2 bg-muted rounded">
                            <p className="text-sm">{booking.special_requirements}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(booking)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(booking.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}