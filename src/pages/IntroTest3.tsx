
import React from 'react';
import { IntroStarAnimation } from '@/components/intro';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function IntroTest3() {
  const [showIntro, setShowIntro] = React.useState(true);
  const navigate = useNavigate();

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  const restartIntro = () => {
    setShowIntro(false);
    setTimeout(() => setShowIntro(true), 100);
  };

  return (
    <div className="min-h-screen bg-[#68178D] flex flex-col items-center justify-center">
      {showIntro ? (
        <IntroStarAnimation onComplete={handleIntroComplete} />
      ) : (
        <div className="text-center space-y-6">
          <h1 className="text-white text-2xl font-bold">Intro Animation Test</h1>
          <div className="space-x-4">
            <Button onClick={restartIntro} className="bg-purple-600 hover:bg-purple-700">
              Watch Again
            </Button>
            <Button onClick={() => navigate('/')} variant="outline">
              Back to Home
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
