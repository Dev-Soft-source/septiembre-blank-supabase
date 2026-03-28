import React from 'react';
import { SplashScreen } from '@/components/SplashScreen';
import { useNavigate } from 'react-router-dom';

export default function SplashPage() {
  const navigate = useNavigate();

  const handleSplashComplete = () => {
    // Default navigation to home page
    navigate('/');
  };

  return (
    <div className="min-h-screen">
      <SplashScreen onComplete={handleSplashComplete} />
    </div>
  );
}