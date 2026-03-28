
import React from "react";
import { Form } from "@/components/ui/form";
import { useRecommendHotelSubmit } from "./hooks/useRecommendHotelSubmit";
import { RecommendHotelFormFields } from "./form/RecommendHotelFormFields";
import { RecommendHotelSubmitButton } from "./form/RecommendHotelSubmitButton";
import { RecommendationPreview } from "./RecommendationPreview";

const RecommendHotelForm = () => {
  const { form, onSubmit, isSubmitting } = useRecommendHotelSubmit();

  return (
    <div className="glass-card rounded-2xl p-6 bg-[#7a0486]">
      <h3 className="text-xl font-semibold mb-6">Recommend a Hotel</h3>
      
      {/* Message Preview */}
      <RecommendationPreview />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <RecommendHotelFormFields form={form} />
          <RecommendHotelSubmitButton isSubmitting={isSubmitting} />
        </form>
      </Form>
    </div>
  );
};

export default RecommendHotelForm;
