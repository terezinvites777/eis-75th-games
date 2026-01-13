// src/components/brand/BrandMarks.tsx
// EIS and CDC branding components

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizes = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
};

// EIS Shield Icon
export function EISShield({ size = 'md', className = '' }: LogoProps) {
  return (
    <svg
      viewBox="0 0 100 120"
      className={`${sizes[size]} ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Shield shape */}
      <path
        d="M50 5 L90 20 L90 60 Q90 95 50 115 Q10 95 10 60 L10 20 Z"
        fill="url(#shieldGradient)"
        stroke="#B8860B"
        strokeWidth="2"
      />
      {/* Inner shield */}
      <path
        d="M50 12 L82 24 L82 58 Q82 88 50 105 Q18 88 18 58 L18 24 Z"
        fill="#0057B8"
        stroke="#D4AF37"
        strokeWidth="1.5"
      />
      {/* EIS Text */}
      <text
        x="50"
        y="58"
        textAnchor="middle"
        fill="white"
        fontSize="28"
        fontWeight="bold"
        fontFamily="system-ui"
      >
        EIS
      </text>
      {/* 75 Badge */}
      <circle cx="72" cy="25" r="14" fill="#D4AF37" />
      <text
        x="72"
        y="30"
        textAnchor="middle"
        fill="#1a1a1a"
        fontSize="12"
        fontWeight="bold"
        fontFamily="system-ui"
      >
        75
      </text>
      {/* Gradient definitions */}
      <defs>
        <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#B8860B" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Anniversary Lockup (horizontal logo with text)
export function AnniversaryLockup({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img
        src="/images/eis-logo.png"
        alt="EIS Logo"
        className="w-12 h-12 object-contain"
      />
      <div className="flex flex-col">
        <span className="text-lg font-bold tracking-tight text-white">
          EIS 75th Anniversary
        </span>
        <span className="text-xs text-white/70 tracking-wide uppercase">
          Disease Detective Games
        </span>
      </div>
    </div>
  );
}

// Simple text logo
export function EISWordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`font-bold tracking-tight ${className}`}>
      <span className="text-gradient-gold">EIS</span>
      <span className="text-white mx-1">75</span>
    </span>
  );
}

// CDC Logo placeholder (simplified)
export function CDCLogo({ size = 'md', className = '' }: LogoProps) {
  return (
    <svg
      viewBox="0 0 100 40"
      className={`${sizes[size]} ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="100" height="40" rx="4" fill="#0057B8" />
      <text
        x="50"
        y="27"
        textAnchor="middle"
        fill="white"
        fontSize="18"
        fontWeight="bold"
        fontFamily="system-ui"
      >
        CDC
      </text>
    </svg>
  );
}

// Era badge for card headers
interface EraBadgeProps {
  era: '1950s' | '1980s' | '2010s';
  className?: string;
}

export function EraBadge({ era, className = '' }: EraBadgeProps) {
  const colors = {
    '1950s': 'bg-gradient-to-r from-amber-500 to-yellow-600 text-amber-950',
    '1980s': 'bg-gradient-to-r from-blue-500 to-cyan-600 text-blue-950',
    '2010s': 'bg-gradient-to-r from-purple-500 to-pink-600 text-purple-950',
  };

  const icons = {
    '1950s': '🔬',
    '1980s': '🧬',
    '2010s': '🌍',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-semibold ${colors[era]} ${className}`}
    >
      <span>{icons[era]}</span>
      <span>{era}</span>
    </span>
  );
}

// Difficulty stars
interface DifficultyStarsProps {
  level: 1 | 2 | 3;
  className?: string;
}

export function DifficultyStars({ level, className = '' }: DifficultyStarsProps) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {[1, 2, 3].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= level ? 'text-amber-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1 text-xs text-gray-500 font-medium">
        {level === 1 ? 'Easy' : level === 2 ? 'Medium' : 'Hard'}
      </span>
    </div>
  );
}
