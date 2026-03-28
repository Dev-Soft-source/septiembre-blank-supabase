// @ts-nocheck
// TypeScript checking disabled for Supabase schema compatibility
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { UserRoles } from "@/components/dashboard/user/UserRoles";
import { MyAffinities } from "@/components/dashboard/user/MyAffinities";
import { AvatarUpload } from "@/components/dashboard/user/AvatarUpload";
import { UserAffinities } from "@/components/dashboard/user/UserAffinities";
import { ReferralCodeDisplay } from "@/components/dashboard/shared/ReferralCodeDisplay";
import { useTranslation } from "@/hooks/useTranslation";

const ProfileContent = () => {
  const { profile, user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation('dashboard/profile');
  const [firstName, setFirstName] = useState(profile?.first_name || "");
  const [lastName, setLastName] = useState(profile?.last_name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [address, setAddress] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referralCode, setReferralCode] = useState<string>('');

  useEffect(() => {
    const fetchReferralCode = async () => {
      if (!user?.id) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('referral_code')
        .eq('id', user.id)
        .maybeSingle();
      
      if (data?.referral_code) {
        setReferralCode(data.referral_code);
      }
    };

    fetchReferralCode();
  }, [user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setIsSubmitting(true);
    try {
      if (!user) throw new Error("No user found");
      
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          phone: phone,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: t('profileUpdated'),
        description: t('profileUpdated'),
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: t('error'),
        description: t('error'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
          <CardDescription>{t('subtitle')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <AvatarUpload />
            <div className="space-y-1 flex-1">
              <h3 className="text-xl font-semibold">
                {profile?.first_name || ""} {profile?.last_name || ""}
              </h3>
              <div className="text-sm text-muted-foreground flex flex-col sm:flex-row sm:gap-2">
                <span>{user?.email}</span>
                <Badge variant="default" className="max-w-fit">
                  Verified
                </Badge>
              </div>
            </div>
          </div>

          {/* Add User Roles Section */}
          <UserRoles />

          <form onSubmit={handleSubmit} className="space-y-4">
            {isEditing ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium">
                      {t('firstName')}
                    </label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder={t('firstName')}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium">
                      {t('lastName')}
                    </label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder={t('lastName')}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    {t('phone')} {t('optional')}
                  </label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t('phone')}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="address" className="text-sm font-medium">
                    {t('address')} {t('optional')}
                  </label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={t('address')}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? t('saving') : t('saveChanges')}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    disabled={isSubmitting}
                  >
                    {t('cancel')}
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{t('firstName')}</p>
                    <p className="font-medium">{profile?.first_name || "-"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{t('lastName')}</p>
                    <p className="font-medium">{profile?.last_name || "-"}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{t('email')} {t('readOnly')}</p>
                  <p className="font-medium">{user?.email || "-"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{t('phone')}</p>
                  <p className="font-medium">{profile?.phone || "-"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{t('address')}</p>
                  <p className="font-medium">{address || "-"}</p>
                </div>
                {referralCode && (
                  <ReferralCodeDisplay code={referralCode} />
                )}
                <Button type="button" onClick={() => setIsEditing(true)}>
                  {t('editProfile')}
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Add User Affinities Section */}
      <UserAffinities />

      {/* Add My Affinities Section */}
      <MyAffinities />
    </div>
  );
};

export default ProfileContent;