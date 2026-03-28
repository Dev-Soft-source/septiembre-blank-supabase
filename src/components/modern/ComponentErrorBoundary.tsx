import React, { Component, ReactNode, ErrorInfo } from 'react';

interface ComponentErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  retryCount: number;
}

interface ComponentErrorBoundaryProps {
  children: ReactNode;
  componentName?: string;
  maxRetries?: number;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export class ComponentErrorBoundary extends Component<ComponentErrorBoundaryProps, ComponentErrorBoundaryState> {
  private retryTimeouts: NodeJS.Timeout[] = [];

  constructor(props: ComponentErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false, 
      retryCount: 0 
    };
  }

  static getDerivedStateFromError(error: Error): ComponentErrorBoundaryState {
    return { 
      hasError: true, 
      error,
      retryCount: 0
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { componentName = 'Component', onError } = this.props;
    
    console.error(`Component Error Boundary (${componentName}):`, error, errorInfo);

    if (onError) {
      onError(error, errorInfo);
    }
  }

  componentWillUnmount() {
    // Clear any pending retry timeouts
    this.retryTimeouts.forEach(timeout => clearTimeout(timeout));
  }

  private handleRetry = () => {
    this.setState(prev => ({ 
      hasError: false, 
      error: undefined,
      retryCount: prev.retryCount + 1 
    }));
  };

  private handleAutoRetry = () => {
    // Auto-retry after 2 seconds
    const timeout = setTimeout(() => {
      this.setState(prev => ({ 
        hasError: false, 
        error: undefined,
        retryCount: prev.retryCount + 1 
      }));
    }, 2000);
    
    this.retryTimeouts.push(timeout);
  };

  render() {
    if (this.state.hasError) {
      const { 
        fallback, 
        componentName = 'Component'
      } = this.props;
      
      if (fallback) {
        return fallback;
      }

      const canRetry = true; // Always allow retry

      return (
        <div className="p-4 border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-700 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                {componentName} Error
              </h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>This component failed to render properly.</p>
                {this.state.retryCount > 0 && (
                  <p className="mt-1">
                    Retry attempts: {this.state.retryCount}
                  </p>
                )}
              </div>
              
              {canRetry && (
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={this.handleRetry}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Retry Now
                  </button>
                  <button
                    onClick={this.handleAutoRetry}
                    className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm transition-colors"
                  >
                    Auto-retry in 2s
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}