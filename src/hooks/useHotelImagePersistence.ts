import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";

export function useHotelImagePersistence() {
  const [uploading, setUploading] = useState(false);

  const uploadHotelImageToStorage = async (file: File, hotelId: string, index: number, isRoom: boolean = false): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const imageType = isRoom ? 'rooms' : 'hotel';
    const fileName = `${hotelId}/${imageType}/${Date.now()}-${index}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('Hotel Images')
      .upload(fileName, file);

    if (error) {
      console.error('Error uploading hotel image to storage:', error);
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('Hotel Images')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const convertBlobToFile = async (blobUrl: string, fileName: string): Promise<File> => {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    return new File([blob], fileName, { type: blob.type || 'image/jpeg' });
  };

  const convertBlobUrlsToPermanent = async (
    blobUrls: string[], 
    hotelId: string,
    isRoom: boolean = false
  ): Promise<string[]> => {
    if (!blobUrls || blobUrls.length === 0) {
      return [];
    }

    setUploading(true);
    
    try {
      const uploadPromises = blobUrls.map(async (blobUrl, index) => {
        if (blobUrl.startsWith('blob:')) {
          // Convert blob URL to file and upload
          const imageType = isRoom ? 'room' : 'hotel';
          const file = await convertBlobToFile(blobUrl, `${imageType}-image-${index}.jpg`);
          const permanentUrl = await uploadHotelImageToStorage(file, hotelId, index, isRoom);
          
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
      console.log("Hotel blob URLs converted to permanent URLs:", permanentUrls);
      
      return permanentUrls;
    } catch (error) {
      console.error("Error converting hotel blob URLs to permanent URLs:", error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const uploadImagesToStorage = async (
    hotelImages: string[],
    roomImages: string[],
    hotelId: string
  ): Promise<{ hotelUrls: string[], roomUrls: string[] }> => {
    try {
      setUploading(true);
      
      const [hotelUrls, roomUrls] = await Promise.all([
        convertBlobUrlsToPermanent(hotelImages, hotelId, false),
        convertBlobUrlsToPermanent(roomImages, hotelId, true)
      ]);

      return { hotelUrls, roomUrls };
    } catch (error) {
      console.error("Error uploading images to storage:", error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  return {
    convertBlobUrlsToPermanent,
    uploadImagesToStorage,
    uploading
  };
}
