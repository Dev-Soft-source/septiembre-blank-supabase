import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Starfield } from '@/components/Starfield';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col relative">
      <Starfield />
      <Navbar />
      
      <main className="flex-1 pt-20 pb-8 px-4">
        <div className="container mx-auto flex justify-center items-center min-h-[calc(100vh-140px)]">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-[#7E26A6] mb-2">{title}</h1>
                {subtitle && (
                  <p className="text-gray-700">{subtitle}</p>
                )}
              </div>
              {children}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}