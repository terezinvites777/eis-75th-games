import type { ReactNode } from 'react';
import { Header } from './Header';
import { Navigation } from './Navigation';

interface MobileFrameProps {
  children: ReactNode;
  showHeader?: boolean;
  showNavigation?: boolean;
  headerProps?: {
    showNav?: boolean;
  };
}

export function MobileFrame({
  children,
  showHeader = true,
  showNavigation = true,
  headerProps,
}: MobileFrameProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {showHeader && <Header {...headerProps} />}
      <main
        className={`flex-1 ${showNavigation ? 'pb-20' : ''}`}
      >
        {children}
      </main>
      {showNavigation && <Navigation />}
    </div>
  );
}
