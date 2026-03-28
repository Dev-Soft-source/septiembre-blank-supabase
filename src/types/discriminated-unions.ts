// Advanced TypeScript patterns for better type safety and inference

// Generic discriminated union pattern for async operations
export type AsyncState<T, E = string> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: E };

// Form state with validation
export type FormState<T> =
  | { status: 'idle'; data: Partial<T> }
  | { status: 'validating'; data: Partial<T> }
  | { status: 'valid'; data: T }
  | { status: 'invalid'; data: Partial<T>; errors: Record<keyof T, string[]> };

// API response patterns
export type ApiResponse<T> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string; code?: string };

// Modal/Dialog state management
export type ModalState<T = void> =
  | { isOpen: false }
  | { isOpen: true; mode: 'create'; data?: undefined }
  | { isOpen: true; mode: 'edit'; data: T }
  | { isOpen: true; mode: 'view'; data: T };

// Search/Filter state
export type SearchState<T> =
  | { status: 'idle'; query: ''; results: [] }
  | { status: 'searching'; query: string; results: T[] }
  | { status: 'results'; query: string; results: T[]; count: number }
  | { status: 'no-results'; query: string; results: [] };

// Permission/Role state
export type PermissionState =
  | { granted: true; role: 'admin' | 'hotel_owner' | 'association' | 'user' }
  | { granted: false; reason: 'unauthorized' | 'insufficient_role' | 'session_expired' };

// Advanced utility types
export type StrictOmit<T, K extends keyof T> = Omit<T, K>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type NonNullableFields<T, K extends keyof T> = T & {
  [P in K]: NonNullable<T[P]>;
};

// Type guards for discriminated unions (generic versions)
export const isAsyncSuccess = <T, E = string>(state: AsyncState<T, E>): state is { status: 'success'; data: T } =>
  state.status === 'success';

export const isAsyncError = <T, E = string>(state: AsyncState<T, E>): state is { status: 'error'; error: E } =>
  state.status === 'error';

export const isAsyncLoading = <T, E = string>(state: AsyncState<T, E>): state is { status: 'loading' } =>
  state.status === 'loading';

export const isFormValid = <T>(state: FormState<T>): state is { status: 'valid'; data: T } =>
  state.status === 'valid';

export const isFormInvalid = <T>(state: FormState<T>): state is { 
  status: 'invalid'; 
  data: Partial<T>; 
  errors: Record<keyof T, string[]> 
} => state.status === 'invalid';

export const isModalOpen = <T>(state: ModalState<T>): state is 
  | { isOpen: true; mode: 'create'; data?: undefined }
  | { isOpen: true; mode: 'edit'; data: T }
  | { isOpen: true; mode: 'view'; data: T } =>
  state.isOpen === true;

export const hasSearchResults = <T>(state: SearchState<T>): state is { 
  status: 'results'; 
  query: string; 
  results: T[]; 
  count: number 
} => state.status === 'results';

export const isPermissionGranted = (state: PermissionState): state is { 
  granted: true; 
  role: 'admin' | 'hotel_owner' | 'association' | 'user' 
} => state.granted === true;