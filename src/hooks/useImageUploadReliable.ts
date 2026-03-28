import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const MAX_HOTEL_IMAGES = 10;
const MAX_ROOM_IMAGES = 5;
const MAX_FILE_SIZE = 500 * 1024; // 500 KB
const ALLOWED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png'];

export interface UploadedImageReliable {
  url: string;
  isMain: boolean;
  id: string;
  name: string;
  uploaded: boolean;
  file?: File;
  uploading?: boolean;
  error?: string;
}

export interface UploadProgress {
  total: number;
  completed: number;
  uploading: boolean;
  errors: string[];
}

export function useImageUploadReliable() {
  const [hotelImages, setHotelImages] = useState<UploadedImageReliable[]>([]);
  const [roomImages, setRoomImages] = useState<UploadedImageReliable[]>([]);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    total: 0,
    completed: 0,
    uploading: false,
    errors: []
  });
  
  const { toast } = useToast();
  const { user } = useAuth();

  const validateFile = useCallback((file: File, type: 'hotel' | 'room'): string | null => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return `File "${file.name}" exceeds maximum size of 500 KB. Current size: ${Math.round(file.size / 1024)} KB`;
    }

    // Check file format
    if (!ALLOWED_FORMATS.includes(file.type.toLowerCase())) {
      return `File "${file.name}" has invalid format. Only JPG and PNG are allowed.`;
    }

    // Check quantity limits
    const currentCount = type === 'hotel' ? hotelImages.length : roomImages.length;
    const maxCount = type === 'hotel' ? MAX_HOTEL_IMAGES : MAX_ROOM_IMAGES;
    
    if (currentCount >= maxCount) {
      return `Maximum ${maxCount} ${type} photos allowed. Current count: ${currentCount}`;
    }

    return null;
  }, [hotelImages.length, roomImages.length]);

  const uploadToStorage = useCallback(async (file: File, type: 'hotel' | 'room'): Promise<string> => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const fileName = `${user.id}/${type}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('Hotel Images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Storage upload error:', error);
      throw new Error(`Failed to upload ${file.name}: ${error.message}`);
    }

    const { data: { publicUrl } } = supabase.storage
      .from('Hotel Images')
      .getPublicUrl(fileName);

    return publicUrl;
  }, [user?.id]);

  const addFiles = useCallback(async (files: File[], type: 'hotel' | 'room') => {
    if (!files.length) return;

    // Validate all files first
    const validationErrors: string[] = [];
    const validFiles: File[] = [];

    for (const file of files) {
      const error = validateFile(file, type);
      if (error) {
        validationErrors.push(error);
      } else {
        validFiles.push(file);
      }
    }

    // Show validation errors immediately
    if (validationErrors.length > 0) {
      validationErrors.forEach(error => {
        toast({
          title: "Upload Validation Error",
          description: error,
          variant: "destructive",
          duration: 5000
        });
      });
    }

    if (validFiles.length === 0) {
      return;
    }

    // Create pending upload entries
    const pendingImages: UploadedImageReliable[] = validFiles.map(file => ({
      url: URL.createObjectURL(file), // Temporary preview URL
      isMain: false,
      id: `pending-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: file.name,
      uploaded: false,
      file,
      uploading: true
    }));

    // Add to state immediately for UI feedback
    if (type === 'hotel') {
      setHotelImages(prev => [...prev, ...pendingImages]);
    } else {
      setRoomImages(prev => [...prev, ...pendingImages]);
    }

    // Start upload progress tracking
    setUploadProgress({
      total: validFiles.length,
      completed: 0,
      uploading: true,
      errors: []
    });

    // Upload files one by one
    const uploadResults: { success: boolean; image?: UploadedImageReliable; error?: string }[] = [];
    
    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      const pendingImage = pendingImages[i];

      try {
        const storageUrl = await uploadToStorage(file, type);
        
        const uploadedImage: UploadedImageReliable = {
          ...pendingImage,
          url: storageUrl,
          uploaded: true,
          uploading: false,
          file: undefined // Remove file reference after upload
        };

        uploadResults.push({ success: true, image: uploadedImage });
        
        // Update progress
        setUploadProgress(prev => ({
          ...prev,
          completed: prev.completed + 1
        }));

      } catch (error: any) {
        console.error(`Upload failed for ${file.name}:`, error);
        
        uploadResults.push({ 
          success: false, 
          error: `Failed to upload ${file.name}: ${error.message}` 
        });

        setUploadProgress(prev => ({
          ...prev,
          completed: prev.completed + 1,
          errors: [...prev.errors, `Failed to upload ${file.name}: ${error.message}`]
        }));
      }
    }

    // Update state with final results
    const setter = type === 'hotel' ? setHotelImages : setRoomImages;
    setter(prev => {
      const updatedImages = [...prev];
      
      for (let i = 0; i < uploadResults.length; i++) {
        const result = uploadResults[i];
        const pendingIndex = updatedImages.findIndex(img => img.id === pendingImages[i].id);
        
        if (pendingIndex !== -1) {
          if (result.success && result.image) {
            updatedImages[pendingIndex] = result.image;
          } else {
            // Remove failed uploads
            updatedImages.splice(pendingIndex, 1);
          }
        }
      }
      
      return updatedImages;
    });

    // Finish upload progress
    setUploadProgress(prev => ({
      ...prev,
      uploading: false
    }));

    // Show summary
    const successCount = uploadResults.filter(r => r.success).length;
    const failCount = uploadResults.filter(r => !r.success).length;

    if (successCount > 0) {
      toast({
        title: "Upload Complete",
        description: `${successCount} ${type} image(s) uploaded successfully${failCount > 0 ? `, ${failCount} failed` : ''}`,
        duration: 3000
      });
    }

    if (failCount > 0) {
      uploadResults.filter(r => !r.success).forEach(result => {
        if (result.error) {
          toast({
            title: "Upload Failed",
            description: result.error,
            variant: "destructive",
            duration: 7000
          });
        }
      });
    }
  }, [validateFile, uploadToStorage, toast]);

  const removeImage = useCallback((id: string, type: 'hotel' | 'room') => {
    const setter = type === 'hotel' ? setHotelImages : setRoomImages;
    
    setter(prev => {
      const imageToRemove = prev.find(img => img.id === id);
      
      // Clean up blob URL if it's a temporary preview
      if (imageToRemove?.url.startsWith('blob:')) {
        URL.revokeObjectURL(imageToRemove.url);
      }
      
      return prev.filter(img => img.id !== id);
    });
  }, []);

  const setMainImage = useCallback((id: string, type: 'hotel' | 'room') => {
    const setter = type === 'hotel' ? setHotelImages : setRoomImages;
    
    setter(prev => 
      prev.map(img => ({
        ...img,
        isMain: img.id === id
      }))
    );
  }, []);

  const retryFailedUploads = useCallback(async (type: 'hotel' | 'room') => {
    const images = type === 'hotel' ? hotelImages : roomImages;
    const failedImages = images.filter(img => !img.uploaded && img.file);
    
    if (failedImages.length === 0) {
      toast({
        title: "No Failed Uploads",
        description: "All images have been uploaded successfully",
        duration: 3000
      });
      return;
    }

    const files = failedImages.map(img => img.file!);
    await addFiles(files, type);
  }, [hotelImages, roomImages, addFiles, toast]);

  const isUploading = useCallback(() => {
    return uploadProgress.uploading || 
           hotelImages.some(img => img.uploading) || 
           roomImages.some(img => img.uploading);
  }, [uploadProgress.uploading, hotelImages, roomImages]);

  const getAllUploadedUrls = useCallback(() => {
    const uploadedHotelUrls = hotelImages.filter(img => img.uploaded).map(img => img.url);
    const uploadedRoomUrls = roomImages.filter(img => img.uploaded).map(img => img.url);
    
    return {
      hotel: uploadedHotelUrls,
      room: uploadedRoomUrls,
      allUploaded: hotelImages.every(img => img.uploaded) && roomImages.every(img => img.uploaded)
    };
  }, [hotelImages, roomImages]);

  return {
    hotelImages,
    roomImages,
    uploadProgress,
    addFiles,
    removeImage,
    setMainImage,
    retryFailedUploads,
    isUploading,
    getAllUploadedUrls,
    limits: {
      maxHotelImages: MAX_HOTEL_IMAGES,
      maxRoomImages: MAX_ROOM_IMAGES,
      maxFileSize: MAX_FILE_SIZE,
      allowedFormats: ALLOWED_FORMATS
    }
  };
}