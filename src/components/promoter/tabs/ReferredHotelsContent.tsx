import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "@/hooks/useTranslation";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Building, MapPin, Calendar } from "lucide-react";

interface ReferredHotel {
  id: string;
  hotel_name: string;
  country: string;
  hotel_email: string;
  contacted_date: string;
  registered_date: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function ReferredHotelsContent() {
  const { user } = useAuth();
  const { language } = useTranslation();
  const [hotels, setHotels] = useState<ReferredHotel[]>([]);
  const [loading, setLoading] = useState(true);

  const translations = {
    title: {
      en: "Referred Hotels",
      es: "Hoteles Referidos",
      pt: "Hotéis Referidos",
      ro: "Hoteluri Recomandate"
    },
    hotelName: {
      en: "Hotel Name",
      es: "Nombre del Hotel",
      pt: "Nome do Hotel",
      ro: "Nume Hotel"
    },
    location: {
      en: "Location",
      es: "Ubicación",
      pt: "Localização",
      ro: "Locație"
    },
    contactedDate: {
      en: "Contacted Date",
      es: "Fecha de Contacto",
      pt: "Data de Contato",
      ro: "Data Contactare"
    },
    registrationDate: {
      en: "Registration Date",
      es: "Fecha de Registro",
      pt: "Data de Registro",
      ro: "Data Înregistrare"
    },
    status: {
      en: "Status",
      es: "Estado",
      pt: "Status",
      ro: "Status"
    },
    pending: {
      en: "Pending",
      es: "Pendiente",
      pt: "Pendente",
      ro: "În așteptare"
    },
    registered: {
      en: "Registered",
      es: "Registrado",
      pt: "Registrado",
      ro: "Înregistrat"
    },
    expired: {
      en: "Expired",
      es: "Expirado",
      pt: "Expirado",
      ro: "Expirat"
    },
    noHotels: {
      en: "No referred hotels found",
      es: "No se encontraron hoteles referidos",
      pt: "Nenhum hotel referido encontrado",
      ro: "Nu s-au găsit hoteluri recomandate"
    },
    totalHotels: {
      en: "Total Hotels",
      es: "Total de Hoteles",
      pt: "Total de Hotéis",
      ro: "Total Hoteluri"
    }
  };

  const t = (key: string) => translations[key]?.[language] || translations[key]?.en || key;

  useEffect(() => {
    fetchReferredHotels();
  }, [user]);

  const fetchReferredHotels = async () => {
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
        setHotels([]);
        setLoading(false);
        return;
      }

      // Then get referred hotels
      const { data, error } = await supabase
        .from('agent_hotels')
        .select('*')
        .eq('agent_id', agentData.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching referred hotels:', error);
        setHotels([]);
      } else {
        setHotels(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30',
      registered: 'bg-green-600/20 text-green-400 border-green-600/30',
      expired: 'bg-red-600/20 text-red-400 border-red-600/30'
    };

    const statusText = status === 'pending' ? t('pending') :
                     status === 'registered' ? t('registered') :
                     status === 'expired' ? t('expired') : status;

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[status] || 'bg-gray-600/20 text-gray-400 border-gray-600/30'}`}>
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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="bg-[#7E00B3]/60 backdrop-blur-sm rounded-2xl p-6 shadow-[0_0_30px_rgba(0,200,255,0.4)]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white glow">{t('title')}</h2>
        <div className="bg-white/10 px-4 py-2 rounded-lg">
          <span className="text-white/80 text-sm">{t('totalHotels')}: </span>
          <span className="text-white font-bold">{hotels.length}</span>
        </div>
      </div>

      {hotels.length === 0 ? (
        <div className="text-center py-12">
          <Building className="w-16 h-16 text-white/40 mx-auto mb-4" />
          <p className="text-white/60 text-lg">{t('noHotels')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {hotels.map((hotel) => (
            <div
              key={hotel.id}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-all duration-300"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div className="flex items-center gap-3">
                  <Building className="w-5 h-5 text-blue-400" />
                  <div>
                    <h3 className="text-white font-semibold">{hotel.hotel_name}</h3>
                    <p className="text-white/60 text-sm">{hotel.hotel_email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-green-400" />
                  <span className="text-white/80">{hotel.country}</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-orange-400" />
                    <span className="text-white/60 text-sm">{t('contactedDate')}</span>
                  </div>
                  <p className="text-white text-sm">{formatDate(hotel.contacted_date)}</p>
                  {hotel.registered_date && (
                    <>
                      <div className="flex items-center gap-2 mt-2">
                        <Calendar className="w-4 h-4 text-purple-400" />
                        <span className="text-white/60 text-sm">{t('registrationDate')}</span>
                      </div>
                      <p className="text-white text-sm">{formatDate(hotel.registered_date)}</p>
                    </>
                  )}
                </div>

                <div className="flex justify-end">
                  {getStatusBadge(hotel.status)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}