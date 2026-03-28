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

export default function PromoterProfileContent() {
  const { user } = useAuth();
  const { language } = useTranslation();
  const { toast } = useToast();
  const [profile, setProfile] = useState<PromoterProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const translations = {
    title: {
      en: "Promoter Profile",
      es: "Perfil del Promotor",
      pt: "Perfil do Promotor",
      ro: "Profil Promotor"
    },
    fullName: {
      en: "Full Name",
      es: "Nombre Completo",
      pt: "Nome Completo",
      ro: "Nume Complet"
    },
    email: {
      en: "Email",
      es: "Correo Electrónico",
      pt: "E-mail",
      ro: "Email"
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
    referralCode: {
      en: "Referral Code",
      es: "Código de Referencia",
      pt: "Código de Referência",
      ro: "Cod de Recomandare"
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
    },
    edit: {
      en: "Edit",
      es: "Editar",
      pt: "Editar",
      ro: "Editează"
    },
    save: {
      en: "Save",
      es: "Guardar",
      pt: "Salvar",
      ro: "Salvează"
    },
    cancel: {
      en: "Cancel",
      es: "Cancelar",
      pt: "Cancelar",
      ro: "Anulează"
    },
    saved: {
      en: "Profile updated successfully",
      es: "Perfil actualizado exitosamente",
      pt: "Perfil atualizado com sucesso",
      ro: "Profilul a fost actualizat cu succes"
    },
    error: {
      en: "Error updating profile",
      es: "Error al actualizar el perfil",
      pt: "Erro ao atualizar o perfil",
      ro: "Eroare la actualizarea profilului"
    }
  };

  const t = (key: string) => translations[key]?.[language] || translations[key]?.en || key;

  useEffect(() => {
    fetchPromoterProfile();
  }, [user]);

  const fetchPromoterProfile = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching promoter profile:', error);
      }

      setProfile(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('agents')
        .update({
          full_name: profile.full_name,
          bank_account: profile.bank_account
        })
        .eq('id', profile.id);

      if (error) throw error;

      toast({
        title: t('saved'),
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
            {t('edit')}
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 text-white rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {t('save')}
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
          <label className="block text-white/80 mb-2">{t('fullName')}</label>
          {editing ? (
            <input
              type="text"
              value={profile.full_name || ''}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40"
            />
          ) : (
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white">
              {profile.full_name || '-'}
            </div>
          )}
        </div>

        <div>
          <label className="block text-white/80 mb-2">{t('email')}</label>
          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/60">
            {profile.email}
          </div>
        </div>

        <div>
          <label className="block text-white/80 mb-2">{t('bankAccount')}</label>
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

        <div>
          <label className="block text-white/80 mb-2">{t('referralCode')}</label>
          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/60">
            {profile.referral_code}
          </div>
        </div>
      </div>
    </div>
  );
}