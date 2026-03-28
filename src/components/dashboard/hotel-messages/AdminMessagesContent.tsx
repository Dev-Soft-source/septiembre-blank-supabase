// @ts-nocheck
// TypeScript checking disabled for Supabase schema compatibility
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { MessageCircle, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";
import { useTranslation } from "@/hooks/useTranslation";

interface AdminMessage {
  id: string;
  content: string;
  created_at: string;
  hotel_id: string;
  admin_id: string | null;
}

export const AdminMessagesContent = () => {
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { t } = useTranslation('dashboard/content');

  useEffect(() => {
    if (!user) return;

    const fetchMessages = async () => {
      try {
        // First get the hotels owned by the current user
        const { data: userHotels, error: hotelsError } = await supabase
          .from('hotels')
          .select('id')
          .eq('owner_id', user.id);

        if (hotelsError) throw hotelsError;

        if (!userHotels || userHotels.length === 0) {
          setMessages([]);
          setLoading(false);
          return;
        }

        const hotelIds = userHotels.map(hotel => hotel.id);

        // Fetch messages for user's hotels using type assertion
        const { data: messagesData, error: messagesError } = await (supabase as any)
          .from('admin_messages')
          .select('*')
          .in('hotel_id', hotelIds)
          .order('created_at', { ascending: false });

        if (messagesError) throw messagesError;

        setMessages(messagesData || []);
      } catch (error) {
        console.error("Error fetching admin messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-6">{t('messagesFromAdmin')}</h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          <span className="ml-3">Loading messages...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <MessageCircle className="w-6 h-6 text-fuchsia-400" />
        <h2 className="text-2xl font-bold">{t('messagesFromAdmin')}</h2>
      </div>

      {messages.length === 0 ? (
        <Card className="p-8 bg-fuchsia-950/30 border-fuchsia-800/30 text-center">
          <MessageCircle className="w-12 h-12 text-fuchsia-400 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-white mb-2">{t('noMessagesYet')}</h3>
          <p className="text-white/70">
            {t('noMessagesMessage')}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <Card key={message.id} className="p-6 bg-fuchsia-950/30 border-fuchsia-800/30">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-fuchsia-600 flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium text-fuchsia-200">Admin</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-white/60">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(message.created_at), "MMM d, yyyy 'at' h:mm a")}
                </div>
              </div>
              <div className="ml-10">
                <p className="text-white whitespace-pre-wrap">{message.content}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
