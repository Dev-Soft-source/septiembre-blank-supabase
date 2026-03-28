
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Download, Edit, Trash2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";

interface Hotel {
  id: string;
  name: string;
  city: string;
  country: string;
  status: string;
  price_per_month: number;
  created_at: string;
}

export default function PruebaHotels() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  console.log('PruebaHotels component loaded');

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      console.log('Fetching hotels...');
      setLoading(true);
      const { data, error } = await supabase
        .from('hotels')
        .select('id, name, city, country, status, price_per_month, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log('Hotels fetched:', data?.length);
      setHotels(data || []);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      toast({
        title: "Error",
        description: "Failed to fetch hotels",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredHotels = hotels.filter(hotel =>
    hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusDisplay = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return { text: 'Published', className: 'bg-green-600' };
      case 'pending':
        return { text: 'Pending', className: 'bg-yellow-600' };
      case 'rejected':
        return { text: 'Rejected', className: 'bg-red-600' };
      default:
        return { text: 'Unknown', className: 'bg-gray-600' };
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Card className="bg-[#7a0486] border-purple-600">
          <CardContent className="p-6">
            <div className="text-center text-white">Loading hotels...</div>
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
          <p className="text-white/80 mt-1">
            Total: {hotels.length} | Published: {hotels.filter(h => h.status === 'approved').length} | 
            Pending: {hotels.filter(h => h.status === 'pending').length}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={fetchHotels}
            className="flex items-center gap-2"
            variant="outline"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Hotel
          </Button>
          <Button className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Search Controls */}
      <Card className="bg-[#7a0486] border-purple-600">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search hotels..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-purple-800/50 border-purple-600 text-white placeholder:text-white/60"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hotels Table */}
      <Card className="bg-[#7a0486] border-purple-600">
        <CardHeader>
          <CardTitle className="text-white">Hotels ({filteredHotels.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-purple-600">
                  <th className="text-left p-3 text-white">Name</th>
                  <th className="text-left p-3 text-white">Location</th>
                  <th className="text-left p-3 text-white">Status</th>
                  <th className="text-left p-3 text-white">Price/Month</th>
                  <th className="text-left p-3 text-white">Created</th>
                  <th className="text-left p-3 text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredHotels.map((hotel) => {
                  const statusDisplay = getStatusDisplay(hotel.status);
                  return (
                    <tr key={hotel.id} className="border-b border-purple-600/30 hover:bg-purple-800/20">
                      <td className="p-3 text-white font-medium">{hotel.name}</td>
                      <td className="p-3 text-white/80">{hotel.city}, {hotel.country}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs text-white ${statusDisplay.className}`}>
                          {statusDisplay.text}
                        </span>
                      </td>
                      <td className="p-3 text-white/80">€{hotel.price_per_month}</td>
                      <td className="p-3 text-white/80">
                        {new Date(hotel.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" className="h-8 w-8 p-0 bg-red-600 hover:bg-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
