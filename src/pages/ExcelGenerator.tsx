
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ExcelHotelGenerator } from '@/components/ExcelHotelGenerator';

export default function ExcelGenerator() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-8">
        <ExcelHotelGenerator />
      </main>
      <Footer />
    </div>
  );
}
