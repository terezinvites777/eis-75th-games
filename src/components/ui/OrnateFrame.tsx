// src/components/ui/OrnateFrame.tsx
// Ornate museum-style frame with brass borders and victorian corner ornaments

import type { ReactNode } from 'react';

interface OrnateFrameProps {
  children: ReactNode;
  className?: string;
  /** Use parchment background inside frame */
  parchment?: 'light' | 'dark' | 'none';
  /** Corner ornament size */
  cornerSize?: 'sm' | 'md' | 'lg';
  /** Show brass edge borders */
  showEdges?: boolean;
}

export function OrnateFrame({
  children,
  className = '',
  parchment = 'light',
  cornerSize = 'md',
  showEdges = true,
}: OrnateFrameProps) {
  const cornerSizes = {
    sm: 60,
    md: 80,
    lg: 120,
  };
  const size = cornerSizes[cornerSize];

  const parchmentBg = {
    light: "url('/images/textures/parchment-light.png')",
    dark: "url('/images/textures/parchment-dark.png')",
    none: 'transparent',
  };

  return (
    <div className={`ornate-frame relative ${className}`}>
      {/* Background layer */}
      <div
        className="absolute inset-0 rounded-lg"
        style={{
          background: parchment !== 'none' ? parchmentBg[parchment] : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Inner shadow/depth */}
      <div
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{
          boxShadow: `
            inset 0 0 30px rgba(0,0,0,0.3),
            inset 0 0 60px rgba(0,0,0,0.15),
            0 10px 40px rgba(0,0,0,0.4),
            0 4px 12px rgba(0,0,0,0.3)
          `,
        }}
      />

      {/* Brass edge borders */}
      {showEdges && (
        <>
          {/* Top edge */}
          <div
            className="absolute top-0 left-[60px] right-[60px] h-[20px] z-10"
            style={{
              backgroundImage: "url('/images/textures/brass-border.png')",
              backgroundSize: 'auto 100%',
              backgroundRepeat: 'repeat-x',
              backgroundPosition: 'center top',
            }}
          />
          {/* Bottom edge */}
          <div
            className="absolute bottom-0 left-[60px] right-[60px] h-[20px] z-10"
            style={{
              backgroundImage: "url('/images/textures/brass-border.png')",
              backgroundSize: 'auto 100%',
              backgroundRepeat: 'repeat-x',
              backgroundPosition: 'center bottom',
              transform: 'scaleY(-1)',
            }}
          />
          {/* Left edge */}
          <div
            className="absolute left-0 top-[60px] bottom-[60px] w-[20px] z-10"
            style={{
              backgroundImage: "url('/images/textures/brass-border.png')",
              backgroundSize: '100% auto',
              backgroundRepeat: 'repeat-y',
              backgroundPosition: 'left center',
              transform: 'rotate(-90deg) translateX(-100%)',
              transformOrigin: 'top left',
              width: 'calc(100% - 120px)',
              height: '20px',
              top: '60px',
              left: '0',
            }}
          />
          {/* Right edge */}
          <div
            className="absolute right-0 top-[60px] bottom-[60px] w-[20px] z-10"
            style={{
              backgroundImage: "url('/images/textures/brass-border.png')",
              backgroundSize: '100% auto',
              backgroundRepeat: 'repeat-y',
              backgroundPosition: 'right center',
              transform: 'rotate(90deg)',
              transformOrigin: 'top right',
              width: 'calc(100% - 120px)',
              height: '20px',
            }}
          />
        </>
      )}

      {/* Victorian corner ornaments */}
      {/* Top-left corner */}
      <div
        className="absolute top-0 left-0 z-20 pointer-events-none"
        style={{
          width: size,
          height: size,
          backgroundImage: "url('/images/textures/victorian-borders.png')",
          backgroundSize: '400% 200%',
          backgroundPosition: '0% 0%',
        }}
      />
      {/* Top-right corner */}
      <div
        className="absolute top-0 right-0 z-20 pointer-events-none"
        style={{
          width: size,
          height: size,
          backgroundImage: "url('/images/textures/victorian-borders.png')",
          backgroundSize: '400% 200%',
          backgroundPosition: '100% 0%',
        }}
      />
      {/* Bottom-left corner */}
      <div
        className="absolute bottom-0 left-0 z-20 pointer-events-none"
        style={{
          width: size,
          height: size,
          backgroundImage: "url('/images/textures/victorian-borders.png')",
          backgroundSize: '400% 200%',
          backgroundPosition: '0% 100%',
        }}
      />
      {/* Bottom-right corner */}
      <div
        className="absolute bottom-0 right-0 z-20 pointer-events-none"
        style={{
          width: size,
          height: size,
          backgroundImage: "url('/images/textures/victorian-borders.png')",
          backgroundSize: '400% 200%',
          backgroundPosition: '100% 100%',
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-6">
        {children}
      </div>
    </div>
  );
}

export default OrnateFrame;
