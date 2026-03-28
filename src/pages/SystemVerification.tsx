import React from 'react';
import { SystemVerification } from '@/components/testing/SystemVerification';
import { Navbar } from '@/components/Navbar';
import { HotelStarfield } from '@/components/hotels/HotelStarfield';
import { SEOMetadata } from '@/components/SEOMetadata';

export default function SystemVerificationPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEOMetadata 
        title="System Verification | Hotel-Living"
        description="Comprehensive system verification dashboard for Hotel-Living platform"
        url={typeof window !== 'undefined' ? window.location.href : ""}
      />
      
      <HotelStarfield />
      <Navbar />
      
      <main className="flex-1 pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              System Verification Dashboard
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive testing suite to verify all workflows after database cleanup. 
              Tests hotel registration, booking system, commission tracking, user management, and admin functions.
            </p>
          </div>
          
          <SystemVerification />
        </div>
      </main>
    </div>
  );
}