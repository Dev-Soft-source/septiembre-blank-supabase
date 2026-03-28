import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SplashScreen } from './SplashScreen';

interface SplashScreenWrapperProps {
  children: React.ReactNode;
}

export function SplashScreenWrapper({ children }: SplashScreenWrapperProps) {
  // Temporarily disabled splash screen across the entire portal
  return <>{children}</>;
}