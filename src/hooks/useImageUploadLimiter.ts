
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";

export interface ImageUploadLimits {
  maxImages: number;
  maxUploadsPerMinute: number;
  maxFileSize: number; // in bytes
}

export function useImageUploadLimiter(limits: ImageUploadLimits) {
  const { maxImages, maxUploadsPerMinute, maxFileSize } = limits;
  const [uploadCount, setUploadCount] = useState(0);
  const uploadTimestamps = useRef<number[]>([]);
  const { toast } = useToast();
  const { t } = useTranslation();

  const canUpload = (currentImageCount: number, newFilesCount: number): boolean => {
    // Check total image limit
    if (currentImageCount + newFilesCount > maxImages) {
      toast({
        title: t('dashboard.imageLimitReached'),
        description: t('dashboard.maxImagesAllowed', { max: maxImages }),
        variant: "destructive",
      });
      return false;
    }

    // Check rate limit
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    
    // Clean old timestamps
    uploadTimestamps.current = uploadTimestamps.current.filter(
      timestamp => timestamp > oneMinuteAgo
    );

    if (uploadTimestamps.current.length + newFilesCount > maxUploadsPerMinute) {
      toast({
        title: t('dashboard.uploadRateLimitReached'),
        description: t('dashboard.tooManyUploadsPerMinute', { max: maxUploadsPerMinute }),
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const validateFiles = (files: File[]): { validFiles: File[], errors: string[] } => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    files.forEach(file => {
      // Check file size
      if (file.size > maxFileSize) {
        errors.push(t('dashboard.fileTooLarge', { 
          fileName: file.name, 
          maxSize: Math.round(maxFileSize / (1024 * 1024)) 
        }));
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        errors.push(t('dashboard.invalidFileType', { fileName: file.name }));
        return;
      }

      validFiles.push(file);
    });

    return { validFiles, errors };
  };

  const recordUpload = (fileCount: number) => {
    const now = Date.now();
    for (let i = 0; i < fileCount; i++) {
      uploadTimestamps.current.push(now);
    }
    setUploadCount(prev => prev + fileCount);
  };

  const getRemainingUploads = (): number => {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    
    // Clean old timestamps
    uploadTimestamps.current = uploadTimestamps.current.filter(
      timestamp => timestamp > oneMinuteAgo
    );

    return Math.max(0, maxUploadsPerMinute - uploadTimestamps.current.length);
  };

  return {
    canUpload,
    validateFiles,
    recordUpload,
    getRemainingUploads,
    limits
  };
}
