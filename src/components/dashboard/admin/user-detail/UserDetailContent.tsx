
import React from "react";
import { DetailCard } from "./DetailCard";
import { ProfileSection } from "./ProfileSection";
import { BookingsSection } from "./BookingsSection";
import { FavoritesSection } from "./FavoritesSection";
import { ThemesSection } from "./ThemesSection";
import { UserStatsSection } from "./UserStatsSection";
import { UserAffinitiesSection } from "./UserAffinitiesSection";
import { UserHotelsSection } from "./UserHotelsSection";
import { UserReportsSection } from "./UserReportsSection";
import { UserReferralsSection } from "./UserReferralsSection";
import { TotalSpentCard } from "./TotalSpentCard";
import { FreeNightsCard } from "./FreeNightsCard";
import { RegistrationInfo } from "./RegistrationInfo";


interface UserDetailContentProps {
  profile: any;
  authData: any;
  bookings: any[];
  favorites: any[];
  themes: any[];
  userPreferences: any;
  hotels: any[];
  reports: any[];
  referrals: any[];
  editing: boolean;
  editForm: any;
  setEditForm: (form: any) => void;
  themesPagination: any;
  
  formattedTotal: string;
  freeNightsCount: number;
  
}

export const UserDetailContent: React.FC<UserDetailContentProps> = ({
  profile,
  authData,
  bookings,
  favorites,
  themes,
  userPreferences,
  hotels,
  reports,
  referrals,
  editing,
  editForm,
  setEditForm,
  themesPagination,
  
  formattedTotal,
  freeNightsCount
}) => {
  return (
    <div className="space-y-6">
      {/* User Registration Info */}
      <RegistrationInfo 
        createdAt={profile.created_at}
        isActive={profile.is_active}
        lastSignInAt={authData?.last_sign_in_at}
      />
      
      
      {/* User Stats */}
      <UserStatsSection bookings={bookings} favorites={favorites} />
      
      {/* Total Amount Spent */}
      <TotalSpentCard formattedTotal={formattedTotal} />
      
      {/* Free Nights Redeemed */}
      <FreeNightsCard freeNightsCount={freeNightsCount} />
      
      {/* User Reports Section */}
      {reports && reports.length > 0 && (
        <DetailCard title="User Reports">
          <div className="space-y-2">
            <div className="text-sm text-destructive font-semibold mb-2">
              This user has {reports.length} report(s) filed against them:
            </div>
            <UserReportsSection reports={reports} />
          </div>
        </DetailCard>
      )}
      
      {/* Hotel Referrals Section */}
      {referrals && referrals.length > 0 && (
        <DetailCard title="Hotel Referrals">
          <div className="space-y-2">
            <div className="text-sm font-medium mb-2">
              This user has referred {referrals.length} hotel(s) to the platform:
            </div>
            <UserReferralsSection referrals={referrals} />
          </div>
        </DetailCard>
      )}
      
      {/* User Profile */}
      <DetailCard title="Basic Information">
        <ProfileSection 
          profile={profile} 
          editing={editing} 
          editForm={editForm} 
          setEditForm={setEditForm} 
        />
      </DetailCard>

      {/* User's Hotels - Only shown for hotel owners */}
      {profile.is_hotel_owner && (
        <DetailCard title="Hotels Registered">
          <UserHotelsSection hotels={hotels} />
        </DetailCard>
      )}

      {/* User Affinities/Themes */}
      <DetailCard title="User Affinities">
        <UserAffinitiesSection themes={themes} userPreferences={userPreferences} />
      </DetailCard>

      {/* Bookings */}
      <DetailCard title="Bookings History">
        <BookingsSection bookings={bookings} />
      </DetailCard>

      {/* Favorite Hotels */}
      <DetailCard title="Favorite Hotels">
        <FavoritesSection favorites={favorites} />
      </DetailCard>

      {/* Preferred Themes - Updated with pagination */}
      <DetailCard title="Preferred Affinities/Themes">
        <ThemesSection 
          themes={themes} 
          pagination={themesPagination}
        />
      </DetailCard>
    </div>
  );
};
