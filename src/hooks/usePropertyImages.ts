
import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface UploadedImage {
  url: string;
  isMain: boolean;
  id?: string;
  name?: string;
  uploaded?: boolean;
}

export function usePropertyImages(initialImages: UploadedImage[] = [], updateFormData?: (field: string, value: any) => void) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const [mainImageIndex, setMainImageIndex] = useState<number>(
    initialImages.findIndex(img => img.isMain) !== -1 
      ? initialImages.findIndex(img => img.isMain) 
      : initialImages.length > 0 ? 0 : -1
  );
  
  const { user } = useAuth();
  const { toast } = useToast();

  // Update uploaded images when initialImages change (for editing)
  useEffect(() => {
    if (initialImages && initialImages.length > 0) {
      console.log("usePropertyImages - Setting initial images:", initialImages);
      setUploadedImages(initialImages);
      
      // Set main image index
      const mainIndex = initialImages.findIndex(img => img.isMain);
      setMainImageIndex(mainIndex !== -1 ? mainIndex : 0);
    }
  }, [initialImages]);

  // Ensure formData.mainImageUrl is kept in sync whenever mainImageIndex changes
  useEffect(() => {
    if (uploadedImages.length > 0 && mainImageIndex >= 0) {
      const mainUrl = uploadedImages[mainImageIndex].url;
      
      // Update form data if the updateFormData function is provided
      if (updateFormData) {
        updateFormData("mainImageUrl", mainUrl);
      }
    }
  }, [mainImageIndex, uploadedImages, updateFormData]);

  const addFiles = useCallback((newFiles: File[]) => {
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  }, []);

  const removeUploadedImage = useCallback((index: number) => {
    setUploadedImages(prev => {
      const imageToRemove = prev[index];
      
      // Clean up blob URL if it exists
      if (imageToRemove?.url.startsWith('blob:')) {
        URL.revokeObjectURL(imageToRemove.url);
      }
      
      return prev.filter((_, i) => i !== index);
    });
    
    // If removed image was the main image, set first remaining image as main
    if (index === mainImageIndex) {
      setMainImageIndex(prev => (prev > 0 ? 0 : -1));
    } else if (index < mainImageIndex) {
      // Adjust main image index if a previous image was removed
      setMainImageIndex(prev => prev - 1);
    }
  }, [mainImageIndex]);

  const uploadFiles = useCallback(async () => {
    if (files.length === 0) {
      return;
    }
    
    setUploading(true);
    
    try {
      // Create temporary object URLs for immediate preview
      const newUploadedImages = [...uploadedImages];
      
      for (const file of files) {
        // Create a temporary URL for preview (will be replaced with actual storage URL during submission)
        const tempUrl = URL.createObjectURL(file);
        
        console.log("usePropertyImages - Creating blob URL for file:", file.name, "->", tempUrl);
        
        newUploadedImages.push({
          url: tempUrl,
          isMain: newUploadedImages.length === 0, // First image is main by default
          id: `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          name: file.name,
          uploaded: false // Mark as not yet uploaded to storage
        });
      }
      
      console.log("usePropertyImages - Setting uploaded images:", newUploadedImages);
      setUploadedImages(newUploadedImages);
      setFiles([]);
      
      // If it's the first upload, set the first image as main
      if (mainImageIndex === -1 && newUploadedImages.length > 0) {
        setMainImageIndex(0);
      }
      
      toast({
        title: "Images added",
        description: `${files.length} image(s) added successfully. They will be permanently stored when you submit the property.`
      });
    } catch (error: any) {
      console.error("Error processing files:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process images"
      });
    } finally {
      setUploading(false);
    }
  }, [files, uploadedImages, mainImageIndex, toast]);
  
  const setMainImage = useCallback((index: number) => {
    setUploadedImages(prev => 
      prev.map((img, i) => ({
        ...img,
        isMain: i === index
      }))
    );
    setMainImageIndex(index);
  }, []);

  // Clean up blob URLs when component unmounts
  useEffect(() => {
    return () => {
      uploadedImages.forEach(img => {
        if (img.url.startsWith('blob:')) {
          URL.revokeObjectURL(img.url);
        }
      });
    };
  }, []);

  return {
    files,
    uploadedImages,
    uploading,
    mainImageIndex,
    addFiles,
    removeFile,
    removeUploadedImage,
    uploadFiles,
    setMainImage
  };
}
