
// @ts-nocheck
// TypeScript checking disabled for Supabase schema compatibility
import React, { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle } from "lucide-react";

interface GuestBlacklistCheckProps {
  guestId: string;
  guestEmail?: string;
}

interface ReportSummary {
  count: number;
  reasons: string[];
  lastIncident: string;
}

export const GuestBlacklistCheck: React.FC<GuestBlacklistCheckProps> = ({
  guestId,
  guestEmail
}) => {
  const [reportSummary, setReportSummary] = useState<ReportSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkGuestReports = async () => {
      try {
        const { data, error } = await supabase
          .from('user_reports')
          .select('reason, created_at')
          .eq('reported_user_id', guestId)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          const reasons = [...new Set(data.flatMap(report => 
            report.reason.split(", ").map(r => r.trim())
          ))];
          
          setReportSummary({
            count: data.length,
            reasons: reasons.slice(0, 3), // Show top 3 reasons
            lastIncident: data[0].created_at
          });
        }
      } catch (error) {
        console.error("Error checking guest reports:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (guestId) {
      checkGuestReports();
    }
  }, [guestId]);

  if (isLoading || !reportSummary) {
    return null;
  }

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        <strong>Guest Alert:</strong> This guest has {reportSummary.count} previous report(s).
        <br />
        Common issues: {reportSummary.reasons.join(", ")}
        <br />
        Last incident: {new Date(reportSummary.lastIncident).toLocaleDateString()}
      </AlertDescription>
    </Alert>
  );
};
