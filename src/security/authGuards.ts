import type { User, Profile } from '@/types/auth';

// Type guards for user roles
export const isAdminUser = (profile: Profile | null): profile is Profile & { role: 'admin' } => {
  return profile?.role === 'admin';
};

export const isHotelOwner = (profile: Profile | null): profile is Profile & { role: 'hotel_owner' } => {
  return profile?.role === 'hotel_owner' || profile?.is_hotel_owner === true;
};

export const isAssociationUser = (profile: Profile | null): profile is Profile & { role: 'association' } => {
  return profile?.role === 'association';
};

export const isRegularUser = (profile: Profile | null): profile is Profile & { role: 'user' } => {
  return profile?.role === 'user' || (!profile?.role && !!profile?.id);
};

// Authentication state guards
export const isAuthenticated = (user: User | null, profile: Profile | null): user is User => {
  return user !== null && profile !== null;
};

export const hasValidSession = (user: User | null, session: any): boolean => {
  return user !== null && session !== null && !session.expires_at || 
         new Date(session.expires_at) > new Date();
};

// Permission checking utilities
export const canAccessAdminPanel = (profile: Profile | null): boolean => {
  return isAdminUser(profile);
};

export const canManageHotel = (profile: Profile | null, hotelOwnerId?: string): boolean => {
  return isAdminUser(profile) || 
         (isHotelOwner(profile) && (!hotelOwnerId || profile.id === hotelOwnerId));
};

export const canAccessDashboard = (profile: Profile | null): boolean => {
  return profile !== null && ['admin', 'hotel_owner', 'association', 'user'].includes(profile.role || 'user');
};

// Role-based route protection
export type RequiredRole = 'admin' | 'hotel_owner' | 'association' | 'user' | 'any';

export const hasRequiredRole = (profile: Profile | null, requiredRole: RequiredRole): boolean => {
  if (requiredRole === 'any') return profile !== null;
  
  switch (requiredRole) {
    case 'admin':
      return isAdminUser(profile);
    case 'hotel_owner':
      return isHotelOwner(profile);
    case 'association':
      return isAssociationUser(profile);
    case 'user':
      return isRegularUser(profile);
    default:
      return false;
  }
};