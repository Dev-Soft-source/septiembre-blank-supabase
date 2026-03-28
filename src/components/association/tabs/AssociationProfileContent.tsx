// @ts-nocheck
// TypeScript checking disabled for Supabase schema compatibility
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, MapPin, Building } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ReferralCodeDisplay } from '@/components/dashboard/shared/ReferralCodeDisplay';
import { useTranslation } from '@/hooks/useTranslation';

export const AssociationProfileContent = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation('dashboard/profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    associationName: '',
    representativeName: '',
    email: '',
    phone: '',
    address: '',
  });
  const [referralCode, setReferralCode] = useState<string>('');

  useEffect(() => {
    const fetchAssociationData = async () => {
      if (!user?.id) return;
      
      const { data, error } = await supabase
        .from('associations')
        .select('association_name, responsible_person, email, referral_code')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (data) {
        setFormData({
          associationName: data.association_name || '',
          representativeName: data.responsible_person || '',
          email: data.email || user?.email || '',
          phone: '',
          address: '',
        });
        setReferralCode(data.referral_code || '');
      } else if (user?.email) {
        setFormData(prev => ({ ...prev, email: user.email }));
      }
    };

    fetchAssociationData();
  }, [user?.id, user?.email]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user?.id) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('associations')
        .update({
          responsible_person: formData.representativeName,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: t('profileUpdated'),
        description: t('profileUpdated'),
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating association data:', error);
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
      <Card className="glass-card border-blue-500/20 bg-slate-700/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <User className="w-5 h-5 text-blue-400" />
            {t('title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="associationName" className="text-white flex items-center gap-2">
                  <Building className="w-4 h-4 text-blue-400" />
                  {t('associationName')} {t('readOnly')}
                </Label>
                <Input
                  id="associationName"
                  value={formData.associationName}
                  className="bg-slate-800/50 border-blue-500/20 text-white bg-muted"
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="representativeName" className="text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-400" />
                  {t('representativeName')}
                </Label>
                <Input
                  id="representativeName"
                  value={formData.representativeName}
                  onChange={(e) => handleInputChange('representativeName', e.target.value)}
                  className="bg-slate-800/50 border-blue-500/20 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-400" />
                  {t('email')} {t('readOnly')}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  className="bg-slate-800/50 border-blue-500/20 text-white bg-muted"
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-400" />
                  {t('phone')} {t('optional')}
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="bg-slate-800/50 border-blue-500/20 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  {t('address')} {t('optional')}
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="bg-slate-800/50 border-blue-500/20 text-white"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  {isSubmitting ? t('saving') : t('saveChanges')}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  disabled={isSubmitting}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  {t('cancel')}
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-white/80 text-sm flex items-center gap-2">
                    <Building className="w-4 h-4 text-blue-400" />
                    {t('associationName')} {t('readOnly')}
                  </p>
                  <p className="text-white font-medium">{formData.associationName || "-"}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-white/80 text-sm flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-400" />
                    {t('representativeName')}
                  </p>
                  <p className="text-white font-medium">{formData.representativeName || "-"}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-white/80 text-sm flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-400" />
                    {t('email')} {t('readOnly')}
                  </p>
                  <p className="text-white font-medium">{formData.email || "-"}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-white/80 text-sm flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-400" />
                    {t('phone')}
                  </p>
                  <p className="text-white font-medium">{formData.phone || "-"}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-white/80 text-sm flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    {t('address')}
                  </p>
                  <p className="text-white font-medium">{formData.address || "-"}</p>
                </div>

                {referralCode && (
                  <ReferralCodeDisplay 
                    code={referralCode} 
                    variant="card"
                    className="text-white"
                  />
                )}
              </div>

              <Button
                onClick={() => setIsEditing(true)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                {t('editProfile')}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};