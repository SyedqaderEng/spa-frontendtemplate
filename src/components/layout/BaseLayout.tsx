'use client';

import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

export interface BaseLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  className?: string;
}

export function BaseLayout({
  children,
  showHeader = true,
  showFooter = true,
  className = '',
}: BaseLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white" data-testid="base-layout">
      {showHeader && <Header />}

      <main
        className={`flex-1 ${className}`}
        role="main"
        data-testid="main-content"
      >
        {children}
      </main>

      {showFooter && <Footer />}
    </div>
  );
}

export default BaseLayout;
