import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar, Users, MapPin, CreditCard, Home } from 'lucide-react';
import { format } from 'date-fns';
import { useTranslation } from '@/hooks/useTranslation';
import { useNavigate } from 'react-router-dom';

interface BookingConfirmationPageProps {
  bookingData: {
    bookingId: string;
    hotelName: string;
    checkIn: string;
    checkOut: string;
    duration: number;
    roomsReserved: number;
    roomUsageType: 'single' | 'double';
    totalPrice: number;
    guestName: string;
    guestEmail: string;
  };
}

export function BookingConfirmationPage({ bookingData }: BookingConfirmationPageProps) {
  const { t } = useTranslation('booking');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-white shadow-2xl">
        <div className="p-8 text-center space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="bg-green-100 rounded-full p-3">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>

          {/* Success Message */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {t('bookingConfirmed')}
            </h1>
            <p className="text-gray-600">
              Your reservation has been successfully created!
            </p>
          </div>

          {/* Booking Details */}
          <div className="bg-gray-50 rounded-lg p-6 space-y-4 text-left">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-medium">{bookingData.hotelName}</p>
                <p className="text-sm text-gray-600">Booking ID: {bookingData.bookingId}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-medium">
                  {format(new Date(bookingData.checkIn), 'MMM dd')} - {format(new Date(bookingData.checkOut), 'MMM dd, yyyy')}
                </p>
                <p className="text-sm text-gray-600">{bookingData.duration} days</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-medium">
                  {bookingData.roomsReserved} room(s) - {bookingData.roomUsageType === 'double' ? 'Double occupancy' : 'Single occupancy'}
                </p>
                <p className="text-sm text-gray-600">
                  {bookingData.roomUsageType === 'double' ? '2 guests per room' : '1 guest per room'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-medium">€{bookingData.totalPrice}</p>
                <p className="text-sm text-gray-600">Total amount</p>
              </div>
            </div>
          </div>

          {/* Payment Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Payment Information:</strong> Payment will be required on arrival or via Hotel Living once the payment gateway is activated.
            </p>
          </div>

          {/* Guest Information */}
          <div className="text-left space-y-2">
            <h3 className="font-medium text-gray-900">Guest Information</h3>
            <p className="text-sm text-gray-600">Name: {bookingData.guestName}</p>
            <p className="text-sm text-gray-600">Email: {bookingData.guestEmail}</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/')} 
              className="w-full"
            >
              <Home className="w-4 h-4 mr-2" />
              Return to Home
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.print()} 
              className="w-full"
            >
              Print Confirmation
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}