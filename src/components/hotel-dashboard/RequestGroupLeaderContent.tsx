import React, { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Activity, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export function RequestGroupLeaderContent() {
  const { t } = useTranslation("dashboard");
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    affinity: "",
    requested_dates: "",
    rooms_requested: "",
    contact_email: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to submit a request",
        variant: "destructive"
      });
      return;
    }

    if (!formData.affinity || !formData.requested_dates || !formData.rooms_requested || !formData.contact_email) {
      toast({
        title: "Error", 
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Get hotel ID for the current user
      const { data: hotels, error: hotelError } = await supabase
        .from('hotels')
        .select('id')
        .eq('owner_id', user.id)
        .limit(1);

      if (hotelError || !hotels || hotels.length === 0) {
        toast({
          title: "Error",
          description: "No hotel found for your account",
          variant: "destructive"
        });
        return;
      }

      // Group leader requests feature has been discontinued
      toast({
        title: "Feature Unavailable",
        description: "Group leader request feature is currently discontinued. Please contact support for assistance.",
        variant: "destructive"
      });
      return;

      // Reset form
      setFormData({
        affinity: "",
        requested_dates: "",
        rooms_requested: "",
        contact_email: ""
      });

    } catch (error) {
      console.error('Error submitting request:', error);
      toast({
        title: "Error",
        description: "Failed to submit your request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Information Card */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">
              {t('requestGroupLeader.title', 'Why Request a Group Leader?')}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {t('requestGroupLeader.subtitle', 'The Group Leader is essential for your hotel success')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <Users className="w-5 h-5 text-primary mt-1" />
              <p className="text-foreground">
                {t('requestGroupLeader.benefit1', 'They bring clients to your hotel')}
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <Activity className="w-5 h-5 text-primary mt-1" />
              <p className="text-foreground">
                {t('requestGroupLeader.benefit2', 'They organize activities for guests')}
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-primary mt-1" />
              <p className="text-foreground">
                {t('requestGroupLeader.benefit3', 'They take care of the group all day')}
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-primary mt-1" />
              <p className="text-foreground">
                {t('requestGroupLeader.benefit4', 'They act as the unique link between guests and hotel')}
              </p>
            </div>
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-foreground">
                <strong>{t('requestGroupLeader.commission', 'Commission:')}</strong>{' '}
                {t('requestGroupLeader.commissionText', 'The Leader only works based on a 5% bonus: initially to cover their own expenses, and once those are covered, the remaining is a cash bonus.')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Request Form */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">
              {t('requestGroupLeader.formTitle', 'Request a Group Leader')}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {t('requestGroupLeader.formDescription', 'Fill out the form below to request a group leader for your hotel')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="affinity" className="text-foreground">
                  {t('requestGroupLeader.affinity', 'Affinity')} *
                </Label>
                <Input
                  id="affinity"
                  value={formData.affinity}
                  onChange={(e) => setFormData(prev => ({ ...prev, affinity: e.target.value }))}
                  placeholder={t('requestGroupLeader.affinityPlaceholder', 'e.g., SEA, Technology, Arts')}
                  className="bg-background border-border text-foreground"
                  required
                />
              </div>

              <div>
                <Label htmlFor="dates" className="text-foreground">
                  {t('requestGroupLeader.dates', 'Requested Dates')} *
                </Label>
                <Textarea
                  id="dates"
                  value={formData.requested_dates}
                  onChange={(e) => setFormData(prev => ({ ...prev, requested_dates: e.target.value }))}
                  placeholder={t('requestGroupLeader.datesPlaceholder', 'e.g., June, July, August 2024')}
                  className="bg-background border-border text-foreground"
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="rooms" className="text-foreground">
                  {t('requestGroupLeader.rooms', 'Number of Rooms Requested')} *
                </Label>
                <Input
                  id="rooms"
                  type="number"
                  min="1"
                  value={formData.rooms_requested}
                  onChange={(e) => setFormData(prev => ({ ...prev, rooms_requested: e.target.value }))}
                  placeholder={t('requestGroupLeader.roomsPlaceholder', 'e.g., 40')}
                  className="bg-background border-border text-foreground"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-foreground">
                  {t('requestGroupLeader.email', 'Contact Email Address')} *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                  placeholder={t('requestGroupLeader.emailPlaceholder', 'your.email@example.com')}
                  className="bg-background border-border text-foreground"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting 
                  ? t('requestGroupLeader.submitting', 'Submitting...') 
                  : t('requestGroupLeader.submit', 'Submit Request')
                }
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}