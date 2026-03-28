
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type NotificationType = 'booking' | 'review' | 'message';

export function useSendNotification() {
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const sendNotification = async (
    type: NotificationType, 
    recipient: string, 
    data: Record<string, any>
  ) => {
    setIsSending(true);
    
    try {
      // Get current session to ensure we have auth
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session) {
        throw new Error("Authentication required to send notifications");
      }
      
      const { data: response, error } = await supabase.functions.invoke('send-notification', {
        body: { type, recipient, data }
      });
      
      if (error) throw error;
      
      console.log("Notification sent:", response);
      toast({
        title: "Notification Sent",
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} notification sent to ${recipient}`
      });
      
      return response;
    } catch (error: any) {
      console.error("Error sending notification:", error);
      toast({
        title: "Error Sending Notification",
        description: error.message || "Failed to send notification",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsSending(false);
    }
  };

  return { sendNotification, isSending };
}
