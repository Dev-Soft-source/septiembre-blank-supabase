/**
 * Error Boundary Component with Localization Support
 */

import React, { Component, ReactNode, ErrorInfo } from 'react';
import { logger } from '../logging/logger';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  identifier?: string;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorId?: string;
}

// Localized error messages
const errorMessages = {
  en: {
    title: 'Something went wrong',
    description: 'We apologize, but an unexpected error has occurred. Please try refreshing the page or contact support if the problem persists.',
    retry: 'Try Again',
    refresh: 'Refresh Page',
    reportIssue: 'Report Issue'
  },
  es: {
    title: 'Algo salió mal',
    description: 'Nos disculpamos, pero ha ocurrido un error inesperado. Intenta actualizar la página o contacta con soporte si el problema persiste.',
    retry: 'Intentar de nuevo',
    refresh: 'Actualizar página',
    reportIssue: 'Reportar problema'
  },
  pt: {
    title: 'Algo deu errado',
    description: 'Pedimos desculpas, mas ocorreu um erro inesperado. Tente atualizar a página ou entre em contato com o suporte se o problema persistir.',
    retry: 'Tentar novamente',
    refresh: 'Atualizar página',
    reportIssue: 'Reportar problema'
  },
  ro: {
    title: 'Ceva nu a mers bine',
    description: 'Ne cerem scuze, dar a apărut o eroare neașteptată. Încercați să actualizați pagina sau contactați suportul dacă problema persistă.',
    retry: 'Încearcă din nou',
    refresh: 'Actualizează pagina',
    reportIssue: 'Raportează problema'
  }
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Generate unique error ID
    const errorId = `err-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return { 
      hasError: true, 
      error,
      errorId 
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error with structured logging
    logger.error('Component error boundary triggered', error, {
      component: this.props.identifier || 'UnknownComponent',
      errorId: this.state.errorId,
      errorBoundary: true,
      componentStack: errorInfo.componentStack,
      // Don't log PII - the logger will redact automatically
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      try {
        this.props.onError(error, errorInfo);
      } catch (handlerError) {
        logger.error('Error in custom error handler', handlerError as Error);
      }
    }
  }

  private getLanguage(): string {
    if (typeof navigator !== 'undefined') {
      return navigator.language?.split('-')[0] || 'en';
    }
    return 'en';
  }

  private getLocalizedMessages() {
    const lang = this.getLanguage();
    return errorMessages[lang as keyof typeof errorMessages] || errorMessages.en;
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorId: undefined });
  };

  private handleRefresh = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  private handleReportIssue = () => {
    // In production, this could open a support ticket or feedback form
    const messages = this.getLocalizedMessages();
    const errorDetails = {
      errorId: this.state.errorId,
      component: this.props.identifier,
      message: this.state.error?.message,
      timestamp: new Date().toISOString()
    };
    
    console.log('Error report:', errorDetails);
    alert(`${messages.reportIssue}: ${this.state.errorId}`);
  };

  render() {
    if (this.state.hasError) {
      // Return custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const messages = this.getLocalizedMessages();

      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center space-y-6">
            {/* Error Icon */}
            <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
              <svg 
                className="w-8 h-8 text-destructive" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
                />
              </svg>
            </div>

            {/* Error Content */}
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">
                {messages.title}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {messages.description}
              </p>
            </div>

            {/* Error Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                {messages.retry}
              </button>
              <button
                onClick={this.handleRefresh}
                className="px-4 py-2 border border-border text-foreground rounded-md hover:bg-accent transition-colors text-sm font-medium"
              >
                {messages.refresh}
              </button>
            </div>

            {/* Error ID for Support */}
            {this.state.errorId && (
              <div className="pt-4 border-t border-border">
                <button
                  onClick={this.handleReportIssue}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {messages.reportIssue} • ID: {this.state.errorId}
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for functional components
export function useErrorHandler() {
  const handleError = React.useCallback((error: Error, errorInfo?: any) => {
    logger.error('Unhandled component error', error, {
      errorHandler: 'useErrorHandler',
      ...errorInfo
    });
  }, []);

  return handleError;
}