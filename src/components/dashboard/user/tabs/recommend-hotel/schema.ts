
import * as z from 'zod';

export const recommendHotelSchema = z.object({
  hotelName: z.string().min(1, { message: "Hotel name is required" }),
  contactName: z.string().min(1, { message: "Contact person name is required" }),
  contactEmail: z.string().email({ message: "Valid email address is required" }),
  contactPhone: z.string().optional(),
  city: z.string().optional(),
  additionalInfo: z.string().optional(),
});

export type RecommendHotelFormValues = z.infer<typeof recommendHotelSchema>;
