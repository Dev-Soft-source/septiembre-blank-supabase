import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar, MapPin, Users, CreditCard, Home, Printer } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface BookingDetails {
  id: string;
  hotel_name: string;
  check_in: string;
  check_out: string;
  total_price: number;
  payment_status: string;
  status: string;
  package_duration: number;
  payment_timestamp: string;
}

export default function BookingSuccess() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setVerificationError('No payment session found');
      setLoading(false);
      return;
    }

    verifyPayment();
  }, [sessionId]);

  const verifyPayment = async () => {
    try {
      console.log('Verifying payment for session:', sessionId);

      // Call the verify-stripe-payment edge function
      const { data, error } = await supabase.functions.invoke('verify-stripe-payment', {
        body: { sessionId }
      });

      if (error) {
        throw new Error(error.message || 'Payment verification failed');
      }

      if (!data.success) {
        throw new Error(data.error || 'Payment was not successful');
      }

      const booking = data.booking;

      // Get hotel details
      const { data: hotelData, error: hotelError } = await supabase
        .from('hotels')
        .select('name')
        .eq('id', booking.hotel_id)
        .single();

      if (hotelError) {
        console.error('Failed to get hotel details:', hotelError);
      }

      // Get package details
      const { data: packageData, error: packageError } = await supabase
        .from('availability_packages_public_view')
        .select('duration_days')
        .eq('id', booking.package_id)
        .single();

      if (packageError) {
        console.error('Failed to get package details:', packageError);
      }

      setBookingDetails({
        id: booking.id,
        hotel_name: hotelData?.name || 'Hotel',
        check_in: booking.check_in,
        check_out: booking.check_out,
        total_price: booking.total_price,
        payment_status: booking.payment_status,
        status: booking.status,
        package_duration: packageData?.duration_days || 0,
        payment_timestamp: booking.payment_timestamp || booking.updated_at
      });

      toast({
        title: "Payment Successful!",
        description: "Your booking has been confirmed.",
        duration: 5000
      });

    } catch (error: any) {
      console.error('Payment verification error:', error);
      setVerificationError(error.message);
      
      toast({
        title: "Payment Verification Failed",
        description: error.message || 'Unable to verify your payment. Please contact support.',
        variant: "destructive",
        duration: 10000
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleBackHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
                <CreditCard className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Verifying Payment</h3>
              <p className="text-muted-foreground">Please wait while we confirm your booking...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (verificationError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Payment Verification Failed</h3>
              <p className="text-muted-foreground mb-4">{verificationError}</p>
              <Button onClick={handleBackHome} className="w-full">
                Return Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!bookingDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Booking Not Found</h3>
              <p className="text-muted-foreground mb-4">Unable to retrieve booking details.</p>
              <Button onClick={handleBackHome} className="w-full">
                Return Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <Card className="mb-6">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Booking Confirmed!</h1>
              <p className="text-muted-foreground">
                Your payment has been processed successfully and your reservation is confirmed.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Booking Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{bookingDetails.hotel_name}</p>
                    <p className="text-sm text-muted-foreground">Hotel</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {format(new Date(bookingDetails.check_in), 'MMM dd')} - {format(new Date(bookingDetails.check_out), 'MMM dd, yyyy')}
                    </p>
                    <p className="text-sm text-muted-foreground">{bookingDetails.package_duration} days</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Booking #{bookingDetails.id.slice(-8).toUpperCase()}</p>
                    <p className="text-sm text-muted-foreground">Confirmation Number</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">€{bookingDetails.total_price}</p>
                    <p className="text-sm text-muted-foreground">Total Amount Paid</p>
                  </div>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <p className="text-sm font-medium text-green-700 dark:text-green-400">
                    Payment Status: {bookingDetails.payment_status === 'completed' ? 'Confirmed' : bookingDetails.payment_status}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-500 mt-1">
                    Processed on {format(new Date(bookingDetails.payment_timestamp), 'MMM dd, yyyy \'at\' HH:mm')}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4 mt-6">
              <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Important Information</h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• A confirmation email will be sent to your registered email address</li>
                  <li>• Please arrive on your check-in date and present this confirmation</li>
                  <li>• Contact the hotel directly for any special requests or modifications</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={handleBackHome} variant="outline" className="flex-1">
            <Home className="w-4 h-4 mr-2" />
            Return Home
          </Button>
          <Button onClick={handlePrint} className="flex-1">
            <Printer className="w-4 h-4 mr-2" />
            Print Confirmation
          </Button>
        </div>
      </div>
    </div>
  );
}