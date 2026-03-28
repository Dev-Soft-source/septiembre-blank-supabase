import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  MessageSquare, 
  Users, 
  Calendar, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  Clock,
  Send
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { isLovableDevelopmentMode } from '@/utils/dashboardSecurity';

interface GroupDeal {
  id: string;
  leader_id: string;
  deal_title: string;
  group_size: number;
  proposed_dates: string;
  special_price: number;
  message: string;
  status: string;
  hotel_response: string;
  created_at: string;
  updated_at: string;
  leader_profile?: {
    first_name: string;
    last_name: string;
  };
}

export default function GroupDealResponsesContent() {
  const [deals, setDeals] = useState<GroupDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [counterOffers, setCounterOffers] = useState<Record<string, string>>({});
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchGroupDeals();
  }, [user]);

  const fetchGroupDeals = async () => {
    try {
      // Group deals feature has been discontinued
      setDeals([]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching group deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateDealStatus = async (dealId: string, status: string, response?: string, counterPrice?: string) => {
    // Feature discontinued - no updates possible
    toast({
      title: "Feature Unavailable",
      description: "Group deal feature is currently discontinued.",
      variant: "destructive"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-500';
      case 'declined':
        return 'bg-red-500';
      case 'negotiating':
        return 'bg-blue-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'expired':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-4 h-4" />;
      case 'declined':
        return <XCircle className="w-4 h-4" />;
      case 'negotiating':
        return <MessageSquare className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Group Deal Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          {deals.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Group Deal Feature Discontinued</h3>
              <p className="text-muted-foreground">
                The group deal request feature is currently not available. Please contact support for more information.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {deals.map((deal) => (
                <Card key={deal.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Deal Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{deal.deal_title}</h3>
                          <p className="text-sm text-muted-foreground">
                            From: {deal.leader_profile?.first_name} {deal.leader_profile?.last_name}
                          </p>
                        </div>
                        <Badge className={getStatusColor(deal.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(deal.status)}
                            {deal.status}
                          </span>
                        </Badge>
                      </div>

                      {/* Deal Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span>{deal.group_size} participants</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>{deal.proposed_dates}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-muted-foreground" />
                          <span>${deal.special_price} total</span>
                        </div>
                      </div>

                      {/* Message */}
                      <div className="bg-muted p-3 rounded">
                        <p className="text-sm">{deal.message}</p>
                      </div>

                      {/* Hotel Response */}
                      {deal.hotel_response && (
                        <div className="bg-blue-50 border-l-2 border-blue-200 p-3 rounded">
                          <p className="text-sm font-medium text-blue-900 mb-1">Your Response:</p>
                          <p className="text-sm text-blue-800">{deal.hotel_response}</p>
                        </div>
                      )}

                      {/* Action Buttons - Only show for pending or negotiating deals */}
                      {(deal.status === 'pending' || deal.status === 'negotiating') && (
                        <div className="space-y-4 pt-4 border-t">
                          <div className="grid gap-4">
                            <Textarea
                              placeholder="Write your response to the group leader..."
                              value={responses[deal.id] || ''}
                              onChange={(e) => setResponses(prev => ({ ...prev, [deal.id]: e.target.value }))}
                              rows={3}
                            />
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                placeholder="Counter offer ($)"
                                value={counterOffers[deal.id] || ''}
                                onChange={(e) => setCounterOffers(prev => ({ ...prev, [deal.id]: e.target.value }))}
                                className="w-32"
                              />
                              <span className="text-sm text-muted-foreground">Optional counter-offer</span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              onClick={() => updateDealStatus(deal.id, 'accepted', responses[deal.id], counterOffers[deal.id])}
                              className="bg-green-600 hover:bg-green-700"
                              disabled={!responses[deal.id]}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Accept Deal
                            </Button>
                            <Button
                              onClick={() => updateDealStatus(deal.id, 'negotiating', responses[deal.id], counterOffers[deal.id])}
                              variant="outline"
                              disabled={!responses[deal.id]}
                            >
                              <Send className="w-4 h-4 mr-2" />
                              Send Response
                            </Button>
                            <Button
                              onClick={() => updateDealStatus(deal.id, 'declined', responses[deal.id] || 'Deal declined')}
                              variant="destructive"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Decline
                            </Button>
                          </div>
                        </div>
                      )}
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