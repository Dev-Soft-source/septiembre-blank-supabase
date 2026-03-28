import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/context/AuthContext";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export function useAvatarUpload() {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();
  const { user } = useAuth();

  const validateFile = (file: File): boolean => {
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: t('dashboard.avatar.fileTooLarge'),
        variant: "destructive"
      });
      return false;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast({
        title: t('dashboard.avatar.invalidFormat'),
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const uploadAvatar = async (file: File): Promise<boolean> => {
    if (!user || !validateFile(file)) return false;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      toast({
        title: t('dashboard.avatar.uploadSuccess')
      });

      return true;
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      toast({
        title: t('dashboard.avatar.uploadError'),
        description: error.message,
        variant: "destructive"
      });
      return false;
    } finally {
      setUploading(false);
    }
  };

  const removeAvatar = async (): Promise<boolean> => {
    if (!user) return false;

    setUploading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: t('dashboard.avatar.removeSuccess')
      });

      return true;
    } catch (error: any) {
      console.error('Avatar removal error:', error);
      toast({
        title: t('dashboard.avatar.removeError'),
        description: error.message,
        variant: "destructive"
      });
      return false;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploading,
    uploadAvatar,
    removeAvatar
  };
}