"use client";

import React from 'react';

type AppErrorBoundaryState = {
  hasError: boolean;
  message?: string;
};

class AppErrorBoundary extends React.Component<React.PropsWithChildren, AppErrorBoundaryState> {
  constructor(props: React.PropsWithChildren) {
    super(props);
    this.state = { hasError: false, message: undefined };
    this.handleReset = this.handleReset.bind(this);
  }

  static getDerivedStateFromError(error: unknown): AppErrorBoundaryState {
    const message = typeof error === 'string' ? error : (error as any)?.message || 'Une erreur est survenue.';
    return { hasError: true, message };
  }

  componentDidCatch(error: unknown, info: unknown) {
    // Vous pouvez brancher un service de log ici si besoin
    console.error('AppErrorBoundary caught:', error, info);
  }

  handleReset() {
    this.setState({ hasError: false, message: undefined });
    // On peut aussi forcer un refresh si souhaité:
    // window.location.reload();
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="w-full max-w-md rounded-lg border bg-white p-6 shadow">
            <h1 className="text-lg font-semibold mb-2">Oups, quelque chose s'est mal passé.</h1>
            <p className="text-sm text-gray-600 mb-4">{this.state.message}</p>
            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
              >
                Réessayer
              </button>
              <button
                onClick={() => window.location.assign('/')}
                className="inline-flex items-center justify-center rounded-md bg-gray-200 px-4 py-2 text-gray-900 hover:bg-gray-300 transition"
              >
                Retour à l’accueil
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default AppErrorBoundary;