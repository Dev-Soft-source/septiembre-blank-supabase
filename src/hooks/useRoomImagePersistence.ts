import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";

export function useRoomImagePersistence() {
  const [uploading, setUploading] = useState(false);

  const uploadRoomImageToStorage = async (file: File, hotelId: string, roomTypeId: string, index: number): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${hotelId}/rooms/${roomTypeId}/${Date.now()}-${index}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('hotel-images')
      .upload(fileName, file);

    if (error) {
      console.error('Error uploading room image to storage:', error);
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('hotel-images')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const convertBlobToFile = async (blobUrl: string, fileName: string): Promise<File> => {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    return new File([blob], fileName, { type: blob.type || 'image/jpeg' });
  };

  const persistRoomImages = async (
    images: File[], 
    hotelId: string, 
    roomTypeId: string
  ): Promise<string[]> => {
    if (!images || images.length === 0) {
      return [];
    }

    setUploading(true);
    
    try {
      const uploadPromises = images.map(async (file, index) => {
        return await uploadRoomImageToStorage(file, hotelId, roomTypeId, index);
      });

      const permanentUrls = await Promise.all(uploadPromises);
      console.log("Room images uploaded successfully:", permanentUrls);
      
      return permanentUrls;
    } catch (error) {
      console.error("Error persisting room images:", error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const convertBlobUrlsToPermanent = async (
    blobUrls: string[], 
    hotelId: string, 
    roomTypeId: string
  ): Promise<string[]> => {
    if (!blobUrls || blobUrls.length === 0) {
      return [];
    }

    setUploading(true);
    
    try {
      const uploadPromises = blobUrls.map(async (blobUrl, index) => {
        if (blobUrl.startsWith('blob:')) {
          // Convert blob URL to file and upload
          const file = await convertBlobToFile(blobUrl, `room-image-${index}.jpg`);
          const permanentUrl = await uploadRoomImageToStorage(file, hotelId, roomTypeId, index);
          
          // Clean up the blob URL
          URL.revokeObjectURL(blobUrl);
          
          return permanentUrl;
        } else if (blobUrl.startsWith('http')) {
          // Already a permanent URL, keep it
          return blobUrl;
        } else {
          throw new Error(`Invalid image URL: ${blobUrl}`);
        }
      });

      const permanentUrls = await Promise.all(uploadPromises);
      console.log("Blob URLs converted to permanent URLs:", permanentUrls);
      
      return permanentUrls;
    } catch (error) {
      console.error("Error converting blob URLs to permanent URLs:", error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  return {
    persistRoomImages,
    convertBlobUrlsToPermanent,
    uploading
  };
}
