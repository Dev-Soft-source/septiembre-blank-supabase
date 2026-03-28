import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Starfield } from '@/components/Starfield';
import { Link } from 'react-router-dom';
import { Hotel, Users, TrendingUp, Shield, Mail, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const AssociationLanding = () => {
  const { t } = useTranslation('association');

  return (
    <div className="min-h-screen relative">
      <Starfield />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">
            {t('landing.hero.title')}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> </span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            {t('landing.hero.subtitle')}
          </p>
          <Link to="/asociacion/registro">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 text-lg shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
            >
              {t('landing.hero.registerButton')}
            </Button>
          </Link>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="bg-[#7E00B3]/90 backdrop-blur-sm border-none shadow-[0_0_30px_rgba(0,200,255,0.4)]">
            <CardHeader className="text-center">
              <Hotel className="w-12 h-12 text-blue-400 mx-auto mb-2" />
              <CardTitle className="text-white text-lg">{t('landing.benefits.globalNetwork.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 text-center">
                {t('landing.benefits.globalNetwork.description')}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#7E00B3]/90 backdrop-blur-sm border-none shadow-[0_0_30px_rgba(0,200,255,0.4)]">
            <CardHeader className="text-center">
              <TrendingUp className="w-12 h-12 text-green-400 mx-auto mb-2" />
              <CardTitle className="text-white text-lg">{t('landing.benefits.commissions.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 text-center">
                {t('landing.benefits.commissions.description')}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#7E00B3]/90 backdrop-blur-sm border-none shadow-[0_0_30px_rgba(0,200,255,0.4)]">
            <CardHeader className="text-center">
              <Users className="w-12 h-12 text-purple-400 mx-auto mb-2" />
              <CardTitle className="text-white text-lg">{t('landing.benefits.digitalNomads.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 text-center">
                {t('landing.benefits.digitalNomads.description')}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#7E00B3]/90 backdrop-blur-sm border-none shadow-[0_0_30px_rgba(0,200,255,0.4)]">
            <CardHeader className="text-center">
              <Shield className="w-12 h-12 text-orange-400 mx-auto mb-2" />
              <CardTitle className="text-white text-lg">{t('landing.benefits.secureManagement.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 text-center">
                {t('landing.benefits.secureManagement.description')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">{t('landing.howItWorks.title')}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {(t('landing.howItWorks.steps', { returnObjects: true }) as Array<{title: string, description: string}>).map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">{index + 1}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-slate-300">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border-blue-500/30 shadow-[0_0_60px_rgba(0,200,255,0.3)]">
          <CardContent className="text-center p-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              {t('landing.cta.title')}
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              {t('landing.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/asociacion/registro">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4"
                >
                  {t('landing.cta.registerButton')}
                </Button>
              </Link>
              <Link to="/association-dashboard">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white px-8 py-4"
                >
                  {t('landing.cta.dashboardButton')}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-white mb-6">{t('landing.contact.title')}</h3>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <div className="flex items-center gap-2 text-slate-300">
              <Mail className="w-5 h-5 text-blue-400" />
              <span>{t('landing.contact.email')}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Phone className="w-5 h-5 text-blue-400" />
              <span>+1 (555) 123-4567</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};