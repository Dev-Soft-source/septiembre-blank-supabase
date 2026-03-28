import React, { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, XCircle, Clock, Hotel, Users, Calendar, Mail } from "lucide-react";

interface GroupLeaderRequest {
  id: string;
  affinity: string;
  requested_dates: string;
  rooms_requested: number;
  contact_email: string;
  status: string;
  created_at: string;
  hotel: {
    name: string;
    city: string;
  };
}

export function LeaderRequestsContent() {
  const { t } = useTranslation("admin");
  const { toast } = useToast();
  const [requests, setRequests] = useState<GroupLeaderRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      // Group leader requests table was removed during database cleanup
      // This feature is no longer available
      setRequests([]);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast({
        title: "Error",
        description: "Failed to load leader requests",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId: string, newStatus: string) => {
    try {
      // Group leader requests table was removed during database cleanup
      // This feature is no longer available
      toast({
        title: "Info",
        description: "Leader requests feature is no longer available",
        variant: "default"
      });
    } catch (error) {
      console.error('Error updating request status:', error);
      toast({
        title: "Error",
        description: "Failed to update request status",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-foreground">Loading leader requests...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {t('leaderRequests.title', 'Leader Requests')}
        </h1>
        <p className="text-muted-foreground">
          {t('leaderRequests.description', 'Manage group leader requests from hotels')}
        </p>
      </div>

      {requests.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="text-center py-12">
            <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              {t('leaderRequests.noRequests', 'No leader requests found')}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {requests.map((request) => (
            <Card key={request.id} className="bg-card border-border">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <Hotel className="w-5 h-5" />
                      {request.hotel.name}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {request.hotel.city} • {new Date(request.created_at).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(request.status)}
                    <Badge className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      {request.affinity}
                    </Badge>
                    <span className="text-sm text-muted-foreground">Affinity</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{request.requested_dates}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{request.rooms_requested} rooms</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{request.contact_email}</span>
                  </div>
                </div>

                {request.status === 'pending' && (
                  <div className="flex gap-2 pt-4 border-t border-border">
                    <Button
                      onClick={() => updateRequestStatus(request.id, 'approved')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {t('leaderRequests.approve', 'Approve')}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => updateRequestStatus(request.id, 'rejected')}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      {t('leaderRequests.reject', 'Reject')}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}