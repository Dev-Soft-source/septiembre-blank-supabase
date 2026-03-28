import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface LockState {
  isLocked: boolean;
  lockReason: string;
  lockedBy?: string;
  lockTimestamp?: Date;
}

interface RegistrationLockOptions {
  hotelId?: string;
  lockTimeout?: number; // in milliseconds
  checkInterval?: number; // in milliseconds
}

export function useRegistrationLock(options: RegistrationLockOptions = {}) {
  const { hotelId, lockTimeout = 300000, checkInterval = 5000 } = options; // 5 min timeout, 5 sec check
  const [lockState, setLockState] = useState<LockState>({
    isLocked: false,
    lockReason: '',
  });
  const [isSubmissionInProgress, setIsSubmissionInProgress] = useState(false);
  const lockIntervalRef = useRef<NodeJS.Timeout>();
  const sessionId = useRef(crypto.randomUUID());

  // Check if hotel is pending admin review
  const checkAdminReviewLock = async (): Promise<LockState | null> => {
    if (!hotelId) return null;
    
    try {
      const { data: hotel } = await supabase
        .from('hotels')
        .select('status')
        .eq('id', hotelId)
        .single();

      if (hotel?.status === 'pending') {
        return {
          isLocked: true,
          lockReason: 'hotel_under_review',
          lockedBy: 'admin_review',
          lockTimestamp: new Date()
        };
      }
    } catch (error) {
      console.error('Error checking admin review lock:', error);
    }
    
    return null;
  };

  // Check for concurrent editing locks
  const checkConcurrentEditingLock = (): LockState | null => {
    if (!hotelId) return null;
    
    const lockKey = `hotel_edit_lock_${hotelId}`;
    const stored = localStorage.getItem(lockKey);
    
    if (stored) {
      try {
        const lockData = JSON.parse(stored);
        const lockAge = Date.now() - new Date(lockData.timestamp).getTime();
        
        // Different session and within timeout period
        if (lockData.sessionId !== sessionId.current && lockAge < lockTimeout) {
          return {
            isLocked: true,
            lockReason: 'concurrent_editing',
            lockedBy: lockData.sessionId,
            lockTimestamp: new Date(lockData.timestamp)
          };
        }
      } catch (error) {
        console.error('Error parsing lock data:', error);
      }
    }
    
    return null;
  };

  // Acquire editing lock
  const acquireEditingLock = () => {
    if (!hotelId) return;
    
    const lockKey = `hotel_edit_lock_${hotelId}`;
    const lockData = {
      sessionId: sessionId.current,
      timestamp: new Date().toISOString(),
      hotelId
    };
    
    localStorage.setItem(lockKey, JSON.stringify(lockData));
  };

  // Release editing lock
  const releaseEditingLock = () => {
    if (!hotelId) return;
    
    const lockKey = `hotel_edit_lock_${hotelId}`;
    const stored = localStorage.getItem(lockKey);
    
    if (stored) {
      try {
        const lockData = JSON.parse(stored);
        // Only release if we own the lock
        if (lockData.sessionId === sessionId.current) {
          localStorage.removeItem(lockKey);
        }
      } catch (error) {
        console.error('Error releasing lock:', error);
      }
    }
  };

  // Check all lock conditions
  const checkAllLocks = async () => {
    const adminLock = await checkAdminReviewLock();
    if (adminLock) {
      setLockState(adminLock);
      return;
    }

    const editingLock = checkConcurrentEditingLock();
    if (editingLock) {
      setLockState(editingLock);
      return;
    }

    // No locks active
    setLockState({
      isLocked: false,
      lockReason: '',
    });
  };

  // Submission lock to prevent race conditions
  const acquireSubmissionLock = () => {
    if (isSubmissionInProgress) {
      return false; // Already locked
    }
    setIsSubmissionInProgress(true);
    return true;
  };

  const releaseSubmissionLock = () => {
    setIsSubmissionInProgress(false);
  };

  // Initialize locks and monitoring
  useEffect(() => {
    if (hotelId) {
      acquireEditingLock();
      checkAllLocks();
      
      // Start monitoring interval
      lockIntervalRef.current = setInterval(checkAllLocks, checkInterval);
    }

    return () => {
      if (lockIntervalRef.current) {
        clearInterval(lockIntervalRef.current);
      }
      releaseEditingLock();
    };
  }, [hotelId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      releaseEditingLock();
      if (lockIntervalRef.current) {
        clearInterval(lockIntervalRef.current);
      }
    };
  }, []);

  // Force refresh lock status
  const refreshLockStatus = () => {
    checkAllLocks();
  };

  return {
    lockState,
    isSubmissionInProgress,
    acquireSubmissionLock,
    releaseSubmissionLock,
    refreshLockStatus,
    acquireEditingLock,
    releaseEditingLock
  };
}