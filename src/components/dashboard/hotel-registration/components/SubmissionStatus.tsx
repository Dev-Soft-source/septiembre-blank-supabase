import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, AlertCircle, CheckCircle2, Save } from 'lucide-react';

interface SubmissionStatusProps {
  submissionState: {
    isSubmitting: boolean;
    hasFailedSubmission: boolean;
    submissionComplete: boolean;
    retryCount: number;
  };
  failedSubmissionSummary: {
    hotelName: string;
    timestamp: string;
    attemptCount: number;
    imageCount: number;
    payloadSize: string;
  } | null;
  onRetry: () => Promise<void>;
  onClearFailed: () => void;
}

export function SubmissionStatus({ 
  submissionState, 
  failedSubmissionSummary, 
  onRetry, 
  onClearFailed 
}: SubmissionStatusProps) {
  
  if (submissionState.submissionComplete) {
    return (
      <Alert className="bg-green-500/10 border-green-500/20">
        <CheckCircle2 className="h-4 w-4 text-green-500" />
        <AlertDescription className="text-white">
          <strong>Registration Completed ✅</strong>
          <br />
          Your hotel registration has been successfully submitted and is under review. <strong style={{ color: '#00FF00' }}>Please, send now</strong> at least 5 photographs of your hotel and 5 of the rooms to contact@hotel-living.com. Without these photos, it will not be possible to publish your property. Please send them as soon as possible.
        </AlertDescription>
      </Alert>
    );
  }

  if (submissionState.hasFailedSubmission && failedSubmissionSummary) {
    return (
      <Alert className="bg-orange-500/10 border-orange-500/20">
        <AlertCircle className="h-4 w-4 text-orange-500" />
        <AlertDescription className="text-orange-200">
          <strong>We detected a problem sending your data.</strong>
          <br />
          Your information has been safely saved locally. Please retry.
          
          <div className="mt-3 p-3 bg-orange-500/5 rounded border border-orange-500/20">
            <div className="text-sm space-y-1">
              <div><strong>Hotel:</strong> {failedSubmissionSummary.hotelName}</div>
              <div><strong>Last Attempt:</strong> {failedSubmissionSummary.timestamp}</div>
              <div><strong>Attempts:</strong> {failedSubmissionSummary.attemptCount}</div>
              <div><strong>Images:</strong> {failedSubmissionSummary.imageCount}</div>
              <div><strong>Data Size:</strong> {failedSubmissionSummary.payloadSize}</div>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <Button
              onClick={onRetry}
              disabled={submissionState.isSubmitting}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              {submissionState.isSubmitting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Retrying...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry Submission
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={onClearFailed}
              disabled={submissionState.isSubmitting}
              className="border-orange-500/30 text-orange-200 hover:bg-orange-500/10"
            >
              <Save className="h-4 w-4 mr-2" />
              Clear Saved Data
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (submissionState.isSubmitting) {
    return (
      <Alert className="bg-blue-500/10 border-blue-500/20">
        <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
        <AlertDescription className="text-blue-200">
          <strong>Submitting Registration...</strong>
          <br />
          Please wait while we securely submit your hotel registration.
          {submissionState.retryCount > 0 && (
            <span className="block mt-1 text-sm">
              Retry attempt {submissionState.retryCount}
            </span>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}