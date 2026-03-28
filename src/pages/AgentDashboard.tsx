import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Starfield } from "@/components/Starfield";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Copy, LogOut, Plus } from "lucide-react";
import BubbleCounter from "@/components/common/BubbleCounter";

interface Agent {
  id: string;
  agent_code: string;
  full_name: string;
  email: string;
  bank_account: string;
  total_earned: number;
  total_paid: number;
  total_pending: number;
  referral_code: string;
}

interface AgentHotel {
  id: string;
  hotel_name: string;
  hotel_email: string;
  country: string;
  contacted_date: string;
  status: string;
}

const AgentDashboard = () => {
  const { t } = useTranslation('agents');
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const [agent, setAgent] = useState<Agent | null>(null);
  const [hotels, setHotels] = useState<AgentHotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddHotel, setShowAddHotel] = useState(false);
  const [newHotel, setNewHotel] = useState({
    hotel_name: '',
    hotel_email: '',
    country: '',
    contacted_date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchAgentData();
  }, [user, navigate]);

  const fetchAgentData = async () => {
    try {
      // Fetch agent data
      const { data: agentData, error: agentError } = await supabase
        .from('agents')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (agentError) {
        console.error('Error fetching agent:', agentError);
        window.location.href = 'https://hotel-living.com/registerPromotor';
        return;
      }

      setAgent(agentData);

      // Fetch hotels
      const { data: hotelsData, error: hotelsError } = await supabase
        .from('agent_hotels')
        .select('*')
        .eq('agent_id', agentData.id)
        .order('contacted_date', { ascending: false });

      if (hotelsError) {
        console.error('Error fetching hotels:', hotelsError);
      } else {
        setHotels(hotelsData || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyAgentCode = async () => {
    if (agent?.agent_code) {
      await navigator.clipboard.writeText(agent.agent_code);
      toast({
        title: "¡Copiado!",
        description: t('dashboard.code_copied'),
      });
    }
  };

  const handleAddHotel = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agent) return;

    try {
      const { error } = await supabase
        .from('agent_hotels')
        .insert({
          agent_id: agent.id,
          hotel_name: newHotel.hotel_name,
          hotel_email: newHotel.hotel_email,
          country: newHotel.country,
          contacted_date: newHotel.contacted_date
        });

      if (error) {
        console.error('Error adding hotel:', error);
        toast({
          title: "Error",
          description: "Error al agregar el hotel",
          variant: "destructive"
        });
        return;
      }


      toast({
        title: "¡Éxito!",
        description: "Hotel agregado correctamente",
      });

      setNewHotel({
        hotel_name: '',
        hotel_email: '',
        country: '',
        contacted_date: new Date().toISOString().split('T')[0]
      });
      setShowAddHotel(false);
      fetchAgentData();
    } catch (error) {
      console.error('Error adding hotel:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(); // AuthContext handles redirect to '/'
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Critical: Monitor auth state and redirect immediately on logout
  useEffect(() => {
    if (!user) {
      console.log("No user found, redirecting to home");
      window.location.href = '/';
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen relative">
        <Starfield />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-white text-xl">Cargando...</div>
        </div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen relative">
        <Starfield />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-white text-xl">Agente no encontrado</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <Starfield />
      <div className="relative z-10">
        <Navbar />
        <BubbleCounter />
        <main className="min-h-screen">
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            
            {/* Header */}
            <div className="bg-[#630297]/90 backdrop-blur-sm rounded-lg p-6 text-white shadow-[0_0_60px_rgba(0,200,255,0.8),0_0_120px_rgba(0,200,255,0.4),0_0_180px_rgba(0,200,255,0.2)] mb-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold glow">{t('dashboard.title')}</h1>
                  <p className="text-xl mt-2">{t('dashboard.welcome')}, {agent.full_name}</p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm opacity-80">{t('dashboard.agent_code')}</div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">{agent.agent_code}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyAgentCode}
                        className="text-white hover:bg-white/10"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="text-white hover:bg-white/10"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {t('dashboard.profile.logout')}
                  </Button>
                </div>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="bg-[#630297]/90 backdrop-blur-sm rounded-lg p-6 text-white shadow-[0_0_60px_rgba(0,200,255,0.8),0_0_120px_rgba(0,200,255,0.4),0_0_180px_rgba(0,200,255,0.2)]">
              <Tabs defaultValue="hotels" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-white/10">
                  <TabsTrigger value="hotels" className="text-white data-[state=active]:bg-white/20">
                    {t('dashboard.tabs.hotels')}
                  </TabsTrigger>
                  <TabsTrigger value="commissions" className="text-white data-[state=active]:bg-white/20">
                    {t('dashboard.tabs.commissions')}
                  </TabsTrigger>
                  <TabsTrigger value="profile" className="text-white data-[state=active]:bg-white/20">
                    {t('dashboard.tabs.profile')}
                  </TabsTrigger>
                </TabsList>

                {/* Hotels Tab */}
                <TabsContent value="hotels" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">{t('dashboard.tabs.hotels')}</h2>
                    <Button
                      onClick={() => setShowAddHotel(true)}
                      className="bg-[#70009E] hover:bg-[#70009E]/80"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {t('dashboard.hotels.add_hotel')}
                    </Button>
                  </div>

                  {showAddHotel && (
                    <Card className="bg-white/10 border-white/20">
                      <CardHeader>
                        <CardTitle className="text-white">{t('dashboard.hotels.add_hotel')}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleAddHotel} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-white">{t('dashboard.hotels.hotel_name')}</Label>
                              <Input
                                value={newHotel.hotel_name}
                                onChange={(e) => setNewHotel(prev => ({ ...prev, hotel_name: e.target.value }))}
                                className="bg-white/10 border-white/20 text-white"
                                required
                              />
                            </div>
                            <div>
                              <Label className="text-white">{t('dashboard.hotels.hotel_email')}</Label>
                              <Input
                                type="email"
                                value={newHotel.hotel_email}
                                onChange={(e) => setNewHotel(prev => ({ ...prev, hotel_email: e.target.value }))}
                                className="bg-white/10 border-white/20 text-white"
                                required
                              />
                            </div>
                            <div>
                              <Label className="text-white">{t('dashboard.hotels.country')}</Label>
                              <Input
                                value={newHotel.country}
                                onChange={(e) => setNewHotel(prev => ({ ...prev, country: e.target.value }))}
                                className="bg-white/10 border-white/20 text-white"
                                required
                              />
                            </div>
                            <div>
                              <Label className="text-white">{t('dashboard.hotels.contacted_date')}</Label>
                              <Input
                                type="date"
                                value={newHotel.contacted_date}
                                onChange={(e) => setNewHotel(prev => ({ ...prev, contacted_date: e.target.value }))}
                                className="bg-white/10 border-white/20 text-white"
                                required
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button type="submit" className="bg-[#70009E] hover:bg-[#70009E]/80">
                              {t('dashboard.hotels.add_button')}
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => setShowAddHotel(false)}
                              className="text-white hover:bg-white/10"
                            >
                              {t('dashboard.hotels.cancel')}
                            </Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  )}

                  {/* Hotels List */}
                  <div className="space-y-4">
                    {hotels.length === 0 ? (
                      <div className="text-center py-8 text-white/60">
                        {t('dashboard.hotels.no_hotels')}
                      </div>
                    ) : (
                      hotels.map((hotel) => (
                        <Card key={hotel.id} className="bg-white/10 border-white/20">
                          <CardContent className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-white">
                              <div>
                                <div className="font-semibold">{hotel.hotel_name}</div>
                                <div className="text-sm opacity-80">{hotel.hotel_email}</div>
                              </div>
                              <div>
                                <div className="text-sm opacity-80">País</div>
                                <div>{hotel.country}</div>
                              </div>
                              <div>
                                <div className="text-sm opacity-80">Contactado</div>
                                <div>{new Date(hotel.contacted_date).toLocaleDateString()}</div>
                              </div>
                              <div>
                                <div className="text-sm opacity-80">Estado</div>
                                <div className={`inline-block px-2 py-1 rounded text-xs ${
                                  hotel.status === 'registered' ? 'bg-green-500' :
                                  hotel.status === 'expired' ? 'bg-red-500' : 'bg-yellow-500'
                                }`}>
                                  {t(`dashboard.hotels.status.${hotel.status}`)}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </TabsContent>

                {/* Commissions Tab */}
                <TabsContent value="commissions" className="space-y-4">
                  <h2 className="text-2xl font-bold">{t('dashboard.tabs.commissions')}</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-white/10 border-white/20">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-400">
                          €{agent.total_earned.toFixed(2)}
                        </div>
                        <div className="text-white/80">{t('dashboard.commissions.total_earned')}</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-white/10 border-white/20">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-400">
                          €{agent.total_paid.toFixed(2)}
                        </div>
                        <div className="text-white/80">{t('dashboard.commissions.total_paid')}</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-white/10 border-white/20">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-yellow-400">
                          €{agent.total_pending.toFixed(2)}
                        </div>
                        <div className="text-white/80">{t('dashboard.commissions.total_pending')}</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="text-center py-8 text-white/60">
                    {t('dashboard.commissions.no_commissions')}
                  </div>
                  
                  <div className="text-sm text-white/80 text-center">
                    {t('dashboard.commissions.monthly_payments')}
                  </div>
                </TabsContent>

                {/* Profile Tab */}
                <TabsContent value="profile" className="space-y-4">
                  <h2 className="text-2xl font-bold">{t('dashboard.tabs.profile')}</h2>
                  
                  <Card className="bg-white/10 border-white/20">
                    <CardContent className="p-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-white">{t('dashboard.profile.full_name')}</Label>
                          <Input
                            value={agent.full_name}
                            className="bg-white/10 border-white/20 text-white"
                            readOnly
                          />
                        </div>
                        <div>
                          <Label className="text-white">{t('dashboard.profile.email')}</Label>
                          <Input
                            value={agent.email}
                            className="bg-white/10 border-white/20 text-white"
                            readOnly
                          />
                        </div>
                        <div>
                          <Label className="text-white">Código de Referido</Label>
                          <Input
                            value={agent.referral_code || ''}
                            className="bg-white/10 border-white/20 text-white"
                            readOnly
                            placeholder="Generado automáticamente"
                          />
                        </div>
                        <div>
                          <Label className="text-white">{t('dashboard.profile.bank_account')}</Label>
                          <Input
                            value={agent.bank_account || ''}
                            placeholder="Introduce tu cuenta bancaria (IBAN)"
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                            onChange={(e) => {
                              // Handle bank account update
                              const newBankAccount = e.target.value;
                              setAgent(prev => prev ? { ...prev, bank_account: newBankAccount } : null);
                            }}
                          />
                          <div className="text-sm text-white/60 mt-1">
                            {agent.bank_account ? 
                              "Puedes actualizar tu cuenta bancaria aquí" : 
                              "⚠️ Debes agregar tu cuenta bancaria para recibir pagos"
                            }
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={async () => {
                          try {
                            const { error } = await supabase
                              .from('agents')
                              .update({ bank_account: agent.bank_account })
                              .eq('id', agent.id);
                            
                            if (error) throw error;
                            
                            toast({
                              title: "¡Actualizado!",
                              description: t('dashboard.profile.success'),
                            });
                          } catch (error) {
                            toast({
                              title: "Error",
                              description: t('dashboard.profile.error'),
                              variant: "destructive"
                            });
                          }
                        }}
                        className="bg-[#70009E] hover:bg-[#70009E]/80"
                      >
                        {t('dashboard.profile.save_changes')}
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default AgentDashboard;