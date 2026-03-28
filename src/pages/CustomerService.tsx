
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Starfield } from "@/components/Starfield";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslation } from "@/hooks/useTranslation";

export default function CustomerService() {
  const { t } = useTranslation('customerService');
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "",
    city: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = useIsMobile();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Here we'd normally handle the form submission with an API
    // For now, we'll just simulate a successful submission
    setTimeout(() => {
      // In a real implementation, you would send this to an API endpoint
      const mailtoLink = `mailto:grand_soiree@yahoo.com?subject=Customer Service Inquiry from ${formData.name}&body=Name: ${formData.name}%0D%0AEmail: ${formData.email}%0D%0ACountry: ${formData.country}%0D%0ACity: ${formData.city}%0D%0A%0D%0A${formData.message}`;
      window.open(mailtoLink, "_blank");
      
      toast.success(t('customerService.success'));
      setIsSubmitting(false);
      setFormData({
        name: "",
        email: "",
        country: "",
        city: "",
        message: ""
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Starfield />
      <Navbar />
      
      <main className="flex-1 pt-20 px-4 text-white">
        <div className="container max-w-4xl mx-auto py-10">
          {isMobile ? (
            <div className="bg-[#4b0456] p-6 rounded-lg mb-8">
              <h1 className="text-3xl font-bold mb-6 text-white">{t('customerService.title')}</h1>
              <div className="prose prose-invert max-w-none">
                <p className="text-white">{t('customerService.description')}</p>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-6">{t('customerService.title')}</h1>
              <div className="prose prose-invert max-w-none mb-8">
                <p>{t('customerService.description')}</p>
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto glass-card p-6 rounded-lg" style={{ backgroundColor: "#68178D" }}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">{t('customerService.form.name')}</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                  className="border-border text-foreground"
                  style={{ backgroundColor: "#FFFFCF" }}
                />
              </div>
              
              <div>
                <Label htmlFor="email">{t('customerService.form.email')}</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                  className="border-border text-foreground"
                  style={{ backgroundColor: "#FFFFCF" }}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="country">{t('customerService.form.country')}</Label>
                  <Input 
                    id="country" 
                    name="country" 
                    value={formData.country} 
                    onChange={handleChange} 
                    required 
                    className="border-border text-foreground"
                    style={{ backgroundColor: "#FFFFCF" }}
                  />
                </div>
                
                <div>
                  <Label htmlFor="city">{t('customerService.form.city')}</Label>
                  <Input 
                    id="city" 
                    name="city" 
                    value={formData.city} 
                    onChange={handleChange} 
                    required 
                    className="border-border text-foreground"
                    style={{ backgroundColor: "#FFFFCF" }}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="message">{t('customerService.form.message')}</Label>
                <Textarea 
                  id="message" 
                  name="message" 
                  value={formData.message} 
                  onChange={handleChange} 
                  required 
                  className="min-h-[200px] border-border text-foreground"
                  style={{ backgroundColor: "#FFFFCF" }}
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? t('customerService.form.sending') : t('customerService.form.send')}
            </Button>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
