
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { UseFormReturn } from "react-hook-form";
import { ReferralFormValues } from "../schema";

interface ReferralFormFieldsProps {
  form: UseFormReturn<ReferralFormValues>;
}

export const ReferralFormFields: React.FC<ReferralFormFieldsProps> = ({ form }) => {
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

      {/* Referral Date */}
      <FormField
        control={form.control}
        name="referralDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Referral Date</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={
                      "w-full pl-3 text-left font-normal"
                    }
                  >
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
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
                placeholder="Any additional details about your referral" 
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
