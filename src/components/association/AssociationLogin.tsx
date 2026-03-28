// @ts-nocheck
// TypeScript checking disabled for Supabase schema compatibility
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Starfield } from '@/components/Starfield';
import { Link } from 'react-router-dom';

interface AssociationLoginProps {
  onLoginSuccess: () => void;
}

export const AssociationLogin = ({ onLoginSuccess }: AssociationLoginProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Email o contraseña incorrectos');
        } else {
          toast.error('Error al iniciar sesión: ' + error.message);
        }
        return;
      }

      if (data.user) {
        // Verify user has an association record
        const { data: association, error: assocError } = await supabase
          .from('associations')
          .select('*')
          .eq('user_id', data.user.id)
          .single();

        if (assocError || !association) {
          await supabase.auth.signOut();
          toast.error('Esta cuenta no está asociada a ninguna asociación registrada');
          return;
        }

        toast.success('Sesión iniciada correctamente');
        onLoginSuccess();
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast.error('Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen relative flex flex-col">
      <Starfield />
      
      <div className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <div className="w-full max-w-md">
          <Card className="bg-[#7E00B3]/90 backdrop-blur-sm border-none shadow-[0_0_60px_rgba(0,200,255,0.8),0_0_120px_rgba(0,200,255,0.4),0_0_180px_rgba(0,200,255,0.2)]">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-white mb-2">
                Iniciar Sesión
              </CardTitle>
              <p className="text-slate-300 text-sm">
                Acceda a su panel de asociación
              </p>
            </CardHeader>
            
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="email@asociacion.com"
                    className="bg-white/10 border-white/20 text-white placeholder-white/60 focus:border-blue-400 focus:ring-blue-400/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">
                    Contraseña
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-white/60 focus:border-blue-400 focus:ring-blue-400/50"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                >
                  {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-slate-300 text-sm">
                  ¿No tiene una cuenta?{' '}
                  <Link 
                    to="/asociacion/registro" 
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    Registre su asociación
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};