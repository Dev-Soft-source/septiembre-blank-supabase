import React from 'react';
import { AlertCircle, Clock, Users, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface LockState {
  isLocked: boolean;
  lockReason: string;
  lockedBy?: string;
  lockTimestamp?: Date;
}

interface LockStatusIndicatorProps {
  lockState: LockState;
  onRefresh?: () => void;
  className?: string;
}

export const LockStatusIndicator: React.FC<LockStatusIndicatorProps> = ({
  lockState,
  onRefresh,
  className = ''
}) => {
  if (!lockState.isLocked) {
    return (
      <Alert className={`border-green-200 bg-green-50 ${className}`}>
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Ready for editing - No locks detected
        </AlertDescription>
      </Alert>
    );
  }

  const getLockMessage = () => {
    switch (lockState.lockReason) {
      case 'hotel_under_review':
        return {
          title: 'Under Admin Review',
          description: 'This hotel is currently being reviewed by administrators. Editing is temporarily disabled to ensure data consistency.',
          icon: <Clock className="h-4 w-4 text-amber-600" />,
          variant: 'warning' as const
        };
      
      case 'concurrent_editing':
        return {
          title: 'Being Edited Elsewhere',
          description: 'This hotel is currently being edited in another tab or session. Please wait or close other editing sessions.',
          icon: <Users className="h-4 w-4 text-blue-600" />,
          variant: 'info' as const
        };
      
      default:
        return {
          title: 'Editing Restricted',
          description: 'This hotel cannot be edited at this time due to system restrictions.',
          icon: <AlertCircle className="h-4 w-4 text-red-600" />,
          variant: 'destructive' as const
        };
    }
  };

  const lockInfo = getLockMessage();
  const alertClasses = {
    warning: 'border-amber-200 bg-amber-50',
    info: 'border-blue-200 bg-blue-50',
    destructive: 'border-red-200 bg-red-50'
  };

  return (
    <Alert className={`${alertClasses[lockInfo.variant]} ${className}`}>
      {lockInfo.icon}
      <AlertDescription>
        <div className="space-y-2">
          <div className="font-medium">{lockInfo.title}</div>
          <div className="text-sm">{lockInfo.description}</div>
          
          {lockState.lockTimestamp && (
            <div className="text-xs opacity-75">
              Locked since: {lockState.lockTimestamp.toLocaleString()}
            </div>
          )}
          
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              className="mt-2"
            >
              Check Status
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};