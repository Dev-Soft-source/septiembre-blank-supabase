import { Link } from "react-router-dom";
import { Building } from "lucide-react";
import { Button } from "@/components/ui/button";
export const HotelRegistrationPrompt = () => {
  return <div className="min-h-screen flex flex-col">
      <div className="p-4 bg-background/80 backdrop-blur-md border-b border-border fixed w-full z-10">
        <div className="container flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-white">Hotel-Living</Link>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center pt-16">
        <div className="container max-w-xl p-6 text-center">
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="p-8 backdrop-blur-sm bg-[#68047c]">
              <Building className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h1 className="text-3xl font-bold mb-4">Hotel Partner Portal</h1>
              <p className="text-muted-foreground mb-8">
                List your hotel or property on Hotel-Living and connect with travelers looking for unique themed stays.
              </p>
              
              <div className="space-y-4">
                <Link to="/hotel-signup">
                  <Button className="w-full py-6 text-lg bg-[t#860493] bg-[#860493]">
                    Register as a Hotel Partner
                  </Button>
                </Link>
                
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link to="/unirse" className="text-primary hover:underline">
                    Sign in as Hotel Partner
                  </Link>
                </p>
              </div>
              
              <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-background/20 rounded-lg">
                  <h3 className="font-medium mb-2">List Your Property</h3>
                  <p className="text-xs text-muted-foreground">Create listings for your themed properties with photos and details</p>
                </div>
                
                <div className="p-4 bg-background/20 rounded-lg">
                  <h3 className="font-medium mb-2">Manage Bookings</h3>
                  <p className="text-xs text-muted-foreground">Handle reservations, check-ins and manage guest communications</p>
                </div>
                
                <div className="p-4 bg-background/20 rounded-lg">
                  <h3 className="font-medium mb-2">Analytics & Revenue</h3>
                  <p className="text-xs text-muted-foreground">Track performance, adjust pricing and grow your business</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default HotelRegistrationPrompt;