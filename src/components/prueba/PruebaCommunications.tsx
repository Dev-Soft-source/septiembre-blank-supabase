
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Download, Edit, Trash2, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface AdminMessage {
  id: string;
  message: string;
  subject?: string;
  status: string;
  hotel_id?: string;
  user_id?: string;
  created_at: string;
  updated_at: string;
  user_email?: string;
  user_name?: string;
  hotel_name?: string;
}

export default function PruebaCommunications() {
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data: messagesData, error } = await supabase
        .from('admin_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Manually join with profiles to get user info
      const messagesWithUserInfo = await Promise.all(
        (messagesData || []).map(async (message) => {
          let userInfo = {};
          let hotelInfo = {};

          if (message.user_id) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('first_name, last_name')
              .eq('id', message.user_id)
              .single();
            
            if (profile) {
              userInfo = {
                user_name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown User'
              };
            }

            // Get user email from auth metadata if available
            const { data: { user }, error: authError } = await supabase.auth.admin.getUserById(message.user_id);
            if (!authError && user) {
              userInfo = { ...userInfo, user_email: user.email };
            }
          }

          if (message.hotel_id) {
            const { data: hotel } = await supabase
              .from('hotels')
              .select('name')
              .eq('id', message.hotel_id)
              .single();
            
            if (hotel) {
              hotelInfo = { hotel_name: hotel.name };
            }
          }

          return {
            ...message,
            ...userInfo,
            ...hotelInfo
          } as AdminMessage;
        })
      );

      setMessages(messagesWithUserInfo);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to fetch messages",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('admin_messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;

      setMessages(prev => prev.filter(message => message.id !== messageId));
      toast({
        description: "Message deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive"
      });
    }
  };

  const filteredMessages = messages.filter(message =>
    message.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.hotel_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <Card className="bg-[#7a0486] border-purple-600">
          <CardContent className="p-6">
            <div className="text-center text-white">Loading communications...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Communications Management</h2>
        <div className="flex gap-2">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Message
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
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-purple-800/50 border-purple-600 text-white placeholder:text-white/60"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Messages Table */}
      <Card className="bg-[#7a0486] border-purple-600">
        <CardHeader>
          <CardTitle className="text-white">Messages ({filteredMessages.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-purple-600">
                  <th className="text-left p-3 text-white">Subject</th>
                  <th className="text-left p-3 text-white">Message</th>
                  <th className="text-left p-3 text-white">User</th>
                  <th className="text-left p-3 text-white">Hotel</th>
                  <th className="text-left p-3 text-white">Status</th>
                  <th className="text-left p-3 text-white">Date</th>
                  <th className="text-left p-3 text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMessages.map((message) => (
                  <tr key={message.id} className="border-b border-purple-600/30 hover:bg-purple-800/20">
                    <td className="p-3 text-white font-medium">{message.subject || '-'}</td>
                    <td className="p-3 text-white/80 max-w-xs truncate">{message.message}</td>
                    <td className="p-3 text-white/80">
                      <div>
                        <div>{message.user_name || 'Unknown'}</div>
                        <div className="text-xs text-white/60">{message.user_email || ''}</div>
                      </div>
                    </td>
                    <td className="p-3 text-white/80">{message.hotel_name || '-'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        message.status === 'sent' ? 'bg-green-600 text-white' :
                        message.status === 'pending' ? 'bg-yellow-600 text-white' :
                        'bg-gray-600 text-white'
                      }`}>
                        {message.status}
                      </span>
                    </td>
                    <td className="p-3 text-white/80">
                      {new Date(message.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <Send className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          className="h-8 w-8 p-0 bg-red-600 hover:bg-red-700"
                          onClick={() => deleteMessage(message.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
