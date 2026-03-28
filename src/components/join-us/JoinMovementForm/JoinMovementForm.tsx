
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { FormValues, formSchema } from "./ValidationSchema";
import { useSubmitHandler } from "./SubmitHandler";
import { FormFields } from "./FormFields";
import { ConfirmationView } from "./ConfirmationView";

export function JoinMovementForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      tier: "",
      motivation: ""
    }
  });

  const { handleFileUpload, removeFile, submitForm } = useSubmitHandler();

  const onFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(event, setFiles);
  };

  const onRemoveFile = (index: number) => {
    removeFile(index, setFiles);
  };

  async function onSubmit(data: FormValues) {
    await submitForm(
      data,
      files,
      setIsSubmitting,
      form.reset,
      setFiles,
      setShowConfirmation
    );
  }

  if (showConfirmation) {
    return (
      <ConfirmationView 
        onSubmitAnother={() => setShowConfirmation(false)}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-[#4b0456] p-8 rounded-lg mt-8">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-[#FFF9B0]">
        JOIN THE MOVEMENT – EXPRESS YOUR INTEREST
      </h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormFields
            form={form}
            files={files}
            onFileUpload={onFileUpload}
            onRemoveFile={onRemoveFile}
            isSubmitting={isSubmitting}
          />
        </form>
      </Form>
    </div>
  );
}
