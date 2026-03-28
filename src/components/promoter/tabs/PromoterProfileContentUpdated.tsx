import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "@/hooks/useTranslation";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Edit3 } from "lucide-react";

interface PromoterProfile {
  id: string;
  full_name: string;
  email: string;
  bank_account: string;
  agent_code: string;
  referral_code: string;
  is_active: boolean;
}

export default function PromoterProfileContentUpdated() {
  const { user } = useAuth();
  const { t: baseT } = useTranslation('dashboard/profile');
  const { language } = useTranslation();
  const { toast } = useToast();
  const [profile, setProfile] = useState<PromoterProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const translations = {
    title: {
      en: "My Profile",
      es: "Mis Datos",
      pt: "Meus Dados",
      ro: "Datele Mele"
    },
    bankAccount: {
      en: "Bank Account",
      es: "Cuenta Bancaria",
      pt: "Conta Bancária",
      ro: "Cont Bancar"
    },
    agentCode: {
      en: "Agent Code",
      es: "Código de Agente",
      pt: "Código do Agente",
      ro: "Cod Agent"
    },
    status: {
      en: "Status",
      es: "Estado",
      pt: "Status",
      ro: "Status"
    },
    active: {
      en: "Active",
      es: "Activo",
      pt: "Ativo",
      ro: "Activ"
    },
    inactive: {
      en: "Inactive",
      es: "Inactivo",
      pt: "Inativo",
      ro: "Inactiv"
    }
  };

  const t = (key: string) => {
    // First try to get from profile translations
    if (baseT && typeof baseT === 'function') {
      const result = baseT(key);
      if (result !== key) return result;
    }
    // Fall back to local translations
    return translations[key]?.[language] || translations[key]?.en || key;
  };

  useEffect(() => {
    fetchPromoterProfile();
  }, [user]);

  const fetchPromoterProfile = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    
    try {
      // Query promoters joined with profiles to get all user data
      const { data, error } = await supabase
        .from('promoters')
        .select(`
          *,
          profiles!inner(
            user_id,
            email,
            name,
            first_name,
            last_name,
            code,
            phone
          )
        `)
        .eq('profiles.user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching promoter profile:', error);
      }

      if (data && data.profiles) {
        // Map the joined data to our expected profile format
        const mappedProfile = {
          id: data.id,
          full_name: data.profiles.name || `${data.profiles.first_name || ''} ${data.profiles.last_name || ''}`.trim(),
          email: data.profiles.email,
          bank_account: data.bank_info?.bank_account || '',
          agent_code: data.profiles.code,
          referral_code: data.profiles.code,
          is_active: data.status === 'active'
        };
        
        setProfile(mappedProfile);
        setFirstName(data.profiles.first_name || '');
        setLastName(data.profiles.last_name || '');
        setPhone(data.profiles.phone || '');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile || !user?.id) return;
    
    setSaving(true);
    try {
      const fullName = `${firstName} ${lastName}`.trim();
      
      // Update profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: fullName,
          first_name: firstName,
          last_name: lastName,
          phone: phone
        })
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      // Update promoters table with bank info
      const { error: promoterError } = await supabase
        .from('promoters')
        .update({
          bank_info: { bank_account: profile.bank_account }
        })
        .eq('profile_id', (await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', user.id)
          .single()
        ).data?.id);

      if (promoterError) throw promoterError;

      setProfile(prev => prev ? { ...prev, full_name: fullName } : null);

      toast({
        title: t('profileUpdated'),
        variant: "default"
      });
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: t('error'),
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-[#7E00B3]/60 backdrop-blur-sm rounded-2xl p-6 shadow-[0_0_30px_rgba(0,200,255,0.4)]">
        <p className="text-white/80 text-center">
          {language === 'pt' ? 'Perfil do promotor não encontrado' :
           language === 'ro' ? 'Profilul promotorului nu a fost găsit' :
           language === 'es' ? 'Perfil de promotor no encontrado' :
           'Promoter profile not found'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#7E00B3]/60 backdrop-blur-sm rounded-2xl p-6 shadow-[0_0_30px_rgba(0,200,255,0.4)]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white glow">{t('title')}</h2>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-300 hover:scale-105"
          >
            <Edit3 className="w-4 h-4" />
            {t('editProfile')}
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 text-white rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {t('saveChanges')}
            </button>
            <button
              onClick={() => {
                setEditing(false);
                fetchPromoterProfile();
              }}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300"
            >
              {t('cancel')}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-white/80 mb-2">{t('firstName')}</label>
          {editing ? (
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40"
            />
          ) : (
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white">
              {firstName || '-'}
            </div>
          )}
        </div>

        <div>
          <label className="block text-white/80 mb-2">{t('lastName')}</label>
          {editing ? (
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40"
            />
          ) : (
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white">
              {lastName || '-'}
            </div>
          )}
        </div>

        <div>
          <label className="block text-white/80 mb-2">{t('email')} {t('readOnly')}</label>
          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/60">
            {profile.email}
          </div>
        </div>

        <div>
          <label className="block text-white/80 mb-2">{t('phone')} {t('optional')}</label>
          {editing ? (
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40"
            />
          ) : (
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white">
              {phone || '-'}
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-white/80 mb-2">{t('address')} {t('optional')}</label>
          {editing ? (
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40"
            />
          ) : (
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white">
              {address || '-'}
            </div>
          )}
        </div>

        <div>
          <label className="block text-white/80 mb-2">{t('bankAccount')} {t('optional')}</label>
          {editing ? (
            <input
              type="text"
              value={profile.bank_account || ''}
              onChange={(e) => setProfile({ ...profile, bank_account: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40"
              placeholder="IBAN or Account Number"
            />
          ) : (
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white">
              {profile.bank_account || '-'}
            </div>
          )}
        </div>

        <div>
          <label className="block text-white/80 mb-2">{t('status')}</label>
          <div className={`px-4 py-2 bg-white/5 border border-white/10 rounded-lg ${profile.is_active ? 'text-green-400' : 'text-red-400'}`}>
            {profile.is_active ? t('active') : t('inactive')}
          </div>
        </div>

        <div>
          <label className="block text-white/80 mb-2">{t('agentCode')}</label>
          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/60">
            {profile.agent_code}
          </div>
        </div>

      </div>
    </div>
  );
}