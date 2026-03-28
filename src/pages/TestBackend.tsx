/**
 * Test Backend Page
 * Development page to test backend connection
 */

import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackendTestPanel } from "@/components/debug/BackendTestPanel";

export default function TestBackend() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-blue-50">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Backend Connection Test
          </h1>
          <p className="text-gray-600">
            Test the frontend-backend adapter connection in read-only mode
          </p>
        </div>
        
        <BackendTestPanel />
      </main>
      <Footer />
    </div>
  );
}