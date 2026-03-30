// src/pages/KioskDetectiveGame.tsx
// Disease Detective — Kiosk "War Room" single-screen layout
// Everything fits in 1920×1080, zero scrolling, all touch-friendly

import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, XCircle, ChevronDown } from 'lucide-react';
import { ClueCardGrid } from '../components/detective/ClueCardGrid';
import { ClueDetailModal } from '../components/detective/ClueDetailModal';
import { RevealConfirm } from '../components/detective/RevealConfirm';
import { KioskOptionButtons } from '../components/detective/KioskOptionButtons';
import { getCaseById } from '../data/detective';
import { DETECTIVE_PLATES } from '../data/detectivePlates';
import { useGameStore } from '../store/gameStore';
import { buildClueCards, truncate } from '../utils/kiosk-detective-helpers';
import type { ClueCard } from '../utils/kiosk-detective-helpers';
import '../styles/evidence-board.css';
import '../styles/kiosk-detective.css';

const KIOSK_TIME_LIMIT = 180; // 3 minutes for kiosk

export function KioskDetectiveGame() {
  const navigate = useNavigate();
  const { era, caseId } = useParams<{ era: string; caseId: string }>();
  const { addScore } = useGameStore();

  const caseData = caseId ? getCaseById(caseId) : null;

  // Timer starts immediately — no "Begin Investigation" gate
  const [timeRemaining, setTimeRemaining] = useState(KIOSK_TIME_LIMIT);
  const [revealedClues, setRevealedClues] = useState<string[]>([]);
  const [selectedPathogen, setSelectedPathogen] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [pointsSpent, setPointsSpent] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // Kiosk-specific state
  const [expandedClue, setExpandedClue] = useState<ClueCard | null>(null);
  const [confirmReveal, setConfirmReveal] = useState<ClueCard | null>(null);

  // Scroll hint for left column
  const leftColRef = useRef<HTMLDivElement>(null);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [canScroll, setCanScroll] = useState(false);

  useEffect(() => {
    const el = leftColRef.current;
    if (!el) return;
    const check = () => {
      const hasOverflow = el.scrollHeight > el.clientHeight + 4;
      setCanScroll(hasOverflow);
      setScrolledToBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 8);
    };
    check();
    el.addEventListener('scroll', check, { passive: true });
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => { el.removeEventListener('scroll', check); ro.disconnect(); };
  }, [caseData]);

  // Timer countdown
  useEffect(() => {
    if (showResult) return;
    if (timeRemaining <= 0) return;
    const timer = setInterval(() => {
      setTimeRemaining(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeRemaining, showResult]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const availablePoints = caseData ? caseData.basePoints - pointsSpent : 0;

  // Build clue cards for the grid
  const clueCards = caseData
    ? buildClueCards(caseData.clues, revealedClues)
    : [];

  // Handle tapping a locked card — show confirmation
  const handleTapLocked = useCallback((card: ClueCard) => {
    setConfirmReveal(card);
  }, []);

  // Handle tapping a revealed card — show detail modal
  const handleTapRevealed = useCallback((card: ClueCard) => {
    setExpandedClue(card);
  }, []);

  // Confirm reveal — deduct points and reveal the clue
  const handleConfirmReveal = useCallback(() => {
    if (!confirmReveal || !caseData) return;
    const clue = caseData.clues.find(c => c.id === confirmReveal.id);
    if (!clue || revealedClues.includes(clue.id)) return;
    if (availablePoints < clue.pointCost) return;

    setRevealedClues(prev => [...prev, clue.id]);
    setPointsSpent(prev => prev + clue.pointCost);
    setConfirmReveal(null);
  }, [confirmReveal, caseData, revealedClues, availablePoints]);

  // Submit diagnosis
  const submitDiagnosis = useCallback(() => {
    if (!caseData || !selectedPathogen || !selectedSource) return;
    const pathogenCorrect = selectedPathogen === caseData.solution.pathogenId;
    const sourceCorrect = selectedSource === caseData.solution.sourceId;
    const bothCorrect = pathogenCorrect && sourceCorrect;

    let finalScore = 0;
    if (bothCorrect) {
      finalScore = caseData.basePoints;
      const timeBonus = Math.floor((timeRemaining / KIOSK_TIME_LIMIT) * 100);
      finalScore += timeBonus;
      finalScore = Math.max(0, finalScore - pointsSpent);
    } else if (pathogenCorrect || sourceCorrect) {
      finalScore = Math.floor(caseData.basePoints * 0.25);
    }

    setScore(finalScore);
    setIsCorrect(bothCorrect);
    if (finalScore > 0) addScore(finalScore);
    setShowResult(true);
  }, [caseData, selectedPathogen, selectedSource, timeRemaining, pointsSpent, addScore]);

  if (!caseData) {
    return (
      <div className="eis-board" style={{ padding: 40, textAlign: 'center', color: '#d4af37' }}>
        Case not found.
      </div>
    );
  }

  const briefingText = caseData.briefing.kioskSummary
    || truncate(caseData.briefing.content, 200);

  return (
    <>
      <div className="eis-board" style={{ height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Top Bar */}
        <header className="eis-board__topbar">
          <button className="eis-board__back" type="button" onClick={() => navigate(`/detective/${era}`)}>
            ← Back
          </button>

          <div className="eis-board__nameplate">
            <div className="eis-board__title">
              {caseData.title}
              <span className="eis-board__year">{caseData.year}</span>
            </div>
            <div className="eis-board__subtitle">{caseData.subtitle}</div>
          </div>

          <div className="eis-board__hud">
            <div className="eis-board__hudbox">
              <div className="k">Time</div>
              <div className="v" style={timeRemaining <= 30 ? { color: '#ef4444' } : undefined}>
                {formatTime(timeRemaining)}
              </div>
            </div>
            <div className="eis-board__hudbox">
              <div className="k">Points</div>
              <div className="v">{availablePoints}</div>
            </div>
          </div>
        </header>

        {/* War Room 3-Column Layout */}
        <div className="kiosk-dd">
          {/* LEFT: Briefing + Evidence Board */}
          <div className="kiosk-dd__left-wrap">
            <div className="kiosk-dd__left" ref={leftColRef}>
              <div className="kiosk-dd__briefing pinned r-1">
                <h3 className="pinned__title">Case Briefing</h3>
                <p className="kiosk-dd__briefing-text">{briefingText}</p>
              </div>

              <div className="kiosk-dd__evidence-form evidence-form">
                <h3 className="evidence-form__title">Evidence Board</h3>
                <p className="evidence-form__subtitle">Make your diagnosis:</p>

                <KioskOptionButtons
                  label="Outbreak Source:"
                  options={caseData.diagnosis.pathogenOptions}
                  selected={selectedPathogen}
                  onSelect={setSelectedPathogen}
                />

                <KioskOptionButtons
                  label="Exposure Vehicle:"
                  options={caseData.diagnosis.sourceOptions}
                  selected={selectedSource}
                  onSelect={setSelectedSource}
                />

                <button
                  className="evidence-form__submit"
                  onClick={submitDiagnosis}
                  disabled={!selectedPathogen || !selectedSource}
                >
                  Submit Theory
                </button>
              </div>
            </div>

            {canScroll && (
              <div className={`kiosk-dd__scroll-hint${scrolledToBottom ? ' hidden' : ''}`}>
                <ChevronDown className="kiosk-dd__scroll-hint-chevron" />
              </div>
            )}
          </div>

          {/* CENTER: Evidence Card Grid */}
          <ClueCardGrid
            cards={clueCards}
            onTapLocked={handleTapLocked}
            onTapRevealed={handleTapRevealed}
          />

          {/* RIGHT: Photo + Status */}
          <div className="kiosk-dd__right">
            <div className="polaroid r-4">
              <img src={DETECTIVE_PLATES.evidence.src} alt="Case evidence" />
              <div className="polaroid__caption">Case #{caseData.id}</div>
            </div>

            <div className="pinned kiosk-dd__status">
              <h3 className="pinned__title">Case Status</h3>
              <div className="kiosk-dd__status-row">
                <span>Phase</span>
                <strong>Investigation</strong>
              </div>
              <div className="kiosk-dd__status-row">
                <span>Clues</span>
                <strong>{revealedClues.length}/{caseData.clues.length}</strong>
              </div>
              <div className="kiosk-dd__status-row">
                <span>Pathogen</span>
                <strong>{selectedPathogen ? '☑' : '☐'}</strong>
              </div>
              <div className="kiosk-dd__status-row">
                <span>Vehicle</span>
                <strong>{selectedSource ? '☑' : '☐'}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clue Detail Modal */}
      <ClueDetailModal
        clue={expandedClue}
        onClose={() => setExpandedClue(null)}
      />

      {/* Reveal Confirmation */}
      <RevealConfirm
        clue={confirmReveal}
        availablePoints={availablePoints}
        onConfirm={handleConfirmReveal}
        onCancel={() => setConfirmReveal(null)}
      />

      {/* Result Modal */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            className="result-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="result-card"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className={`result-card__icon ${isCorrect ? 'result-card__icon--success' : 'result-card__icon--fail'}`}>
                {isCorrect ? <CheckCircle size={40} /> : <XCircle size={40} />}
              </div>

              <h2 className="result-card__title" style={{ color: isCorrect ? '#16a34a' : '#dc2626' }}>
                {isCorrect ? 'Case Solved!' : 'Not Quite'}
              </h2>

              <p style={{ color: '#5a4a3a' }}>
                {isCorrect ? 'Excellent detective work!' : 'Review the evidence and try again.'}
              </p>

              <div className="result-card__score">+{score} pts</div>

              <div className="result-card__explanation">
                <p style={{ marginBottom: 8 }}><strong>Pathogen:</strong> {caseData.solution.pathogen}</p>
                <p style={{ marginBottom: 8 }}><strong>Source:</strong> {caseData.solution.source}</p>
                <p style={{ fontSize: 13 }}>{caseData.solution.explanation}</p>
              </div>

              <div className="result-card__actions">
                <button
                  className="result-card__btn result-card__btn--secondary"
                  onClick={() => navigate(`/detective/${era}`)}
                >
                  More Cases
                </button>
                <button
                  className="result-card__btn result-card__btn--primary"
                  onClick={() => navigate('/detective')}
                >
                  Choose Era
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default KioskDetectiveGame;
