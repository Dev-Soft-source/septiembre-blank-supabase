import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "@/hooks/useTranslation";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, DollarSign, Clock, TrendingUp, Building } from "lucide-react";

interface Commission {
  id: string;
  hotel_name: string;
  registration_date: string;
  commission_amount: number;
  commission_rate: number;
  months_elapsed: number;
  months_remaining: number;
  status: 'active' | 'expired';
  current_rate: number;
}

export default function CommissionsContent() {
  const { user } = useAuth();
  const { language } = useTranslation();
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalEarnings, setTotalEarnings] = useState(0);

  const translations = {
    title: {
      en: "Commissions",
      es: "Comisiones",
      pt: "Comissões",
      ro: "Comisioane"
    },
    hotelName: {
      en: "Hotel Name",
      es: "Nombre del Hotel",
      pt: "Nome do Hotel",
      ro: "Nume Hotel"
    },
    commissionRate: {
      en: "Commission Rate",
      es: "Tasa de Comisión",
      pt: "Taxa de Comissão",
      ro: "Rata Comision"
    },
    amountAccumulated: {
      en: "Amount Accumulated",
      es: "Cantidad Acumulada",
      pt: "Valor Acumulado",
      ro: "Sumă Acumulată"
    },
    monthsRemaining: {
      en: "Months Remaining",
      es: "Meses Restantes",
      pt: "Meses Restantes",
      ro: "Luni Rămase"
    },
    monthsLeft: {
      en: "months left",
      es: "meses restantes",
      pt: "meses restantes",
      ro: "luni rămase"
    },
    expired: {
      en: "Expired",
      es: "Expirado",
      pt: "Expirado",
      ro: "Expirat"
    },
    active: {
      en: "Active",
      es: "Activo",
      pt: "Ativo",
      ro: "Activ"
    },
    totalEarnings: {
      en: "Total Earnings",
      es: "Ganancias Totales",
      pt: "Ganhos Totais",
      ro: "Câștiguri Totale"
    },
    activeCommissions: {
      en: "Active Commissions",
      es: "Comisiones Activas",
      pt: "Comissões Ativas",
      ro: "Comisioane Active"
    },
    noCommissions: {
      en: "No commissions found",
      es: "No se encontraron comisiones",
      pt: "Nenhuma comissão encontrada",
      ro: "Nu s-au găsit comisioane"
    }
  };

  const t = (key: string) => translations[key]?.[language] || translations[key]?.en || key;

  useEffect(() => {
    fetchCommissions();
  }, [user]);

  const calculateCommissionData = (registrationDate: string) => {
    const regDate = new Date(registrationDate);
    const currentDate = new Date();
    const monthsElapsed = Math.floor((currentDate.getTime() - regDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
    const monthsRemaining = Math.max(0, 30 - monthsElapsed);
    
    let currentRate = 0;
    let status: 'active' | 'expired' = 'expired';
    
    if (monthsElapsed <= 18) {
      currentRate = 2.0;
      status = 'active';
    } else if (monthsElapsed <= 30) {
      currentRate = 1.0;
      status = 'active';
    }
    
    return {
      monthsElapsed,
      monthsRemaining,
      currentRate,
      status
    };
  };

  const fetchCommissions = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    
    try {
      // First get the agent ID
      const { data: agentData, error: agentError } = await supabase
        .from('agents')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (agentError) {
        console.error('Error fetching agent:', agentError);
        setLoading(false);
        return;
      }

      if (!agentData) {
        console.log('No agent found for user');
        setCommissions([]);
        setTotalEarnings(0);
        setLoading(false);
        return;
      }

      // Get registered hotels
      const { data: hotelsData, error: hotelsError } = await supabase
        .from('agent_hotels')
        .select('hotel_name, registered_date')
        .eq('agent_id', agentData.id)
        .eq('status', 'registered')
        .not('registered_date', 'is', null);

      if (hotelsError) {
        console.error('Error fetching hotels:', hotelsError);
        setCommissions([]);
        setTotalEarnings(0);
        setLoading(false);
        return;
      }

      // Commission system has been consolidated - show message instead
      setCommissions([]);
      setTotalEarnings(0);
      setLoading(false);
      
    } catch (error) {
      console.error('Error:', error);
      setCommissions([]);
      setTotalEarnings(0);
    } finally {
      setLoading(false);
    }
  };

  const getRateBadge = (rate: number, status: string) => {
    if (status === 'expired') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-600/20 text-red-400 border border-red-600/30">
          {t('expired')}
        </span>
      );
    }
    
    const color = rate === 2.0 ? 'green' : 'orange';
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${color}-600/20 text-${color}-400 border border-${color}-600/30`}>
        {(rate * 100).toFixed(1)}%
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  const activeCommissions = commissions.filter(c => c.status === 'active');

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#7E00B3]/60 backdrop-blur-sm rounded-2xl p-6 shadow-[0_0_30px_rgba(0,200,255,0.4)]">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-8 h-8 text-green-400" />
            <h3 className="text-xl font-bold text-white">{t('totalEarnings')}</h3>
          </div>
          <p className="text-3xl font-bold text-green-400">${totalEarnings.toFixed(2)}</p>
        </div>

        <div className="bg-[#7E00B3]/60 backdrop-blur-sm rounded-2xl p-6 shadow-[0_0_30px_rgba(0,200,255,0.4)]">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8 text-blue-400" />
            <h3 className="text-xl font-bold text-white">{t('activeCommissions')}</h3>
          </div>
          <p className="text-3xl font-bold text-blue-400">{activeCommissions.length}</p>
        </div>
      </div>

      {/* Commissions List */}
      <div className="bg-[#7E00B3]/60 backdrop-blur-sm rounded-2xl p-6 shadow-[0_0_30px_rgba(0,200,255,0.4)]">
        <h2 className="text-2xl font-bold text-white glow mb-6">{t('title')}</h2>

        {commissions.length === 0 ? (
          <div className="text-center py-12">
            <DollarSign className="w-16 h-16 text-white/40 mx-auto mb-4" />
            <p className="text-white/60 text-lg">Commission system has been consolidated</p>
            <p className="text-white/40 text-sm">Please contact support for commission information</p>
          </div>
        ) : (
          <div className="space-y-4">
            {commissions.map((commission) => (
              <div
                key={commission.id}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-all duration-300"
              >
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-center">
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-blue-400" />
                    <div>
                      <h3 className="text-white font-semibold">{commission.hotel_name}</h3>
                      <p className="text-white/60 text-sm">
                        {new Date(commission.registration_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-white/60 text-sm mb-1">{t('commissionRate')}</p>
                    {getRateBadge(commission.current_rate, commission.status)}
                  </div>

                  <div className="text-center">
                    <p className="text-white/60 text-sm mb-1">{t('amountAccumulated')}</p>
                    <p className="text-white font-bold">${commission.commission_amount.toFixed(2)}</p>
                  </div>

                  <div className="text-center">
                    <p className="text-white/60 text-sm mb-1">{t('monthsRemaining')}</p>
                    {commission.status === 'expired' ? (
                      <span className="text-red-400 font-medium">{t('expired')}</span>
                    ) : (
                      <div className="flex items-center justify-center gap-1">
                        <Clock className="w-4 h-4 text-orange-400" />
                        <span className="text-white font-medium">
                          {commission.months_remaining} {t('monthsLeft')}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      commission.status === 'active' 
                        ? 'bg-green-600/20 text-green-400 border border-green-600/30'
                        : 'bg-red-600/20 text-red-400 border border-red-600/30'
                    }`}>
                      {commission.status === 'active' ? t('active') : t('expired')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}