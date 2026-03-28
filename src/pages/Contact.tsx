
import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HotelStarfield } from "@/components/hotels/HotelStarfield";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactFormDuplicate } from "@/components/contact/ContactFormDuplicate";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

export default function Contact() {
  // Initialize smooth scroll for any anchor links
  useSmoothScroll();
  
  return (
    <div className="min-h-screen flex flex-col">
      <HotelStarfield />
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12" role="main" aria-label="Contact information">
        <ContactForm />
        
        {/* Spacing between forms */}
        <div className="my-16"></div>
        
        {/* Duplicate Contact Form */}
        <ContactFormDuplicate />
      </main>
      
      <Footer />
    </div>
  );
}
