import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, Home, RotateCcw } from 'lucide-react';

export default function BookingFailed() {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate('/');
  };

  const handleTryAgain = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center py-8 px-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-destructive" />
            </div>
            
            <h1 className="text-2xl font-bold mb-3">Payment Cancelled</h1>
            <p className="text-muted-foreground mb-6">
              Your payment was cancelled or failed to process. No charges have been made to your card.
            </p>

            <div className="bg-yellow-50 dark:bg-yellow-950/20 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Your booking was not completed. The rooms remain available for booking.
              </p>
            </div>

            <div className="space-y-3">
              <Button onClick={handleTryAgain} className="w-full">
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Booking Again
              </Button>
              
              <Button onClick={handleBackHome} variant="outline" className="w-full">
                <Home className="w-4 h-4 mr-2" />
                Return Home
              </Button>
            </div>

            <div className="mt-6 pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                Need help? Contact our customer service team for assistance with your booking.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}