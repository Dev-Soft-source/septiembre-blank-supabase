import React from 'react';
import IntegrityTestRunner from '@/components/admin/IntegrityTestRunner';

const IntegrityTestsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-purple-800">
      <IntegrityTestRunner />
    </div>
  );
};

export default IntegrityTestsPage;