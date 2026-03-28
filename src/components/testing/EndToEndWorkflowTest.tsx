import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Clock, Play, AlertCircle } from 'lucide-react';

interface TestResult {
  step: string;
  status: 'pending' | 'running' | 'success' | 'error';
  details: string;
  data?: any;
}

export function EndToEndWorkflowTest() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [currentStep, setCurrentStep] = useState<string>('');
  const { toast } = useToast();

  const addResult = (step: string, status: TestResult['status'], details: string, data?: any) => {
    setResults(prev => [...prev.filter(r => r.step !== step), { step, status, details, data }]);
  };

  const updateResult = (step: string, status: TestResult['status'], details: string, data?: any) => {
    setResults(prev => prev.map(r => r.step === step ? { ...r, status, details, data } : r));
  };

  const testWorkflow = async () => {
    setIsRunning(true);
    setResults([]);
    
    try {
      // Step 1: Hotel Registration
      setCurrentStep('Hotel Registration');
      addResult('Hotel Registration', 'running', 'Creating test hotel "Prioridad 1"...');
      
      const testData = {
        hotel_data: {
          name: "Prioridad 1",
          total_rooms: 25,
          description: "Hotel de prueba para validación completa del sistema Hotel-Living",
          country: "España",
          city: "Madrid",
          address: "Calle de Prueba 123",
          postal_code: "28001",
          contact_name: "Manager Test", 
          contact_email: "prioridad1@test-hotel.com",
          contact_phone: "+34 123 456 789",
          property_type: "hotel",
          style: "modern",
          category: 4,
          ideal_guests: "Viajeros que buscan comodidad y ubicación central",
          atmosphere: "Ambiente moderno y acogedor",
          perfect_location: "Ubicación perfecta para explorar el centro de Madrid",
          room_description: "Habitaciones modernas con todas las comodidades",
          weekly_laundry_included: true,
          external_laundry_available: false,
          main_image_url: "https://example.com/prioridad1-main.jpg",
          price_per_month: 2500,
          terms: "Términos de prueba aceptados",
          check_in_weekday: "Monday",
          stay_lengths: [8, 15, 22, 29],
          meals_offered: ["room_only", "breakfast", "half_board"],
          available_months: ["10", "11", "12", "01", "02", "03"]
        },
        availability_packages: [
          {
            start_date: "2024-10-01",
            end_date: "2024-10-08", 
            duration_days: 8,
            total_rooms: 5,
            available_rooms: 5,
            base_price_usd: 800,
            current_price_usd: 800
          },
          {
            start_date: "2024-11-01",
            end_date: "2024-11-15",
            duration_days: 15,
            total_rooms: 5,
            available_rooms: 5,
            base_price_usd: 1400,
            current_price_usd: 1400
          },
          {
            start_date: "2024-12-01", 
            end_date: "2024-12-22",
            duration_days: 22,
            total_rooms: 5,
            available_rooms: 5,
            base_price_usd: 2000,
            current_price_usd: 2000
          },
          {
            start_date: "2025-01-01",
            end_date: "2025-01-29",
            duration_days: 29,
            total_rooms: 5,
            available_rooms: 5,
            base_price_usd: 2600,
            current_price_usd: 2600
          }
        ],
        hotel_images: [],
        hotel_themes: ["13b4974d-f6c5-4faf-a35f-d1ddce748714"],
        hotel_activities: ["ac49156f-baa1-403c-a31a-7081d8b6a577", "338dd4c9-7bbd-4e9c-942a-e2c165a56cdf"],
        dev_mode: true
      };

      const { data: registrationResult, error: registrationError } = await supabase.functions.invoke('submit-hotel-registration', {
        body: testData
      });

      if (registrationError) {
        throw new Error(`Registration failed: ${registrationError.message}`);
      }

      if (!registrationResult?.success) {
        throw new Error(`Registration failed: ${registrationResult?.error?.message || 'Unknown error'}`);
      }

      const hotelId = registrationResult.hotel_id;
      updateResult('Hotel Registration', 'success', `Hotel created successfully with ID: ${hotelId}`, { hotelId });

      // Step 2: Verify Hotel in Admin Panel
      setCurrentStep('Admin Panel Verification');
      addResult('Admin Panel Verification', 'running', 'Checking if hotel appears in admin panel...');
      
      const { data: adminHotels, error: adminError } = await supabase
        .from('hotels')
        .select('*')
        .eq('id', hotelId);

      if (adminError) {
        throw new Error(`Admin verification failed: ${adminError.message}`);
      }

      if (!adminHotels || adminHotels.length === 0) {
        throw new Error('Hotel not found in admin panel');
      }

      const hotel = adminHotels[0];
      updateResult('Admin Panel Verification', 'success', `Hotel found in admin panel with status: ${hotel.status}`, { hotel });

      // Step 3: Verify Availability Packages
      setCurrentStep('Availability Packages Verification');
      addResult('Availability Packages Verification', 'running', 'Checking availability packages...');

      const { data: packages, error: packagesError } = await supabase
        .from('availability_packages')
        .select('*')
        .eq('hotel_id', hotelId);

      if (packagesError) {
        throw new Error(`Packages verification failed: ${packagesError.message}`);
      }

      updateResult('Availability Packages Verification', 'success', `${packages?.length || 0} packages created successfully`, { packages });

      // Step 4: Admin Approval Simulation
      setCurrentStep('Admin Approval');
      addResult('Admin Approval', 'running', 'Simulating admin approval...');

      const { error: approvalError } = await supabase
        .from('hotels')
        .update({ status: 'approved' })
        .eq('id', hotelId);

      if (approvalError) {
        throw new Error(`Approval failed: ${approvalError.message}`);
      }

      updateResult('Admin Approval', 'success', 'Hotel approved successfully');

      // Step 5: Test Booking Simulation  
      setCurrentStep('Booking Simulation');
      addResult('Booking Simulation', 'running', 'Simulating user booking...');

      if (!packages || packages.length === 0) {
        throw new Error('No packages available for booking');
      }

      const testPackage = packages[0];
      
      // Create test booking
      const { data: bookingResult, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          user_id: '00000000-0000-0000-0000-000000000001', // Test user ID
          hotel_id: hotelId,
          package_id: testPackage.id,
          check_in: testPackage.start_date,
          check_out: testPackage.end_date,
          total_price: testPackage.base_price_usd,
          guest_count: 2,
          status: 'confirmed',
          payment_status: 'paid'
        })
        .select();

      if (bookingError) {
        updateResult('Booking Simulation', 'error', `Booking failed: ${bookingError.message}`);
      } else {
        updateResult('Booking Simulation', 'success', `Booking created successfully`, { booking: bookingResult?.[0] });

        // Step 6: Verify Availability Reduction
        setCurrentStep('Availability Verification');
        addResult('Availability Verification', 'running', 'Checking if availability was reduced...');

        const { data: updatedPackage, error: availError } = await supabase
          .from('availability_packages')
          .select('*')
          .eq('id', testPackage.id)
          .single();

        if (availError) {
          updateResult('Availability Verification', 'error', `Availability check failed: ${availError.message}`);
        } else {
          const roomsReduced = testPackage.available_rooms - updatedPackage.available_rooms;
          updateResult('Availability Verification', 'success', `Availability reduced by ${roomsReduced} rooms`, { 
            before: testPackage.available_rooms, 
            after: updatedPackage.available_rooms 
          });
        }
      }

      // Step 7: Commission Verification
      setCurrentStep('Commission Verification');
      addResult('Commission Verification', 'running', 'Checking commission calculations...');

      const { data: commissions, error: commissionError } = await supabase
        .from('booking_commissions')
        .select('*')
        .eq('booking_id', bookingResult?.[0]?.id);

      if (commissionError) {
        updateResult('Commission Verification', 'error', `Commission check failed: ${commissionError.message}`);
      } else if (commissions && commissions.length > 0) {
        updateResult('Commission Verification', 'success', `Commission created: ${commissions[0].percentage}%`, { commissions });
      } else {
        updateResult('Commission Verification', 'success', 'No commission created (expected for test booking)');
      }

      toast({
        title: "✅ Workflow Test Completed",
        description: "End-to-end test completed successfully!",
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      updateResult(currentStep, 'error', errorMessage);
      
      toast({
        title: "❌ Test Failed", 
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
      setCurrentStep('');
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'running': return <Clock className="w-5 h-5 text-blue-500 animate-spin" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="w-6 h-6" />
          Hotel-Living End-to-End Workflow Test
        </CardTitle>
        <CardDescription>
          Complete validation of hotel registration, packages, booking, and commission workflow using test hotel "Prioridad 1"
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testWorkflow} 
          disabled={isRunning}
          className="w-full"
        >
          {isRunning ? 'Running Test...' : 'Start End-to-End Test'}
        </Button>

        {results.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Test Results:</h3>
            {results.map((result, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                {getStatusIcon(result.status)}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{result.step}</span>
                    <Badge variant={
                      result.status === 'success' ? 'default' :
                      result.status === 'error' ? 'destructive' :
                      result.status === 'running' ? 'secondary' : 'outline'
                    }>
                      {result.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{result.details}</p>
                  {result.data && (
                    <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}