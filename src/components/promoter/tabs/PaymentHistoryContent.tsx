import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "@/hooks/useTranslation";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CreditCard, Calendar, Check, Clock, X } from "lucide-react";

interface Payment {
  id: string;
  commission_amount: number;
  payment_date: string;
  payment_status: string;
  period_start: string;
  period_end: string;
  hotel_id?: string;
  created_at: string;
}

export default function PaymentHistoryContent() {
  const { user } = useAuth();
  const { language } = useTranslation();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalPending, setTotalPending] = useState(0);

  const translations = {
    title: {
      en: "Payment History",
      es: "Historial de Pagos",
      pt: "Histórico de Pagamentos",
      ro: "Istoric Plăți"
    },
    amount: {
      en: "Amount",
      es: "Cantidad",
      pt: "Valor",
      ro: "Sumă"
    },
    paymentDate: {
      en: "Payment Date",
      es: "Fecha de Pago",
      pt: "Data de Pagamento",
      ro: "Data Plății"
    },
    period: {
      en: "Period",
      es: "Período",
      pt: "Período",
      ro: "Perioadă"
    },
    status: {
      en: "Status",
      es: "Estado",
      pt: "Status",
      ro: "Status"
    },
    paid: {
      en: "Paid",
      es: "Pagado",
      pt: "Pago",
      ro: "Plătit"
    },
    pending: {
      en: "Pending",
      es: "Pendiente",
      pt: "Pendente",
      ro: "În așteptare"
    },
    failed: {
      en: "Failed",
      es: "Fallido",
      pt: "Falhado",
      ro: "Eșuat"
    },
    totalPaid: {
      en: "Total Paid",
      es: "Total Pagado",
      pt: "Total Pago",
      ro: "Total Plătit"
    },
    totalPending: {
      en: "Total Pending",
      es: "Total Pendiente",
      pt: "Total Pendente",
      ro: "Total În așteptare"
    },
    noPayments: {
      en: "No payment history found",
      es: "No se encontró historial de pagos",
      pt: "Nenhum histórico de pagamento encontrado",
      ro: "Nu s-a găsit istoric de plăți"
    },
    to: {
      en: "to",
      es: "a",
      pt: "até",
      ro: "până"
    }
  };

  const t = (key: string) => translations[key]?.[language] || translations[key]?.en || key;

  useEffect(() => {
    fetchPaymentHistory();
  }, [user]);

  const fetchPaymentHistory = async () => {
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
        setPayments([]);
        setTotalPaid(0);
        setTotalPending(0);
        setLoading(false);
        return;
      }

      // Commission payment system has been consolidated
      setPayments([]);
      setTotalPaid(0);
      setTotalPending(0);
      
    } catch (error) {
      console.error('Error:', error);
      setPayments([]);
      setTotalPaid(0);
      setTotalPending(0);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <Check className="w-4 h-4 text-green-400" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-orange-400" />;
      case 'failed':
        return <X className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      paid: 'bg-green-600/20 text-green-400 border-green-600/30',
      pending: 'bg-orange-600/20 text-orange-400 border-orange-600/30',
      failed: 'bg-red-600/20 text-red-400 border-red-600/30'
    };

    const statusText = status === 'paid' ? t('paid') :
                     status === 'pending' ? t('pending') :
                     status === 'failed' ? t('failed') : status;

    return (
      <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${statusColors[status] || 'bg-gray-600/20 text-gray-400 border-gray-600/30'}`}>
        {getStatusIcon(status)}
        {statusText}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'en' ? 'en-US' : 
                                 language === 'es' ? 'es-ES' :
                                 language === 'pt' ? 'pt-BR' : 'ro-RO');
  };

  const formatPeriod = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return '-';
    return `${formatDate(startDate)} ${t('to')} ${formatDate(endDate)}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#7E00B3]/60 backdrop-blur-sm rounded-2xl p-6 shadow-[0_0_30px_rgba(0,200,255,0.4)]">
          <div className="flex items-center gap-3 mb-2">
            <Check className="w-8 h-8 text-green-400" />
            <h3 className="text-xl font-bold text-white">{t('totalPaid')}</h3>
          </div>
          <p className="text-3xl font-bold text-green-400">${totalPaid.toFixed(2)}</p>
        </div>

        <div className="bg-[#7E00B3]/60 backdrop-blur-sm rounded-2xl p-6 shadow-[0_0_30px_rgba(0,200,255,0.4)]">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-8 h-8 text-orange-400" />
            <h3 className="text-xl font-bold text-white">{t('totalPending')}</h3>
          </div>
          <p className="text-3xl font-bold text-orange-400">${totalPending.toFixed(2)}</p>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-[#7E00B3]/60 backdrop-blur-sm rounded-2xl p-6 shadow-[0_0_30px_rgba(0,200,255,0.4)]">
        <h2 className="text-2xl font-bold text-white glow mb-6">{t('title')}</h2>

        {payments.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="w-16 h-16 text-white/40 mx-auto mb-4" />
            <p className="text-white/60 text-lg">Payment system has been consolidated</p>
            <p className="text-white/40 text-sm">Please contact support for payment history</p>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-all duration-300"
              >
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-white font-bold text-lg">
                        ${payment.commission_amount?.toFixed(2) || '0.00'}
                      </p>
                      <p className="text-white/60 text-sm">{t('amount')}</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-purple-400" />
                      <span className="text-white/60 text-sm">{t('paymentDate')}</span>
                    </div>
                    <p className="text-white">
                      {payment.payment_date ? formatDate(payment.payment_date) : '-'}
                    </p>
                  </div>

                  <div>
                    <p className="text-white/60 text-sm mb-1">{t('period')}</p>
                    <p className="text-white text-sm">
                      {formatPeriod(payment.period_start, payment.period_end)}
                    </p>
                  </div>

                  <div className="flex justify-end">
                    {getStatusBadge(payment.payment_status)}
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