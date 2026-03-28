
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Reply, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AdminMessage {
  id: string;
  user_id?: string;
  hotel_id?: string;
  subject?: string;
  message: string;
  status?: string;
  created_at: string;
  hotel_name?: string;
  user_name?: string;
}

export default function FernandoCommunications() {
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCommunications = async () => {
    try {
      // Fetch admin messages
      const { data: messagesData, error } = await supabase
        .from('admin_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const messages = messagesData || [];
      
      // Fetch hotel and user profiles separately
      const hotelIds = [...new Set(messages.map(m => m.hotel_id).filter(Boolean))];
      const userIds = [...new Set(messages.map(m => m.user_id).filter(Boolean))];
      
      let hotelsData = [];
      let profilesData = [];
      
      if (hotelIds.length > 0) {
        const { data: hotels } = await supabase
          .from('hotels')
          .select('id, name')
          .in('id', hotelIds);
        hotelsData = hotels || [];
      }
      
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, first_name, last_name')
          .in('id', userIds);
        profilesData = profiles || [];
      }

      // Combine messages with hotel and profile data
      const enrichedMessages: AdminMessage[] = messages.map(message => {
        const hotel = hotelsData.find(h => h.id === message.hotel_id);
        const profile = profilesData.find(p => p.id === message.user_id);
        return {
          ...message,
          hotel_name: hotel?.name || 'Unknown Hotel',
          user_name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown' : 'Unknown'
        };
      });

      setMessages(enrichedMessages);
    } catch (error) {
      console.error('Error fetching communications:', error);
      toast({
        title: "Error",
        description: "Failed to fetch communications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunications();
  }, []);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-600', text: 'Pending' },
      replied: { color: 'bg-green-600', text: 'Replied' },
      closed: { color: 'bg-gray-600', text: 'Closed' }
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
          <div className="text-center text-white/60">Loading communications...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Hotel Communications</h2>
          <p className="text-white/60">Manage messages and communications from hotels</p>
        </div>
      </div>

      <Card className="bg-purple-900/20 border-purple-800/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Hotel Messages ({messages.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <div className="text-center py-12 text-white/60">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-white/40" />
              <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
              <p>Hotel messages and communications will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="p-4 bg-purple-800/20 rounded-lg border border-purple-700/30">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-white font-semibold">{message.subject || 'No Subject'}</h4>
                      <p className="text-white/60 text-sm">
                        From: {message.hotel_name} | Contact: {message.user_name}
                      </p>
                      <p className="text-white/40 text-xs flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        {new Date(message.created_at).toLocaleDateString()} at {new Date(message.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(message.status || 'pending')}
                    </div>
                  </div>
                  
                  {message.message && (
                    <div className="mb-3">
                      <p className="text-white/80 text-sm bg-purple-900/30 p-3 rounded border-l-4 border-purple-600">
                        {message.message}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Reply className="h-3 w-3 mr-1" />
                      Reply
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-white border-purple-600 hover:bg-purple-800/50"
                    >
                      Mark as Read
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
