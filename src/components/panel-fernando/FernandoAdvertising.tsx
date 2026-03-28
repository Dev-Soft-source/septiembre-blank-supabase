
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Eye, Megaphone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function FernandoAdvertising() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAdvertisingRequests = async () => {
    try {
      // Fetch advertising requests without trying to join profiles (relationship doesn't exist)
      const { data: requestsData, error } = await supabase
        .from('advertising_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const requests = requestsData || [];
      
      // Fetch user profiles separately if user_id exists
      const userIds = [...new Set(requests.map(r => r.user_id).filter(Boolean))];
      let profilesData = [];
      
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, first_name, last_name')
          .in('id', userIds);
        profilesData = profiles || [];
      }

      // Combine requests with profile data
      const enrichedRequests = requests.map(request => {
        const profile = profilesData.find(p => p.id === request.user_id);
        return {
          ...request,
          user_name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown' : null
        };
      });

      setRequests(enrichedRequests);
    } catch (error) {
      console.error('Error fetching advertising requests:', error);
      toast({
        title: "Error",
        description: "Failed to fetch advertising requests",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvertisingRequests();
  }, []);

  if (loading) {
    return (
      <Card className="bg-purple-900/20 border-purple-800/30">
        <CardContent className="p-6">
          <div className="text-center text-white/60">Loading advertising requests...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Advertising Requests</h2>
          <p className="text-white/60">Manage hotel requests for Free Nights for Advertising campaign</p>
        </div>
      </div>

      <Card className="bg-purple-900/20 border-purple-800/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Megaphone className="w-5 h-5" />
            Free Nights for Advertising Program ({requests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-12 text-white/60">
              <Megaphone className="w-12 h-12 mx-auto mb-4 text-white/40" />
              <h3 className="text-lg font-semibold mb-2">No advertising requests yet</h3>
              <p>Hotels can request to join the Free Nights for Advertising program.</p>
              <p className="text-sm mt-2">Requests will appear here for review and approval.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div key={request.id} className="p-4 bg-purple-800/20 rounded-lg border border-purple-700/30">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-white font-semibold">{request.contact_name}</h4>
                      <p className="text-white/60 text-sm">{request.contact_email}</p>
                      {request.user_name && (
                        <p className="text-white/40 text-xs">User: {request.user_name}</p>
                      )}
                      
                      {request.available_months && request.available_months.length > 0 && (
                        <div className="mt-2">
                          <p className="text-white/40 text-xs mb-1">Available months:</p>
                          <div className="flex flex-wrap gap-1">
                            {request.available_months.map((month: string, index: number) => (
                              <Badge key={index} className="bg-blue-600/20 text-blue-300 text-xs">
                                {month}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-2 flex items-center gap-4">
                        <span className="text-white/40 text-xs">
                          Submitted: {new Date(request.created_at).toLocaleDateString()}
                        </span>
                        {request.terms_accepted && (
                          <Badge className="bg-green-600/20 text-green-300 text-xs">
                            Terms Accepted
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-white border-purple-600 hover:bg-purple-800/50"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                      
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Approve
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="destructive"
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Decline
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Program Information */}
      <Card className="bg-purple-900/20 border-purple-800/30">
        <CardHeader>
          <CardTitle className="text-white">Program Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-purple-800/20 rounded-lg">
              <h4 className="text-white font-semibold mb-2">How It Works</h4>
              <ul className="text-white/60 text-sm space-y-1">
                <li>• Hotels offer free nights in exchange for promotion</li>
                <li>• Platform promotes participating hotels</li>
                <li>• Increased visibility and bookings for hotels</li>
                <li>• Free accommodation for selected guests</li>
              </ul>
            </div>
            
            <div className="p-4 bg-purple-800/20 rounded-lg">
              <h4 className="text-white font-semibold mb-2">Requirements</h4>
              <ul className="text-white/60 text-sm space-y-1">
                <li>• Hotel must be approved on platform</li>
                <li>• Minimum availability commitment</li>
                <li>• Agreement to promotional terms</li>
                <li>• Quality standards compliance</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
