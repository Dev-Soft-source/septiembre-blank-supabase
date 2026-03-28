
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Hotel, MapPin, Mail, Phone } from 'lucide-react';
import { useAssociationHotels } from '@/hooks/useAssociationData';
import { useTranslation } from '@/hooks/useTranslation';

export const RegisteredHotelsTab = () => {
  const { t } = useTranslation('associationDashboard');
  const { data: realHotels = [], isLoading } = useAssociationHotels();

  // Show mock data only if no real hotels exist
  const mockData = [
    {
      id: 'mock-1',
      name: 'Hotel Example',
      city: 'Madrid',
      contact_email: 'contact@hotel.com',
      contact_phone: '+34 123 456 789',
      status: 'approved' as const,
      created_at: '2024-01-15'
    }
  ];

  const registeredHotels = realHotels.length > 0 ? realHotels : mockData;

  return (
    <div className="space-y-6">
      <Card className="glass-card border-blue-500/20 bg-slate-700/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Hotel className="w-5 h-5 text-blue-400" />
            {t('tabs.registeredHotels')}
            {realHotels.length === 0 && <Badge variant="secondary" className="ml-2 text-xs">Mock Data</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <Hotel className="w-12 h-12 text-slate-400 mx-auto mb-4 animate-spin" />
              <p className="text-slate-400">Loading hotels...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {registeredHotels.map((hotel) => (
                <Card key={hotel.id} className="bg-slate-800/50 border-slate-600/50">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-white font-semibold text-lg">{hotel.name}</h3>
                      <Badge 
                        variant={hotel.status === 'approved' ? 'default' : 'secondary'}
                        className="bg-green-600/20 text-green-400 border-green-600/30"
                      >
                        Activo
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-slate-300">
                        <MapPin className="w-4 h-4 text-blue-400" />
                        {hotel.city}
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <Mail className="w-4 h-4 text-blue-400" />
                        {hotel.contact_email}
                      </div>
                      {hotel.contact_phone && (
                        <div className="flex items-center gap-2 text-slate-300">
                          <Phone className="w-4 h-4 text-blue-400" />
                          {hotel.contact_phone}
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-slate-600/50">
                      <p className="text-xs text-slate-400">
                        Registrado el {new Date(hotel.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
