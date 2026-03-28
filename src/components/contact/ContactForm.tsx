import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function ContactForm() {
  const { t } = useTranslation('contact');
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const departments = [
    { value: 'customerService', label: t('contact.form.departments.customerService') },
    { value: 'technicalSupport', label: t('contact.form.departments.technicalSupport') },
    { value: 'pressMedia', label: t('contact.form.departments.pressMedia') },
    { value: 'businessPartnerships', label: t('contact.form.departments.businessPartnerships') },
    { value: 'otherInquiries', label: t('contact.form.departments.otherInquiries') }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.department || !formData.message) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Submitting contact form...", { name: formData.name, email: formData.email, department: formData.department });
      
      // Send email via edge function
      const { data, error } = await supabase.functions.invoke('send-contact-form', {
        body: {
          name: formData.name,
          email: formData.email,
          department: formData.department,
          message: formData.message
        }
      });

      console.log("Email function response:", { data, error });
      
      if (error) {
        console.error("Email function error:", error);
        throw new Error(`Email sending failed: ${error.message}`);
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Unknown error occurred');
      }
      
      toast({
        title: "Message Sent", 
        description: "Your message has been sent successfully. We'll respond within 24 hours.",
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        department: '',
        message: ''
      });
      
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : t('contact.form.error')
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-[#7E26A6] p-8 rounded-lg">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-white">
        {t('contact.title')}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Department Selection Instructions - moved up */}
        <div className="text-white text-base mb-6">
          {t('contact.form.departmentInstruction')}
        </div>

        {/* Department Selection */}
        <div className="space-y-3">
          <Label className="text-white font-medium">
            {t('contact.form.department')} *
          </Label>
          <RadioGroup 
            value={formData.department} 
            onValueChange={(value) => handleInputChange('department', value)}
            className="space-y-2"
          >
            {departments.map((dept) => (
              <div key={dept.value} className="flex items-center space-x-2">
                <RadioGroupItem 
                  value={dept.value} 
                  id={dept.value}
                  className="border-white/60 text-white data-[state=checked]:bg-white data-[state=checked]:border-white data-[state=checked]:text-[#7E26A6]"
                />
                <Label 
                  htmlFor={dept.value} 
                  className="text-white cursor-pointer hover:text-white/90 transition-colors"
                >
                  {dept.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-white font-medium">
            {t('contact.form.name')} *
          </Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-white focus:ring-white/50"
            required
          />
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white font-medium">
            {t('contact.form.email')} *
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-white focus:ring-white/50"
            required
          />
        </div>

        {/* Message Field */}
        <div className="space-y-2">
          <Label htmlFor="message" className="text-white font-medium">
            {t('contact.form.message')} *
          </Label>
          <Textarea
            id="message"
            value={formData.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
            rows={6}
            className="bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-white focus:ring-white/50 resize-none"
            required
          />
        </div>

        {/* Contact Email Display */}
        <div className="text-center text-white/90 text-base mb-4">
          {t('contact.form.emailDestination', 'Your message will be sent to:')} <br />
          <span className="font-semibold text-white">contact@hotel-living.com</span>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-white text-[#7E26A6] hover:bg-white/90 font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? t('contact.form.sending') : t('contact.form.send')}
        </Button>
      </form>
    </div>
  );
}