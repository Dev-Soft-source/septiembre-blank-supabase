
export interface StepValidationState {
  [key: number]: boolean;
}

// Export common interfaces
export interface ToastOptions {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
}
