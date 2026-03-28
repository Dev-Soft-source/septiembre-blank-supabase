
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { RecommendHotelFormValues } from "../schema";

interface RecommendHotelFormFieldsProps {
  form: UseFormReturn<RecommendHotelFormValues>;
}

export const RecommendHotelFormFields: React.FC<RecommendHotelFormFieldsProps> = ({ form }) => {
  return (
    <>
      {/* Hotel Name */}
      <FormField
        control={form.control}
        name="hotelName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hotel Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter the hotel name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* City */}
      <FormField
        control={form.control}
        name="city"
        render={({ field }) => (
          <FormItem>
            <FormLabel>City (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="Enter the hotel's city" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Contact Name */}
      <FormField
        control={form.control}
        name="contactName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Person</FormLabel>
            <FormControl>
              <Input placeholder="Enter the name of a contact person at the hotel" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Contact Email */}
      <FormField
        control={form.control}
        name="contactEmail"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Email</FormLabel>
            <FormControl>
              <Input placeholder="Enter contact email" type="email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Contact Phone */}
      <FormField
        control={form.control}
        name="contactPhone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Phone (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="Enter contact phone number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Additional Info */}
      <FormField
        control={form.control}
        name="additionalInfo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Additional Information (Optional)</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Any additional details or notes about the hotel" 
                className="min-h-[100px]"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
