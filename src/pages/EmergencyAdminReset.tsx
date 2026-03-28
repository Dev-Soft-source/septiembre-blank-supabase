import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, Shield, Mail } from "lucide-react";
import { ErrorBoundary } from "@/components/modern/ErrorBoundary";

export default function EmergencyAdminReset() {
  // Add console log to track component mounting
  useEffect(() => {
    console.log("EmergencyAdminReset component mounted successfully");
  }, []);
  const [adminEmail, setAdminEmail] = useState("grand_soiree@yahoo.com");
  const [emergencyKey, setEmergencyKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleEmergencyReset = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Emergency reset form submitted");
    setIsLoading(true);
    setMessage("");

    try {
      console.log("Invoking emergency-admin-reset function with:", { adminEmail, emergencyKey });
      
      const { data, error } = await supabase.functions.invoke('emergency-admin-reset', {
        body: {
          adminEmail,
          emergencyKey,
          language: 'en'
        }
      });

      console.log("Function response:", { data, error });

      if (error) {
        console.error("Function error:", error);
        setMessage(error.message || "Failed to send emergency reset email");
        setIsSuccess(false);
      } else {
        console.log("Function success:", data);
        setMessage("Emergency password reset email sent successfully! Check your inbox.");
        setIsSuccess(true);
        setEmergencyKey(""); // Clear the key for security
      }
    } catch (err: any) {
      console.error("Unexpected error:", err);
      setMessage(err.message || "An unexpected error occurred");
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ErrorBoundary identifier="EmergencyAdminReset">
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-orange-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/95 backdrop-blur border-red-200">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-800 flex items-center justify-center gap-2">
            <Shield className="w-6 h-6" />
            Emergency Admin Reset
          </CardTitle>
          <p className="text-sm text-red-600">
            Use this tool only in case of emergency when admin access is lost
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Alert className="border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>Security Notice:</strong> This action is logged for security audit purposes.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleEmergencyReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="adminEmail" className="text-sm font-medium">
                Admin Email Address
              </Label>
              <Input
                id="adminEmail"
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@hotel-living.com"
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyKey" className="text-sm font-medium">
                Emergency Access Key
              </Label>
              <Input
                id="emergencyKey"
                type="password"
                value={emergencyKey}
                onChange={(e) => setEmergencyKey(e.target.value)}
                placeholder="Enter emergency key"
                required
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Contact system administrator for emergency key
              </p>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !adminEmail || !emergencyKey}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoading ? (
                "Sending Reset Email..."
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Send Emergency Reset
                </>
              )}
            </Button>
          </form>

          {message && (
            <Alert className={isSuccess ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              <AlertDescription className={isSuccess ? "text-green-800" : "text-red-800"}>
                {message}
              </AlertDescription>
            </Alert>
          )}

          <div className="text-center space-y-2">
            <p className="text-xs text-gray-500">
              Emergency Key: HOTEL_LIVING_EMERGENCY_2024
            </p>
            <p className="text-xs text-gray-400">
              For production, this key should be kept secure and not displayed
            </p>
          </div>
        </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
}