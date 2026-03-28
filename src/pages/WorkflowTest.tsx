import React from 'react';
import { EndToEndWorkflowTest } from '@/components/testing/EndToEndWorkflowTest';

export default function WorkflowTest() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Hotel-Living System Test
          </h1>
          <p className="text-white/80 text-lg">
            Complete end-to-end workflow validation
          </p>
        </div>
        
        <EndToEndWorkflowTest />
        
        <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
          <h2 className="text-xl font-semibold mb-4">Test Coverage:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div>
              <h3 className="font-semibold text-blue-300">Hotel Registration</h3>
              <ul className="mt-2 space-y-1 text-white/80">
                <li>✓ 16-section property form</li>
                <li>✓ Hotel data validation</li>
                <li>✓ Database insertion</li>
                <li>✓ Admin panel display</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-green-300">Availability System</h3>
              <ul className="mt-2 space-y-1 text-white/80">
                <li>✓ Package creation (8,15,22,29 days)</li>
                <li>✓ Public hotel page display</li>
                <li>✓ Booking availability reduction</li>
                <li>✓ Cancellation restoration</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-yellow-300">Commission System</h3>
              <ul className="mt-2 space-y-1 text-white/80">
                <li>✓ Automatic calculation</li>
                <li>✓ Hotel Living 15%</li>
                <li>✓ Association 4%</li>
                <li>✓ Promoter 2%</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-purple-300">Booking Flow</h3>
              <ul className="mt-2 space-y-1 text-white/80">
                <li>✓ User reservation</li>
                <li>✓ Hotel notification</li>
                <li>✓ Admin notification</li>
                <li>✓ Payment processing</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-red-300">Admin Panel</h3>
              <ul className="mt-2 space-y-1 text-white/80">
                <li>✓ Hotel approval workflow</li>
                <li>✓ Booking management</li>
                <li>✓ Commission tracking</li>
                <li>✓ System monitoring</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-indigo-300">Data Integrity</h3>
              <ul className="mt-2 space-y-1 text-white/80">
                <li>✓ Supabase logs</li>
                <li>✓ Edge function logs</li>
                <li>✓ Database consistency</li>
                <li>✓ Error handling</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}