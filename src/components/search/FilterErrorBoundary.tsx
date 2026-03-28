import React, { Component, ReactNode, ErrorInfo } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  filterName: string;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class FilterErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`🚨 Filter Error in ${this.props.filterName}:`, error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleRetry = () => {
    console.log(`🔄 Retrying ${this.props.filterName} filter...`);
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-sm font-medium text-red-200">
              {this.props.filterName} Filter Error
            </span>
          </div>
          <p className="text-xs text-red-300 mb-3">
            This filter failed to load. Click retry to try again.
          </p>
          <button 
            onClick={this.handleRetry}
            className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-xs transition-colors text-white"
          >
            <RefreshCcw className="w-3 h-3" />
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}