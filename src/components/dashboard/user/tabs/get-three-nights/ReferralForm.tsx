
import React from "react";
import { Form } from "@/components/ui/form";
import { useReferralSubmit } from "./hooks/useReferralSubmit";
import { ReferralFormFields } from "./form/ReferralFormFields";
import { ReferralSubmitButton } from "./form/ReferralSubmitButton";

const ReferralForm = () => {
  const { form, onSubmit, isSubmitting } = useReferralSubmit();

  return (
    <div className="glass-card rounded-2xl p-6 bg-[#7a0486]">
      <h3 className="text-xl font-semibold mb-6">Refer a Hotel</h3>
      
      <div className="mb-6 p-5 bg-[#8a1a96]/30 rounded-lg">
        <div className="text-sm">
          <p className="font-semibold mb-2">Important: 15-Day Registration Window</p>
          <p>After your referral, the hotel must register within 15 calendar days for you to receive the three free nights reward.</p>
          <p className="mt-2">Make sure to personally introduce the hotel to our platform and encourage them to sign up promptly.</p>
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <ReferralFormFields form={form} />
          <ReferralSubmitButton isSubmitting={isSubmitting} />
        </form>
      </Form>
    </div>
  );
};

export default ReferralForm;
