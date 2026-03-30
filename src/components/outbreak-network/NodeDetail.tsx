// src/components/outbreak-network/NodeDetail.tsx
// Panel showing selected node info with clear action buttons

import { useState } from 'react';
import { Search, Crosshair } from 'lucide-react';
import type { NetworkNode } from '../../data/outbreak-network-data';
import type { GamePhase } from '../../types/outbreak-network';

interface NodeDetailProps {
  node: NetworkNode;
  isRevealed: boolean;
  phase: GamePhase;
  onInvestigate: () => void;
  onAccuse: (nodeId: string) => void;
  canInvestigate: boolean;
  tokensRemaining: number;
}

export function NodeDetail({
  node,
  isRevealed,
  phase,
  onInvestigate,
  onAccuse,
  canInvestigate,
  tokensRemaining,
}: NodeDetailProps) {
  const [confirmingAccusation, setConfirmingAccusation] = useState(false);

  if (phase === 'reveal' || phase === 'score') return null;

  const handleAccuseClick = () => {
    setConfirmingAccusation(true);
  };

  const handleConfirm = () => {
    setConfirmingAccusation(false);
    onAccuse(node.id);
  };

  const handleCancel = () => {
    setConfirmingAccusation(false);
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-slate-200 animate-slideUp">
      {/* Node info */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
            isRevealed
              ? node.status === 'infected'
                ? 'bg-red-500'
                : 'bg-green-500'
              : 'bg-slate-400'
          }`}
        >
          {isRevealed
            ? node.status === 'infected'
              ? `G${node.generation}`
              : '✓'
            : '?'}
        </div>
        <div>
          <h3 className="font-bold text-slate-800">{node.label}</h3>
          <p className="text-sm text-slate-500">
            {isRevealed
              ? node.status === 'infected'
                ? `Infected (Generation ${node.generation})`
                : 'Healthy — Not infected'
              : 'Status unknown'}
          </p>
        </div>
      </div>

      <div className="text-sm text-slate-600 mb-3">
        <span className="font-medium">{node.connections.length}</span> known contact{node.connections.length !== 1 ? 's' : ''}
        {isRevealed && <span className="text-slate-400 ml-1">— tap to highlight connections</span>}
      </div>

      {/* Confirmation overlay */}
      {confirmingAccusation ? (
        <div className="bg-amber-50 border-2 border-amber-400 rounded-lg p-3">
          <p className="text-sm font-bold text-amber-900 mb-3 text-center">
            Accuse {node.label} as Patient Zero?
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-sm py-2.5 px-3 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm py-2.5 px-3 rounded-lg transition-colors shadow-md"
            >
              Yes, I'm Sure!
            </button>
          </div>
        </div>
      ) : (
        /* Action buttons — always visible, side by side */
        <div className="flex gap-2">
          {!isRevealed && (
            <button
              onClick={onInvestigate}
              disabled={!canInvestigate}
              className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 font-bold text-sm py-2.5 px-3 rounded-lg transition-colors shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ color: '#fde68a' }}
            >
              <Search size={15} />
              <span style={{ color: '#fde68a' }}>Investigate</span>
              <span style={{ color: '#fef3c7' }} className="text-xs ml-0.5">({tokensRemaining})</span>
            </button>
          )}
          <button
            onClick={handleAccuseClick}
            className={`flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm py-2.5 px-3 rounded-lg transition-colors shadow-md ${isRevealed ? 'flex-1' : ''}`}
          >
            <Crosshair size={15} />
            Patient Zero!
          </button>
        </div>
      )}
    </div>
  );
}
