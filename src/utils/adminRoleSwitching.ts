import { supabase } from "@/integrations/supabase/client";

const ADMIN_TEST_EMAIL = "grand_soiree@yahoo.com";

/**
 * Checks if the email is the admin test email for role switching
 */
export const isAdminTestEmail = (email: string): boolean => {
  return email.toLowerCase() === ADMIN_TEST_EMAIL.toLowerCase();
};

/**
 * Updates the user's role and profile for the admin test email during login
 */
export const updateAdminTestRole = async (userId: string, selectedRole: string): Promise<boolean> => {
  try {
    // Get current user email to verify it's the admin test email
    const { data: authUser, error: authError } = await supabase.auth.getUser();
    if (authError || !authUser.user || !isAdminTestEmail(authUser.user.email || '')) {
      console.log('Not admin test email, skipping role update');
      return false;
    }

    // Update profile role and hotel owner flag
    const profileRole = selectedRole === 'hotel' ? 'hotel_owner' : selectedRole;
    const isHotelOwner = selectedRole === 'hotel';

    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        role: profileRole,
        is_hotel_owner: isHotelOwner,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (profileError) {
      console.error('Error updating profile:', profileError);
      return false;
    }

    // Remove all existing roles for this user
    const { error: deleteError } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId);

    if (deleteError) {
      console.error('Error deleting existing roles:', deleteError);
      // Continue anyway, as this might just mean no roles existed
    }

    // Add the new role
    const roleToInsert = selectedRole === 'user' ? 'user' : selectedRole;
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role: roleToInsert,
        email: authUser.user.email
      });

    if (roleError) {
      console.error('Error inserting new role:', roleError);
      return false;
    }

    console.log(`Successfully updated admin test role to: ${selectedRole}`);
    return true;
  } catch (error) {
    console.error('Error in updateAdminTestRole:', error);
    return false;
  }
};

/**
 * Role mapping for display purposes
 */
export const ROLE_DISPLAY_MAP = {
  'user': 'User',
  'hotel': 'Hotel Partner', 
  'association': 'Association',
  'promoter': 'Promoter',
  'admin': 'Admin'
} as const;

export type SwitchableRole = keyof typeof ROLE_DISPLAY_MAP;