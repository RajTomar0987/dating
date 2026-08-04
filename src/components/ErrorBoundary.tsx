import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary Captured Error]:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex-1 ml-0 md:ml-64 p-8 flex items-center justify-center min-h-[70vh] z-20 relative">
          <div className="max-w-lg w-full p-8 rounded-3xl bg-[#0A0A14]/95 border border-red-500/30 shadow-[0_20px_60px_rgba(239,68,68,0.2)] backdrop-blur-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 flex items-center justify-center mx-auto">
              <AlertTriangle size={32} />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-display font-extrabold text-white">Component Telemetry Recovery</h2>
              <p className="text-xs text-white/70 leading-relaxed font-sans">
                A non-fatal rendering exception occurred while calibrating this view. The rest of AuraAI remains safe.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 text-left font-mono text-[11px] text-red-300 max-h-32 overflow-y-auto">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-primary to-accent text-white text-xs font-bold shadow-lg hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
              >
                <RefreshCw size={14} />
                <span>Recover View</span>
              </button>

              <button
                onClick={() => {
                  window.location.href = '/';
                }}
                className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-semibold cursor-pointer flex items-center gap-2"
              >
                <Home size={14} />
                <span>Reset to Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
