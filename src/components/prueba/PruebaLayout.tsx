
import React, { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { LogOut, HelpCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { HotelStarfield } from "@/components/hotels/HotelStarfield";

interface PruebaLayoutProps {
  children: ReactNode;
}

export default function PruebaLayout({ children }: PruebaLayoutProps) {
  const { signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        description: "Redirecting to login page..."
      });
      navigate('/login');
    } catch (error) {
      toast({
        description: "Could not log out. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <HotelStarfield />
      <Navbar />
      
      <main className="flex-1 pt-16">
        <div className="container max-w-6xl mx-auto px-4 py-8">
          {children}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
