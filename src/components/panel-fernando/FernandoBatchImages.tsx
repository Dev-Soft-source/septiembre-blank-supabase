
import React from "react";
import { BatchImagePopulation } from "@/components/dashboard/admin/BatchImagePopulation";

export default function FernandoBatchImages() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Hotel Image Management</h1>
          <p className="text-purple-200">
            Populate unique images for all hotels and manage duplicates
          </p>
        </div>
        
        <BatchImagePopulation />
      </div>
    </div>
  );
}
