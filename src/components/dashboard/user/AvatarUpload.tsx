
import React, { useRef } from "react";
import { Camera, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslation } from "@/hooks/useTranslation";
import { useAvatarUpload } from "@/hooks/useAvatarUpload";
import { useAuth } from "@/context/AuthContext";

export function AvatarUpload() {
  const { t } = useTranslation();
  const { user, profile } = useAuth();
  const { uploading, uploadAvatar, removeAvatar } = useAvatarUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await uploadAvatar(file);
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarImage src={profile?.avatar_url || ""} />
          <AvatarFallback className="text-2xl font-semibold">{getInitials()}</AvatarFallback>
        </Avatar>
        
        <Button
          size="sm"
          variant="secondary"
          className="absolute -bottom-2 -right-2 rounded-full p-2 h-8 w-8"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <Camera className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? t('dashboard.avatar.uploading') : t('dashboard.avatar.upload')}
        </Button>

        {profile?.avatar_url && (
          <Button
            variant="outline"
            size="sm"
            onClick={removeAvatar}
            disabled={uploading}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {t('dashboard.avatar.remove')}
          </Button>
        )}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        {t('dashboard.avatar.dimensionsRecommendation')}
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
