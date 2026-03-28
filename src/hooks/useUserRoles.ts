
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export async function addUserRole(userId: string, role: string) {
  try {
    const { data, error } = await supabase
      .from("user_roles")
      .insert({ user_id: userId, role });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error adding user role:", error);
    return { data: null, error };
  }
}

export async function removeUserRole(userId: string, role: string) {
  try {
    const { data, error } = await supabase
      .from("user_roles")
      .delete()
      .match({ user_id: userId, role });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error removing user role:", error);
    return { data: null, error };
  }
}

export async function getUserRoles(userId: string) {
  try {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    
    if (error) throw error;
    return { roles: data?.map(r => r.role) || [], error: null };
  } catch (error) {
    console.error("Error fetching user roles:", error);
    return { roles: [], error };
  }
}

export async function assignUserRole(userId: string, email: string, role: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ role: role as any })
      .eq('user_id', userId)
      .eq('email', email);
    
    if (error) throw error;
    return { success: data, error: null };
  } catch (error) {
    console.error("Error assigning role to user:", error);
    return { success: false, error };
  }
}

export async function checkEmailHasRole(email: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('email', email)
      .single();
    
    if (error) throw error;
    return { role: data, error: null };
  } catch (error) {
    console.error("Error checking email role:", error);
    return { role: null, error };
  }
}
