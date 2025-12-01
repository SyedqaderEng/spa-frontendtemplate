'use client';

import { ReactNode, useEffect } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider, useToast } from '@/contexts/ToastContext';
import { ToastContainer } from '@/components/ui/ToastContainer';
import { setGlobalErrorHandler, removeGlobalErrorHandler } from '@/lib/api-client';

export interface ProvidersProps {
  children: ReactNode;
}

// Inner component that sets up the API error handler
function ApiErrorHandler({ children }: { children: ReactNode }) {
  const { showError } = useToast();

  useEffect(() => {
    // Set up global API error handler to show toast notifications
    setGlobalErrorHandler((error) => {
      showError(error.message);
    });

    return () => {
      removeGlobalErrorHandler();
    };
  }, [showError]);

  return <>{children}</>;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ToastProvider>
      <AuthProvider>
        <ApiErrorHandler>
          {children}
        </ApiErrorHandler>
      </AuthProvider>
      <ToastContainer />
    </ToastProvider>
  );
}
