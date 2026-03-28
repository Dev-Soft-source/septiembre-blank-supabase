
import { UploadedImage } from "@/hooks/usePropertyImages";

export const validateRequiredField = (value: string, fieldName: string): string | undefined => {
  if (!value || value.trim() === '') {
    switch (fieldName) {
      case 'hotelName':
      case 'name':
        return "Hotel name is required";
      default:
        // All other fields are optional for submission but marked as required in UI
        return undefined;
    }
  }
  return undefined;
};

export const validateEmail = (email: string): string | undefined => {
  if (email && !/\S+@\S+\.\S+/.test(email)) {
    return "Invalid email format";
  }
  return undefined;
};

export const validateCoordinate = (coordinate: string, type: 'latitude' | 'longitude'): string | undefined => {
  if (!coordinate) return undefined;
  
  if (isNaN(Number(coordinate))) {
    return type === 'latitude' ? "Latitude must be a valid number" : "Longitude must be a valid number";
  }
  
  const value = Number(coordinate);
  if (type === 'latitude') {
    if (value < -90 || value > 90) {
      return "Latitude must be between -90 and 90";
    }
  } else {
    if (value < -180 || value > 180) {
      return "Longitude must be between -180 and 180";
    }
  }
  
  return undefined;
};

export const validateImages = (images: UploadedImage[]): string | undefined => {
  if (!images || images.length === 0) {
    return "At least one hotel image is required";
  }
  return undefined;
};
