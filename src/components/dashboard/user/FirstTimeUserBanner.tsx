
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Home, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const FirstTimeUserBanner: React.FC = () => {
  const navigate = useNavigate();

  const handleHowItWorks = () => {
    // Navigate to how it works or info page
    navigate('/how-it-works');
  };

  return (
    <Card className="bg-gradient-to-r from-purple-50 to-fuchsia-50 dark:from-purple-950/30 dark:to-fuchsia-950/30 border-purple-200 dark:border-purple-800/50 p-6 mb-6" style={{boxShadow: '0px 0px 18px 3px rgba(0, 174, 255, 0.7)'}}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-full">
            <Home className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200 flex items-center gap-2">
              <span>🏠</span>
              Welcome to your first experience!
            </h3>
            <p className="text-purple-700 dark:text-purple-300 mt-1">
              Follow the guided steps and enjoy your themed stay.
            </p>
          </div>
        </div>
        <Button 
          onClick={handleHowItWorks}
          variant="outline"
          className="border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50"
        >
          How it works
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </Card>
  );
};
