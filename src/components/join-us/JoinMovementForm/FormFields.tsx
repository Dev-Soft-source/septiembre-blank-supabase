
import React from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { FormValues, tierOptions } from "./ValidationSchema";

interface FormFieldsProps {
  form: UseFormReturn<FormValues>;
  files: File[];
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
  isSubmitting: boolean;
}

export function FormFields({ 
  form, 
  files, 
  onFileUpload, 
  onRemoveFile, 
  isSubmitting 
}: FormFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="fullName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-slate-50">Full Name</FormLabel>
            <FormControl>
              <Input 
                placeholder="Your full name" 
                {...field} 
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-slate-50">Email Address</FormLabel>
            <FormControl>
              <Input 
                type="email"
                placeholder="your.email@example.com" 
                {...field} 
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="tier"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-slate-50">Choose your Tier</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="bg-white/10 border-white/20 text-white placeholder:text-white/60">
                  <SelectValue placeholder="Select your preferred tier" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-[#4b0456] border-white/20">
                {tierOptions.map((option) => (
                  <SelectItem 
                    key={option.value} 
                    value={option.value}
                    className="text-white hover:bg-white/10 focus:bg-white/10"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="motivation"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-slate-50">Tell us more about yourself or your motivation</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Share your motivation, experience, or why you want to join the Hotel-Living movement..." 
                {...field} 
                rows={5}
                maxLength={600}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 resize-none"
              />
            </FormControl>
            <div className="text-right text-white/60 text-sm">
              {field.value?.length || 0}/600 characters
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* File Upload Section */}
      <div className="space-y-4">
        <FormLabel className="text-slate-50">Attach Files (Optional)</FormLabel>
        <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={onFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center space-y-2"
          >
            <Upload className="h-8 w-8 text-white/60" />
            <span className="text-white/80 text-sm">
              Click to upload files or drag and drop
            </span>
            <span className="text-white/60 text-xs">
              PDF, DOC, DOCX, JPG, JPEG, PNG (Max 10MB each)
            </span>
          </label>
        </div>

        {/* Display uploaded files */}
        {files.length > 0 && (
          <div className="space-y-2">
            <p className="text-slate-50 text-sm font-medium">Uploaded Files:</p>
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white/10 rounded-lg p-3 border border-white/20"
              >
                <span className="text-white text-sm truncate flex-1">
                  {file.name}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveFile(index)}
                  className="text-white/60 hover:text-white hover:bg-white/10 ml-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-[#FFF9B0] hover:bg-[#FFF9B0]/90 text-[#4b0456] font-semibold py-3 text-lg"
      >
        {isSubmitting ? 'SENDING YOUR APPLICATION...' : 'SEND YOUR APPLICATION'}
      </Button>
    </>
  );
}
