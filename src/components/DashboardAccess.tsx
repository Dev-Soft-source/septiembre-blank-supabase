
import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { getRedirectUrlForRole, isDeveloperAccount } from '@/utils/dashboardSecurity';

export function DashboardAccess() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Developer override: Allow unrestricted access in Lovable environment
    if (isDeveloperAccount(user?.email || '')) {
      return; // Skip restrictions for developer account
    }
  }, [user]);

  // Removed automatic homepage redirect to allow logo access to landing page
  // Users can still access dashboards through dedicated navigation links

  return null;
}
