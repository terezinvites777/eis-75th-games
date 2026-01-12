// src/components/connect/QRCodeConnect.tsx
// QR code display and scanning for in-person connections

import { useState } from 'react';
import type { UserProfile, AttendeeProfile } from '../../types/connect';
import { mockAttendees, roleLabels, topicLabels } from '../../data/connect-data';
import { QrCode, Camera, Check, Sparkles, UserPlus, X, Scan } from 'lucide-react';

interface QRCodeConnectProps {
  userProfile: UserProfile;
  onConnect: (attendeeId: string, method: 'qr_scan') => void;
  connectedIds: Set<string>;
}

export function QRCodeConnect({ userProfile, onConnect, connectedIds }: QRCodeConnectProps) {
  const [mode, setMode] = useState<'show' | 'scan'>('show');
  const [showSuccess, setShowSuccess] = useState(false);
  const [connectedPerson, setConnectedPerson] = useState<AttendeeProfile | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  // Generate a simple QR-like pattern based on user ID
  const generateQRPattern = () => {
    const pattern: boolean[][] = [];
    const hash = userProfile.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);

    for (let row = 0; row < 9; row++) {
      pattern[row] = [];
      for (let col = 0; col < 9; col++) {
        // Corner patterns (QR finder patterns)
        const isCorner = (
          (row < 3 && col < 3) || // top-left
          (row < 3 && col > 5) || // top-right
          (row > 5 && col < 3)    // bottom-left
        );

        if (isCorner) {
          const cornerRow = row % 3;
          const cornerCol = col % 3;
          pattern[row][col] = cornerRow === 0 || cornerRow === 2 ||
                              cornerCol === 0 || cornerCol === 2 ||
                              (cornerRow === 1 && cornerCol === 1);
        } else {
          // Data pattern based on hash
          pattern[row][col] = ((hash + row * col) % 3) === 0;
        }
      }
    }
    return pattern;
  };

  const qrPattern = generateQRPattern();

  // Simulate scanning (for demo - picks a random unconnected attendee)
  const simulateScan = () => {
    setIsScanning(true);

    setTimeout(() => {
      const unconnected = mockAttendees.filter(a =>
        a.id !== userProfile.id && !connectedIds.has(a.id)
      );

      if (unconnected.length > 0) {
        const randomPerson = unconnected[Math.floor(Math.random() * unconnected.length)];
        setConnectedPerson(randomPerson);
        setIsScanning(false);
        setShowSuccess(true);
        onConnect(randomPerson.id, 'qr_scan');
      } else {
        setIsScanning(false);
        alert('You\'ve already connected with everyone!');
      }
    }, 2000);
  };

  const closeSuccess = () => {
    setShowSuccess(false);
    setConnectedPerson(null);
  };

  return (
    <div className="space-y-4">
      {/* Mode Toggle */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-2 bg-slate-100 p-1">
          <button
            onClick={() => setMode('show')}
            className={`py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              mode === 'show' ? 'bg-white shadow text-purple-700' : 'text-slate-600'
            }`}
          >
            <QrCode size={18} />
            My QR Code
          </button>
          <button
            onClick={() => setMode('scan')}
            className={`py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              mode === 'scan' ? 'bg-white shadow text-purple-700' : 'text-slate-600'
            }`}
          >
            <Scan size={18} />
            Scan to Connect
          </button>
        </div>

        <div className="p-6">
          {mode === 'show' ? (
            <div className="text-center">
              <p className="text-slate-600 mb-4">
                Show this QR code to connect with someone in person
              </p>

              {/* QR Code Display */}
              <div className="bg-white p-6 rounded-2xl inline-block border-4 border-purple-100 shadow-lg">
                <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(9, 1fr)' }}>
                  {qrPattern.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`w-5 h-5 rounded-sm ${cell ? 'bg-purple-700' : 'bg-white'}`}
                      />
                    ))
                  )}
                </div>
              </div>

              <div className="mt-4">
                <div className="text-lg font-bold text-slate-800">{userProfile.name}</div>
                <div className="text-sm text-purple-600">{roleLabels[userProfile.role]}</div>
                {userProfile.eis_class_year && (
                  <div className="text-xs text-slate-500">Class of {userProfile.eis_class_year}</div>
                )}
              </div>

              <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                <p className="text-xs text-purple-700">
                  When someone scans your code, you'll both be connected and earn points!
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-slate-600 mb-4">
                {isScanning ? 'Scanning...' : 'Point your camera at someone\'s QR code'}
              </p>

              {/* Camera Viewfinder */}
              <div className="relative mx-auto w-64 h-64 bg-slate-900 rounded-2xl overflow-hidden">
                {/* Viewfinder frame */}
                <div className="absolute inset-4 border-2 border-white/30 rounded-xl" />

                {/* Corner brackets */}
                <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-purple-400 rounded-tl-lg" />
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-purple-400 rounded-tr-lg" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-purple-400 rounded-bl-lg" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-purple-400 rounded-br-lg" />

                {/* Center icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Camera size={48} className={`text-white/30 ${isScanning ? 'animate-pulse' : ''}`} />
                </div>

                {/* Scanning animation */}
                {isScanning && (
                  <div
                    className="absolute left-4 right-4 h-0.5 bg-purple-500 animate-pulse"
                    style={{
                      animation: 'scan 2s ease-in-out infinite',
                    }}
                  />
                )}
              </div>

              <button
                onClick={simulateScan}
                disabled={isScanning}
                className={`mt-6 w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                  isScanning
                    ? 'bg-purple-300 text-white cursor-wait'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                {isScanning ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Scan size={20} />
                    Tap to Scan (Demo)
                  </>
                )}
              </button>

              <p className="text-xs text-slate-500 mt-3">
                In the real app, this would use your camera to scan QR codes
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && connectedPerson && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full animate-scale-in">
            <button
              onClick={closeSuccess}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X size={24} />
            </button>

            <div className="text-center">
              {/* Success animation */}
              <div className="relative w-20 h-20 mx-auto mb-4">
                <div className="absolute inset-0 bg-green-100 rounded-full animate-ping" style={{ animationDuration: '1s' }} />
                <div className="absolute inset-0 bg-green-100 rounded-full flex items-center justify-center">
                  <Check size={40} className="text-green-600" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-slate-800 mb-2">
                Connected! 🎉
              </h3>

              <p className="text-slate-600 mb-4">
                You're now connected with
              </p>

              {/* Connected person info */}
              <div className="bg-slate-50 rounded-xl p-4 mb-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold mb-2">
                  {connectedPerson.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="font-bold text-slate-800">{connectedPerson.name}</div>
                <div className="text-sm text-purple-600">
                  {roleLabels[connectedPerson.role]}
                  {connectedPerson.eis_class_year && ` • Class of ${connectedPerson.eis_class_year}`}
                </div>
                <div className="flex flex-wrap gap-1 justify-center mt-2">
                  {connectedPerson.topics.slice(0, 2).map(topic => (
                    <span key={topic} className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                      {topicLabels[topic]}
                    </span>
                  ))}
                </div>
              </div>

              {/* Points earned */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 mb-6 text-white">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Sparkles size={20} />
                  <span className="font-semibold">Connection Bonus!</span>
                </div>
                <div className="text-3xl font-bold">+50 pts</div>
              </div>

              <button
                onClick={closeSuccess}
                className="w-full py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 flex items-center justify-center gap-2"
              >
                <UserPlus size={18} />
                Continue Networking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS for scanning animation */}
      <style>{`
        @keyframes scan {
          0%, 100% { top: 1rem; }
          50% { top: calc(100% - 1rem); }
        }
        .animate-scale-in {
          animation: scaleIn 0.3s ease-out;
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default QRCodeConnect;
