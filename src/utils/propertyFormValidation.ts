
import { UploadedImage } from "@/hooks/usePropertyImages";

export interface ValidationError {
  field: string;
  message: string;
}

export interface PropertyFormValidationSchema {
  hotelName: string;
  category: string;
  propertyType: string;
  description: string;
  country: string;
  city: string;
  contactEmail?: string;
  contactPhone?: string;
  latitude?: string | number;
  longitude?: string | number;
  hotelImages?: UploadedImage[];
  themes?: string[];
  activities?: string[];
  roomTypes?: any[];
}

export class PropertyFormValidator {
  private errors: ValidationError[] = [];

  validate(data: Partial<PropertyFormValidationSchema>, step: number): ValidationError[] {
    this.errors = [];

    switch (step) {
      case 1:
        this.validateStep1(data);
        break;
      case 2:
        this.validateStep2(data);
        break;
      case 3:
        this.validateStep3(data);
        break;
      case 4:
        this.validateStep4(data);
        break;
      case 5:
        this.validateStep5(data);
        break;
    }

    return this.errors;
  }

  private validateStep1(data: Partial<PropertyFormValidationSchema>) {
    // Essential validations for hotel registration
    if (!data.hotelName?.trim()) {
      this.addError('hotelName', 'Hotel name is required');
    }

    if (!data.category) {
      this.addError('category', 'Category is required');
    }

    if (!data.propertyType) {
      this.addError('propertyType', 'Property type is required');
    }

    if (!data.description?.trim()) {
      this.addError('description', 'Description is required');
    } else if (data.description.length < 50) {
      this.addError('description', 'Description must be at least 50 characters');
    }

    if (!data.country) {
      this.addError('country', 'Country is required');
    }

    if (!data.city?.trim()) {
      this.addError('city', 'City is required');
    }

    // Email validation
    if (data.contactEmail && !this.isValidEmail(data.contactEmail)) {
      this.addError('contactEmail', 'Invalid email format');
    }

    // Phone validation
    if (data.contactPhone && !this.isValidPhone(data.contactPhone)) {
      this.addError('contactPhone', 'Invalid phone format');
    }

    // Coordinate validation
    if (data.latitude !== undefined && data.latitude !== '') {
      const lat = Number(data.latitude);
      if (isNaN(lat) || lat < -90 || lat > 90) {
        this.addError('latitude', 'Latitude must be between -90 and 90');
      }
    }

    if (data.longitude !== undefined && data.longitude !== '') {
      const lng = Number(data.longitude);
      if (isNaN(lng) || lng < -180 || lng > 180) {
        this.addError('longitude', 'Longitude must be between -180 and 180');
      }
    }

    // CRITICAL: Image validation - hotels MUST have at least one authentic image
    if (!data.hotelImages || data.hotelImages.length === 0) {
      this.addError('hotelImages', '⚠️ You must upload at least one real image of the hotel to publish it');
    } else {
      // Check that images are not just placeholders
      const validImages = data.hotelImages.filter(img => 
        img.url && 
        img.url !== "/placeholder.svg" && 
        img.url.trim() !== '' &&
        !img.url.includes('placeholder')
      );
      
      if (validImages.length === 0) {
        this.addError('hotelImages', '⚠️ Please upload authentic photos of your hotel, not placeholder images');
      }
    }
  }

  private validateStep2(data: Partial<PropertyFormValidationSchema>) {
    // TEMPORARY: All step 2 validations disabled for development
    /*
    if (!data.themes || data.themes.length === 0) {
      this.addError('themes', 'At least one theme must be selected');
    }

    if (!data.activities || data.activities.length === 0) {
      this.addError('activities', 'At least one activity must be selected');
    }
    */
  }

  private validateStep3(data: Partial<PropertyFormValidationSchema>) {
    // TEMPORARY: All step 3 validations disabled for development
    /*
    if (!data.roomTypes || data.roomTypes.length === 0) {
      this.addError('roomTypes', 'At least one room type must be defined');
    }
    */
  }

  private validateStep4(data: Partial<PropertyFormValidationSchema>) {
    // TEMPORARY: All step 4 validations disabled for development
    // Pricing validation would go here
    // This step typically depends on data from step 3
  }

  private validateStep5(data: Partial<PropertyFormValidationSchema>) {
    // TEMPORARY: All step 5 validations disabled for development
    // Final validation for terms, etc.
  }

  private addError(field: string, message: string) {
    this.errors.push({ field, message });
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPhone(phone: string): boolean {
    // Basic phone validation - can be enhanced based on requirements
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }
}

export const propertyFormValidator = new PropertyFormValidator();
