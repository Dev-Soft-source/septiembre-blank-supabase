import React, { Component, ReactNode, ErrorInfo } from 'react';
import { AlertTriangle, RefreshCcw, Shield } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  identifier?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ResourceErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Resource loading error in ${this.props.identifier || 'component'}:`, error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReload = () => {
    // Clear error state and reload
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    
    // Force a fresh reload to bypass cache
    window.location.reload();
  };

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 text-white text-center max-w-md mx-auto">
            <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
            <h1 className="text-2xl font-bold mb-4">Resource Loading Issue</h1>
            <p className="text-white/80 mb-4">
              Some resources couldn't load properly. This is often caused by ad blockers or browser security settings.
            </p>
            
            <div className="bg-white/5 rounded-lg p-4 mb-6 text-left">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium">Quick Solutions:</span>
              </div>
              <ul className="text-xs text-white/70 space-y-1">
                <li>• Disable ad blocker for this site</li>
                <li>• Allow third-party cookies</li>
                <li>• Try a different browser</li>
                <li>• Check your internet connection</li>
              </ul>
            </div>
            
            <div className="flex gap-3 justify-center">
              <button 
                onClick={this.handleRetry}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm"
              >
                Retry
              </button>
              <button 
                onClick={this.handleReload}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-sm"
              >
                <RefreshCcw className="w-4 h-4" />
                Reload Page
              </button>
            </div>
            
            {this.state.error && (
              <details className="mt-4 text-left">
                <summary className="text-xs cursor-pointer text-white/60 hover:text-white/80">
                  Technical Details
                </summary>
                <pre className="text-xs bg-[#68178D]/20 rounded p-2 mt-2 overflow-auto max-h-32">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}