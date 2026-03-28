
import React from "react";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { Navigate } from "react-router-dom";

// For now, redirect to main admin roles since the component doesn't exist yet
export default function FernandoUserRoles() {
  const isAdmin = useIsAdmin();
  
  if (!isAdmin) {
    return <Navigate to="/panel-admin/hotels" replace />;
  }
  
  return (
    <div className="space-y-6">
      <div className="rounded-xl p-6 bg-[#7a0486]">
        <h2 className="text-2xl font-bold text-white mb-4">User Roles Management</h2>
        <p className="text-white/80 mb-4">
          This feature will allow management of user roles and permissions.
        </p>
        <div className="bg-[#5A1876]/30 rounded-lg p-4">
          <p className="text-white/60 text-sm">
            User roles management functionality will be implemented here.
          </p>
        </div>
      </div>
    </div>
  );
}
