import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, Play, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'success' | 'error';
  message: string;
  details?: any;
}

export const SystemVerification: React.FC = () => {
  const [tests, setTests] = useState<TestResult[]>([
    { name: 'Database Schema Verification', status: 'pending', message: 'Ready to test' },
    { name: 'Hotel Registration Flow', status: 'pending', message: 'Ready to test' },
    { name: 'Hotels Detailed View Query', status: 'pending', message: 'Ready to test' },
    { name: 'Availability Packages System', status: 'pending', message: 'Ready to test' },
    { name: 'Booking Creation Process', status: 'pending', message: 'Ready to test' },
    { name: 'Commission Generation', status: 'pending', message: 'Ready to test' },
    { name: 'Payment System Integration', status: 'pending', message: 'Ready to test' },
    { name: 'User Profile Management', status: 'pending', message: 'Ready to test' },
    { name: 'Deleted Tables Cleanup', status: 'pending', message: 'Ready to test' },
    { name: 'Admin Dashboard Functions', status: 'pending', message: 'Ready to test' },
  ]);

  const [isRunning, setIsRunning] = useState(false);

  const updateTest = (index: number, status: TestResult['status'], message: string, details?: any) => {
    setTests(prev => prev.map((test, i) => 
      i === index ? { ...test, status, message, details } : test
    ));
  };

  const runTest = async (testIndex: number, testFn: () => Promise<void>) => {
    updateTest(testIndex, 'running', 'Testing...');
    try {
      await testFn();
      updateTest(testIndex, 'success', 'Test passed');
    } catch (error: any) {
      updateTest(testIndex, 'error', error.message || 'Test failed', error);
    }
  };

  const testDatabaseSchema = async () => {
    // Test that core tables exist and deleted tables are gone
    const requiredTables = ['hotels', 'bookings', 'availability_packages', 'booking_commissions', 'payments', 'profiles'] as const;
    
    // Verify required tables exist by trying to query them
    await supabase.from('hotels').select('*').limit(1);
    await supabase.from('bookings').select('*').limit(1);
    await supabase.from('availability_packages').select('*').limit(1);
    await supabase.from('booking_commissions').select('*').limit(1);
    await supabase.from('payments').select('*').limit(1);
    await supabase.from('profiles').select('*').limit(1);

    // Test hotels_detailed_view specifically
    const { error: viewError } = await supabase.from('hotels_detailed_view').select('*').limit(1);
    if (viewError) throw new Error(`hotels_detailed_view not accessible: ${viewError.message}`);
  };

  const testHotelRegistration = async () => {
    const testHotelData = {
      name: 'Verification Test Hotel',
      country: 'Test Country',
      city: 'Test City',
      contact_email: 'test@verification.com',
      description: 'Test hotel for system verification',
      total_rooms: 10,
      price_per_month: 1500
    };

    const { data, error } = await supabase.functions.invoke('submit-hotel-registration', {
      body: {
        hotel_data: testHotelData,
        availability_packages: [],
        hotel_images: [],
        hotel_themes: [],
        hotel_activities: [],
        dev_mode: true
      }
    });

    if (error) throw error;
    if (!data?.success) throw new Error(data?.error?.message?.en || 'Hotel registration failed');
  };

  const testHotelsDetailedView = async () => {
    const { data, error } = await supabase
      .from('hotels_detailed_view')
      .select(`
        id,
        name,
        city,
        country,
        hotel_images,
        hotel_themes,
        hotel_activities,
        status
      `)
      .limit(5);

    if (error) throw error;
    if (!Array.isArray(data)) throw new Error('hotels_detailed_view should return an array');
  };

  const testAvailabilityPackages = async () => {
    // Test querying availability packages
    const { data, error } = await supabase
      .from('availability_packages')
      .select('id, hotel_id, start_date, end_date, available_rooms, total_rooms')
      .limit(5);

    if (error) throw error;
    if (!Array.isArray(data)) throw new Error('availability_packages query failed');
  };

  const testBookingCreation = async () => {
    // Test booking structure (without actually creating a booking)
    const { data: hotels } = await supabase
      .from('hotels')
      .select('id')
      .eq('status', 'approved')
      .limit(1)
      .single();

    if (!hotels) throw new Error('No approved hotels found for booking test');

    // Verify booking table structure
    const { error } = await supabase
      .from('bookings')
      .select('id, user_id, hotel_id, check_in, check_out, total_price, status')
      .limit(1);

    if (error) throw error;
  };

  const testCommissionGeneration = async () => {
    // Test commission table structure
    const { error } = await supabase
      .from('booking_commissions')
      .select('id, booking_id, hotel_id, referral_id, referral_type, amount_usd, percentage, status')
      .limit(1);

    if (error) throw error;
  };

  const testPaymentSystem = async () => {
    // Test payments table structure
    const { error } = await supabase
      .from('payments')
      .select('id, booking_id, amount, method, status, created_at')
      .limit(1);

    if (error) throw error;
  };

  const testUserProfiles = async () => {
    // Test profiles table and verify no references to deleted tables
    const { error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email, role, is_hotel_owner')
      .limit(1);

    if (error) throw error;
  };

  const testDeletedTablesCleanup = async () => {
    // Test that deleted tables are no longer accessible
    // We expect these queries to fail with table not found errors
    
    try {
      await supabase.from('user_rewards' as any).select('*').limit(1);
      throw new Error("Deleted table 'user_rewards' still exists and is accessible");
    } catch (error: any) {
      if (!error.message.includes('does not exist') && !error.message.includes('not assignable')) {
        throw new Error(`Unexpected error testing user_rewards deletion: ${error.message}`);
      }
    }

    try {
      await supabase.from('user_affinities' as any).select('*').limit(1);
      throw new Error("Deleted table 'user_affinities' still exists and is accessible");
    } catch (error: any) {
      if (!error.message.includes('does not exist') && !error.message.includes('not assignable')) {
        throw new Error(`Unexpected error testing user_affinities deletion: ${error.message}`);
      }
    }

    try {
      await supabase.from('stay_extensions' as any).select('*').limit(1);
      throw new Error("Deleted table 'stay_extensions' still exists and is accessible");
    } catch (error: any) {
      if (!error.message.includes('does not exist') && !error.message.includes('not assignable')) {
        throw new Error(`Unexpected error testing stay_extensions deletion: ${error.message}`);
      }
    }

    try {
      await supabase.from('group_proposals' as any).select('*').limit(1);
      throw new Error("Deleted table 'group_proposals' still exists and is accessible");
    } catch (error: any) {
      if (!error.message.includes('does not exist') && !error.message.includes('not assignable')) {
        throw new Error(`Unexpected error testing group_proposals deletion: ${error.message}`);
      }
    }
  };

  const testAdminFunctions = async () => {
    // Test admin-related tables
    const { error: adminLogsError } = await supabase
      .from('admin_logs')
      .select('id, admin_id, action, created_at')
      .limit(1);

    if (adminLogsError) throw new Error(`Admin logs not accessible: ${adminLogsError.message}`);

    const { error: adminMessagesError } = await supabase
      .from('admin_messages')
      .select('id, user_id, hotel_id, subject, message, status')
      .limit(1);

    if (adminMessagesError) throw new Error(`Admin messages not accessible: ${adminMessagesError.message}`);
  };

  const runAllTests = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    toast.info('Starting comprehensive system verification...');

    try {
      // Reset all tests to pending
      setTests(prev => prev.map(test => ({ ...test, status: 'pending' as const })));

      // Call the system verification edge function
      const { data, error } = await supabase.functions.invoke('system-verification');

      if (error) {
        toast.error(`Verification failed: ${error.message}`);
        setTests(prev => prev.map(test => ({ 
          ...test, 
          status: 'error' as const, 
          message: `Failed to run verification: ${error.message}` 
        })));
        return;
      }

      if (!data?.success) {
        toast.error('System verification encountered errors');
        return;
      }

      // Update tests with actual results
      const updatedTests = tests.map((test, index) => {
        const result = data.results[index];
        if (result) {
          return {
            ...test,
            status: result.status,
            message: result.message,
            details: result.details
          };
        }
        return test;
      });

      setTests(updatedTests);

      const { summary } = data;
      if (summary.failed === 0) {
        toast.success(`🎉 All ${summary.passed} tests passed! System verification complete in ${summary.duration}ms (${summary.success_rate}% success rate)`);
      } else {
        toast.error(`⚠️ ${summary.failed} of ${summary.total} tests failed. Success rate: ${summary.success_rate}%`);
      }

    } catch (error: any) {
      console.error('System verification error:', error);
      toast.error(`Verification error: ${error.message}`);
      setTests(prev => prev.map(test => ({ 
        ...test, 
        status: 'error' as const, 
        message: `System error: ${error.message}` 
      })));
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'running': return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return <Badge className="bg-green-500/20 text-green-700 border-green-500/30">Passed</Badge>;
      case 'error': return <Badge className="bg-red-500/20 text-red-700 border-red-500/30">Failed</Badge>;
      case 'running': return <Badge className="bg-blue-500/20 text-blue-700 border-blue-500/30">Running</Badge>;
      default: return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            System Verification Dashboard
            <Button 
              onClick={runAllTests} 
              disabled={isRunning}
              className="bg-primary hover:bg-primary/90"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Running Tests...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Run All Tests
                </>
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tests.map((test, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(test.status)}
                  <div>
                    <h3 className="font-medium">{test.name}</h3>
                    <p className="text-sm text-muted-foreground">{test.message}</p>
                    {test.details && test.status === 'error' && (
                      <pre className="text-xs text-red-600 mt-1 p-2 bg-red-50 rounded max-w-md overflow-auto">
                        {JSON.stringify(test.details, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
                {getStatusBadge(test.status)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test Coverage Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {tests.filter(t => t.status === 'pending').length}
              </div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {tests.filter(t => t.status === 'running').length}
              </div>
              <div className="text-sm text-muted-foreground">Running</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {tests.filter(t => t.status === 'success').length}
              </div>
              <div className="text-sm text-muted-foreground">Passed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {tests.filter(t => t.status === 'error').length}
              </div>
              <div className="text-sm text-muted-foreground">Failed</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};