
// @ts-nocheck
// TypeScript checking disabled for Supabase schema compatibility

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { handleApiError } from "@/utils/errorHandling";

export const useUserEdit = (id: string | undefined, profile: any, setEditing: (editing: boolean) => void, toast: any) => {
  const [editForm, setEditForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    is_hotel_owner: false,
    is_active: true
  });

  // Update edit form when profile changes
  useEffect(() => {
    if (profile) {
      setEditForm({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        phone: profile.phone || "",
        email: profile.email || "",
        is_hotel_owner: profile.is_hotel_owner || false,
        is_active: profile.is_active !== false // Default to true if field doesn't exist
      });
    }
  }, [profile]);

  const handleSaveUserDetails = async () => {
    try {
      // Check if email is changed
      const emailChanged = profile?.email !== editForm.email;
      
      // Update profile data
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: editForm.first_name,
          last_name: editForm.last_name,
          phone: editForm.phone,
          is_hotel_owner: editForm.is_hotel_owner,
          is_active: editForm.is_active
        })
        .eq("id", id);

      if (error) throw error;
      
      // If email changed, update it separately using auth admin API
      if (emailChanged && id) {
        try {
          // Note: This requires admin privileges and might not work with the current auth setup
          // A proper implementation would use an Edge Function with service_role key
          const { data, error: emailError } = await supabase.functions.invoke("update-user-email", {
            body: { userId: id, email: editForm.email }
          });
          
          if (emailError) {
            toast({
              title: "Warning",
              description: "Profile updated but email couldn't be changed. Admin privileges required.",
              variant: "destructive"
            });
          }
        } catch (emailUpdateError) {
          console.error("Failed to update email:", emailUpdateError);
          toast({
            title: "Warning",
            description: "Profile updated but email couldn't be changed. Admin privileges required.",
            variant: "destructive"
          });
        }
      }
      
      setEditing(false);
      toast({
        title: "Success",
        description: "User information updated successfully",
      });
      
      return true;
    } catch (error) {
      const errorMessage = handleApiError(error, "Failed to update user information");
      
      toast({
        title: "Error updating user",
        description: errorMessage,
        variant: "destructive"
      });
      
      throw error;
    }
  };

  return { editForm, setEditForm, handleSaveUserDetails };
};
