
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { FormValues } from "./ValidationSchema";

export const useSubmitHandler = () => {
  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFiles: React.Dispatch<React.SetStateAction<File[]>>
  ) => {
    const selectedFiles = Array.from(event.target.files || []);
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'image/jpg'];
    
    const validFiles = selectedFiles.filter(file => {
      if (file.size > maxSize) {
        toast.error(`File ${file.name} is too large. Maximum size is 10MB.`, {
          style: { 
            background: '#ef4444', 
            color: 'white',
            border: '1px solid #dc2626'
          },
          duration: 8000
        });
        return false;
      }
      if (!allowedTypes.includes(file.type)) {
        toast.error(`File ${file.name} has an invalid format. Please use PDF, DOC, DOCX, JPG, JPEG, or PNG.`, {
          style: { 
            background: '#ef4444', 
            color: 'white',
            border: '1px solid #dc2626'
          },
          duration: 8000
        });
        return false;
      }
      return true;
    });

    setFiles(prev => [...prev, ...validFiles]);
    // Reset the input value
    event.target.value = '';
  };

  const removeFile = (
    index: number,
    setFiles: React.Dispatch<React.SetStateAction<File[]>>
  ) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const submitForm = async (
    data: FormValues,
    files: File[],
    setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>,
    formReset: () => void,
    setFiles: React.Dispatch<React.SetStateAction<File[]>>,
    setShowConfirmation: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setIsSubmitting(true);
    try {
      console.log("Submitting form data:", data);
      
      // Insert the form data into join_us_submissions table (which has email notifications)
      const { data: submission, error: insertError } = await supabase
        .from("join_us_submissions")
        .insert({
          name: data.fullName,
          email: data.email,
          message: `Tier: ${data.tier}\n\n${data.motivation}`,
          recipient_email: "grand_soiree@yahoo.com"
        })
        .select()
        .single();

      if (insertError) {
        console.error("Database insertion error:", insertError);
        throw new Error(`Failed to submit application: ${insertError.message}`);
      }

      console.log("Form data inserted successfully, submission ID:", submission.id);

      // Upload files if any and link them to the submission
      if (files.length > 0) {
        console.log(`Uploading ${files.length} files`);
        const uploadPromises = files.map(async (file) => {
          const fileName = `${submission.id}/${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name}`;
          const { error: uploadError } = await supabase.storage
            .from("join-us-uploads")
            .upload(fileName, file);

          if (uploadError) {
            console.error("File upload error:", uploadError);
            toast.error(`Failed to upload ${file.name}: ${uploadError.message}`, {
              style: { 
                background: '#ef4444', 
                color: 'white',
                border: '1px solid #dc2626'
              },
              duration: 8000
            });
            return false;
          }

          // Record the file in the join_us_files table
          const { error: fileRecordError } = await supabase
            .from("join_us_files")
            .insert({
              submission_id: submission.id,
              file_name: file.name,
              file_path: fileName,
              file_type: file.type,
              file_size: file.size
            });

          if (fileRecordError) {
            console.error("File record error:", fileRecordError);
          }

          return true;
        });

        const uploadResults = await Promise.all(uploadPromises);
        const successfulUploads = uploadResults.filter(Boolean).length;
        console.log(`Successfully uploaded ${successfulUploads} out of ${files.length} files`);
      }

      formReset();
      setFiles([]);
      setShowConfirmation(true);
      
      toast.success("Your application has been sent! We'll get back to you soon.", {
        style: { 
          background: '#22c55e', 
          color: 'white',
          border: '1px solid #16a34a'
        },
        duration: 10000
      });
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to send your application. Please try again later.", {
        style: { 
          background: '#ef4444', 
          color: 'white',
          border: '1px solid #dc2626'
        },
        duration: 10000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleFileUpload,
    removeFile,
    submitForm
  };
};
