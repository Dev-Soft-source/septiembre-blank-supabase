
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SendMessageDialogProps {
  hotelId: string;
  hotelName: string;
}

export const SendMessageDialog = ({ hotelId, hotelName }: SendMessageDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await (supabase as any)
        .from('admin_messages')
        .insert({
          hotel_id: hotelId,
          content: message.trim(),
          admin_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;

      toast({
        title: "Message sent",
        description: "Your message has been sent to the hotel manager"
      });
      
      setMessage("");
      setIsOpen(false);
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />
          Send Message to Hotel
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#5A0080]">
        <DialogHeader>
          <DialogTitle className="text-white">Send Message to {hotelName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="Type your message to the hotel manager..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[120px] bg-fuchsia-950/30 border-fuchsia-800/30 text-white"
            rows={5}
          />
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSendMessage}
              disabled={isLoading || !message.trim()}
              className="bg-fuchsia-600 hover:bg-fuchsia-700"
            >
              {isLoading ? "Sending..." : "Send Message"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
