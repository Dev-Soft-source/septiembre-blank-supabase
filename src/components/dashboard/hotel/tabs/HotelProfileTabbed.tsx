// @ts-nocheck
// TypeScript checking disabled for Supabase schema compatibility
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, MapPin, Building, CreditCard, Globe, Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ReferralCodeDisplay } from "@/components/dashboard/shared/ReferralCodeDisplay";
import { useTranslation } from "@/hooks/useTranslation";

interface BankingInfo {
  account_holder_name: string;
  iban_account: string;
  swift_bic: string;
  bank_name: string;
  bank_address: string;
  bank_country: string;
  [key: string]: string;
}

export const HotelProfileTabbed = () => {
  const { profile, user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation('dashboard/profile');
  
  // General Information State
  const [hotelName, setHotelName] = useState("");
  const [contactPerson, setContactPerson] = useState(profile?.first_name || "");
  const [contactEmail, setContactEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [address, setAddress] = useState("");
  const [referralCode, setReferralCode] = useState<string>('');
  
  // Banking Information State
  const [bankingInfo, setBankingInfo] = useState<BankingInfo>({
    account_holder_name: "",
    iban_account: "",
    swift_bic: "",
    bank_name: "",
    bank_address: "",
    bank_country: ""
  });
  
  // Edit states
  const [isEditingGeneral, setIsEditingGeneral] = useState(false);
  const [isEditingBanking, setIsEditingBanking] = useState(false);
  const [isSubmittingGeneral, setIsSubmittingGeneral] = useState(false);
  const [isSubmittingBanking, setIsSubmittingBanking] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.id) return;
      
      // Fetch referral code from profiles
      const { data: profileData } = await supabase
        .from('profiles')
        .select('referral_code')
        .eq('id', user.id)
        .maybeSingle();
      
      if (profileData?.referral_code) {
        setReferralCode(profileData.referral_code);
      }

      // Fetch hotel data
      const { data: hotelData } = await supabase
        .from('hotels')
        .select('name, contact_name, contact_email, contact_phone, address, banking_info')
        .eq('owner_id', user.id)
        .maybeSingle();
      
      if (hotelData) {
        setHotelName(hotelData.name || "");
        setContactPerson(hotelData.contact_name || profile?.first_name || "");
        setContactEmail(hotelData.contact_email || user?.email || "");
        setPhone(hotelData.contact_phone || profile?.phone || "");
        setAddress(hotelData.address || "");
        
        // Set banking info from hotel data
        if (hotelData.banking_info && typeof hotelData.banking_info === 'object') {
          const bankInfo = hotelData.banking_info as Record<string, any>;
          setBankingInfo({
            account_holder_name: bankInfo.account_holder_name || "",
            iban_account: bankInfo.iban_account || "",
            swift_bic: bankInfo.swift_bic || "",
            bank_name: bankInfo.bank_name || "",
            bank_address: bankInfo.bank_address || "",
            bank_country: bankInfo.bank_country || ""
          });
        }
      }
    };

    fetchProfileData();
  }, [user?.id, profile]);

  const handleGeneralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !user) return;

    setIsSubmittingGeneral(true);
    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: contactPerson,
          phone: phone,
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Update hotel data if exists
      const { error: hotelError } = await supabase
        .from('hotels')
        .update({
          contact_name: contactPerson,
          contact_email: contactEmail,
          contact_phone: phone,
          address: address,
        })
        .eq('owner_id', user.id);

      toast({
        title: t('profileUpdated'),
        description: t('profileUpdated'),
      });
      setIsEditingGeneral(false);
    } catch (error) {
      console.error("Error updating general information:", error);
      toast({
        variant: "destructive",
        title: t('error'),
        description: t('error'),
      });
    } finally {
      setIsSubmittingGeneral(false);
    }
  };

  const handleBankingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmittingBanking(true);
    try {
      // Update banking info in hotel record
      const { error: hotelError } = await supabase
        .from('hotels')
        .update({
          banking_info: bankingInfo as any
        })
        .eq('owner_id', user.id);

      if (hotelError) throw hotelError;

      toast({
        title: t('profileUpdated'),
        description: "Bank details updated successfully",
      });
      setIsEditingBanking(false);
    } catch (error) {
      console.error("Error updating banking information:", error);
      toast({
        variant: "destructive",
        title: t('error'),
        description: "Error updating bank details",
      });
    } finally {
      setIsSubmittingBanking(false);
    }
  };

  const handleBankingInputChange = (field: keyof BankingInfo, value: string) => {
    setBankingInfo(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="general">
                {t('language') === 'es' ? 'Datos Generales' : 
                 t('language') === 'pt' ? 'Dados Gerais' :
                 t('language') === 'ro' ? 'Date Generale' : 
                 'General Info'}
              </TabsTrigger>
              <TabsTrigger value="banking">
                {t('language') === 'es' ? 'Datos Bancarios' : 
                 t('language') === 'pt' ? 'Dados Bancários' :
                 t('language') === 'ro' ? 'Date Bancare' : 
                 'Bank Details'}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-6 mt-6">
              <form onSubmit={handleGeneralSubmit} className="space-y-4">
                {isEditingGeneral ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="hotelName" className="flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        {t('hotelName')} {t('readOnly')}
                      </Label>
                      <Input
                        id="hotelName"
                        value={hotelName}
                        className="bg-muted"
                        readOnly
                        placeholder={t('hotelName')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contactPerson" className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {t('contactPerson')}
                      </Label>
                      <Input
                        id="contactPerson"
                        value={contactPerson}
                        onChange={(e) => setContactPerson(e.target.value)}
                        placeholder={t('contactPerson')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail" className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {t('email')}
                      </Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder={t('email')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {t('phone')} {t('optional')}
                      </Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={t('phone')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address" className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {t('address')} {t('optional')}
                      </Label>
                      <Input
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder={t('address')}
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button type="submit" disabled={isSubmittingGeneral}>
                        {isSubmittingGeneral ? t('saving') : t('saveChanges')}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditingGeneral(false)}
                        disabled={isSubmittingGeneral}
                      >
                        {t('cancel')}
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        {t('hotelName')} {t('readOnly')}
                      </p>
                      <p className="font-medium">{hotelName || "-"}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {t('contactPerson')}
                      </p>
                      <p className="font-medium">{contactPerson || "-"}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {t('email')}
                      </p>
                      <p className="font-medium">{contactEmail || "-"}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {t('phone')}
                      </p>
                      <p className="font-medium">{phone || "-"}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {t('address')}
                      </p>
                      <p className="font-medium">{address || "-"}</p>
                    </div>
                    
                    {referralCode && (
                      <ReferralCodeDisplay code={referralCode} />
                    )}
                    
                    <Button type="button" onClick={() => setIsEditingGeneral(true)}>
                      {t('editProfile')}
                    </Button>
                  </div>
                )}
              </form>
            </TabsContent>
            
            <TabsContent value="banking" className="space-y-6 mt-6">
              <form onSubmit={handleBankingSubmit} className="space-y-4">
                {isEditingBanking ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="accountHolder" className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Account Holder Name
                      </Label>
                      <Input
                        id="accountHolder"
                        value={bankingInfo.account_holder_name}
                        onChange={(e) => handleBankingInputChange('account_holder_name', e.target.value)}
                        placeholder="Account holder name"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="iban" className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        IBAN / Account Number
                      </Label>
                      <Input
                        id="iban"
                        value={bankingInfo.iban_account}
                        onChange={(e) => handleBankingInputChange('iban_account', e.target.value)}
                        placeholder="IBAN or account number"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="swift" className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        SWIFT/BIC Code
                      </Label>
                      <Input
                        id="swift"
                        value={bankingInfo.swift_bic}
                        onChange={(e) => handleBankingInputChange('swift_bic', e.target.value)}
                        placeholder="SWIFT/BIC code"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bankName" className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        Bank Name
                      </Label>
                      <Input
                        id="bankName"
                        value={bankingInfo.bank_name}
                        onChange={(e) => handleBankingInputChange('bank_name', e.target.value)}
                        placeholder="Bank name"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bankAddress" className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Bank Address {t('optional')}
                      </Label>
                      <Input
                        id="bankAddress"
                        value={bankingInfo.bank_address}
                        onChange={(e) => handleBankingInputChange('bank_address', e.target.value)}
                        placeholder="Bank address"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bankCountry" className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Bank Country
                      </Label>
                      <Input
                        id="bankCountry"
                        value={bankingInfo.bank_country}
                        onChange={(e) => handleBankingInputChange('bank_country', e.target.value)}
                        placeholder="Bank country"
                        required
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button type="submit" disabled={isSubmittingBanking}>
                        {isSubmittingBanking ? t('saving') : t('saveChanges')}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditingBanking(false)}
                        disabled={isSubmittingBanking}
                      >
                        {t('cancel')}
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Account Holder Name
                      </p>
                      <p className="font-medium">{bankingInfo.account_holder_name || "-"}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        IBAN / Account Number
                      </p>
                      <p className="font-medium">{bankingInfo.iban_account || "-"}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        SWIFT/BIC Code
                      </p>
                      <p className="font-medium">{bankingInfo.swift_bic || "-"}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        Bank Name
                      </p>
                      <p className="font-medium">{bankingInfo.bank_name || "-"}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Bank Address
                      </p>
                      <p className="font-medium">{bankingInfo.bank_address || "-"}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Bank Country
                      </p>
                      <p className="font-medium">{bankingInfo.bank_country || "-"}</p>
                    </div>
                    
                    <Button type="button" onClick={() => setIsEditingBanking(true)}>
                      Edit Bank Details
                    </Button>
                  </div>
                )}
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default HotelProfileTabbed;