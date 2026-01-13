// src/components/connect/ConnectRightSidebar.tsx
// Instagram-style right sidebar with tips and quick links

import { Link } from 'react-router-dom';
import { Lightbulb, QrCode, Timer, Target, ExternalLink, Heart } from 'lucide-react';
import type { ConnectView } from '../../types/connect';

interface ConnectRightSidebarProps {
  onNavigate: (view: ConnectView) => void;
}

export function ConnectRightSidebar({ onNavigate }: ConnectRightSidebarProps) {
  const tips = [
    { icon: '1', text: 'Scan QR codes for bonus points (+50 pts!)' },
    { icon: '2', text: 'Ask about their EIS investigation story' },
    { icon: '3', text: 'Follow up with a LinkedIn connection' },
    { icon: '4', text: 'Complete challenges for extra rewards' },
  ];

  return (
    <div className="sticky top-6 space-y-4">
      {/* Networking Tips */}
      <div className="panel">
        <div className="section-header mb-3">
          <Lightbulb size={16} className="text-amber-500" />
          <span className="section-title">Networking Tips</span>
          <div className="section-header-line" />
        </div>

        <div className="space-y-2">
          {tips.map((tip, idx) => (
            <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-amber-50">
              <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                {tip.icon}
              </span>
              <p className="text-xs text-slate-700">{tip.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="panel">
        <div className="section-header mb-3">
          <Target size={16} className="text-purple-600" />
          <span className="section-title">Quick Links</span>
          <div className="section-header-line" />
        </div>

        <div className="space-y-2">
          <button
            onClick={() => onNavigate('qr')}
            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-purple-50 transition-colors text-left"
          >
            <div className="p-1.5 bg-purple-100 rounded-lg">
              <QrCode size={14} className="text-purple-600" />
            </div>
            <span className="text-sm font-medium text-slate-700">My QR Code</span>
          </button>

          <button
            onClick={() => onNavigate('speed')}
            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-purple-50 transition-colors text-left"
          >
            <div className="p-1.5 bg-purple-100 rounded-lg">
              <Timer size={14} className="text-purple-600" />
            </div>
            <span className="text-sm font-medium text-slate-700">Speed Mode</span>
          </button>

          <button
            onClick={() => onNavigate('challenges')}
            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-purple-50 transition-colors text-left"
          >
            <div className="p-1.5 bg-purple-100 rounded-lg">
              <Target size={14} className="text-purple-600" />
            </div>
            <span className="text-sm font-medium text-slate-700">Challenges</span>
          </button>

          <button
            onClick={() => onNavigate('connections')}
            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-purple-50 transition-colors text-left"
          >
            <div className="p-1.5 bg-purple-100 rounded-lg">
              <Heart size={14} className="text-purple-600" />
            </div>
            <span className="text-sm font-medium text-slate-700">My Connections</span>
          </button>
        </div>
      </div>

      {/* EIS Info */}
      <div className="panel bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">🦠</span>
          <span className="text-sm font-bold text-purple-800">EIS 75th Anniversary</span>
        </div>
        <p className="text-xs text-slate-600 mb-3">
          Connecting disease detectives since 1951. Celebrate 75 years of epidemic intelligence!
        </p>
        <Link
          to="/"
          className="text-xs font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1"
        >
          Explore all games <ExternalLink size={10} />
        </Link>
      </div>
    </div>
  );
}

export default ConnectRightSidebar;
