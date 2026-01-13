// src/components/ui/OrnateCornersWrapper.tsx
// Simple wrapper that adds 4 Victorian corner ornaments to any element

import type { ReactNode } from 'react';

interface OrnateCornersWrapperProps {
  children: ReactNode;
  className?: string;
  /** Corner size: sm (50px), md (80px), lg (100px) */
  size?: 'sm' | 'md' | 'lg';
}

export function OrnateCornersWrapper({
  children,
  className = '',
  size = 'md',
}: OrnateCornersWrapperProps) {
  const sizes = {
    sm: 50,
    md: 80,
    lg: 100,
  };
  const cornerSize = sizes[size];

  const cornerStyle = {
    position: 'absolute' as const,
    width: cornerSize,
    height: cornerSize,
    backgroundImage: "url('/images/textures/victorian-borders.png')",
    backgroundSize: '200% 200%',
    pointerEvents: 'none' as const,
    zIndex: 20,
  };

  return (
    <div className={`ornate-corners-wrapper relative ${className}`} style={{ overflow: 'visible' }}>
      {children}
      {/* Top-left corner */}
      <div
        style={{
          ...cornerStyle,
          top: -8,
          left: -8,
          backgroundPosition: '0% 0%',
        }}
      />
      {/* Top-right corner */}
      <div
        style={{
          ...cornerStyle,
          top: -8,
          right: -8,
          backgroundPosition: '100% 0%',
        }}
      />
      {/* Bottom-left corner */}
      <div
        style={{
          ...cornerStyle,
          bottom: -8,
          left: -8,
          backgroundPosition: '0% 100%',
        }}
      />
      {/* Bottom-right corner */}
      <div
        style={{
          ...cornerStyle,
          bottom: -8,
          right: -8,
          backgroundPosition: '100% 100%',
        }}
      />
    </div>
  );
}

export default OrnateCornersWrapper;
