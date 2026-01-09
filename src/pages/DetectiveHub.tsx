// src/pages/DetectiveHub.tsx
// Main hub for Disease Detective game mode

import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { GameShell } from '../components/layout/GameShell';
import { EraCard } from '../components/detective/EraCard';
import { CaseCard } from '../components/detective/CaseCard';
import { ERA_INFO, getCasesByEra, allCases } from '../data/detective';
import type { Era } from '../types/detective';
import { useGameStore } from '../store/gameStore';

export function DetectiveHub() {
  const navigate = useNavigate();
  const { era } = useParams<{ era?: string }>();
  const { completedCases, streak } = useGameStore();
  
  // If an era is selected, show cases for that era
  const selectedEra = era as Era | undefined;
  const cases = selectedEra ? getCasesByEra(selectedEra) : [];
  const eraInfo = selectedEra ? ERA_INFO[selectedEra] : null;

  const handleSelectEra = (eraKey: Era) => {
    navigate(`/detective/${eraKey}`);
  };

  const handleSelectCase = (caseId: string) => {
    navigate(`/detective/${selectedEra}/${caseId}`);
  };

  // Calculate completed counts per era
  const getCompletedForEra = (eraKey: Era) => {
    return getCasesByEra(eraKey).filter(c => completedCases.includes(c.id)).length;
  };

  return (
    <GameShell
      theme="detective"
      heroTitle={eraInfo ? eraInfo.title : "Disease Detective"}
      heroSubtitle={eraInfo ? eraInfo.description : "Solve historical outbreak mysteries"}
      backPath={selectedEra ? '/detective' : '/'}
    >
      <div className="p-5 space-y-6">
        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="stat-card"
          >
            <div className="stat-value text-[var(--anniv-bronze)]">
              {completedCases.length}
            </div>
            <div className="stat-label">Cases Solved</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="stat-card"
          >
            <div className="stat-value text-[var(--anniv-gold)]">
              {streak}
            </div>
            <div className="stat-label">Win Streak</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="stat-card"
          >
            <div className="stat-value text-[var(--cdc-blue)]">
              {allCases.length}
            </div>
            <div className="stat-label">Total Cases</div>
          </motion.div>
        </div>

        {!selectedEra ? (
          <>
            {/* How to Play */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="panel"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[var(--anniv-gold)]/10">
                  <BookOpen size={20} className="text-[var(--anniv-bronze)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">How to Play</h3>
                  <ol className="text-sm text-gray-600 space-y-1">
                    <li>1. Choose an era from EIS history</li>
                    <li>2. Review clues from real outbreak investigations</li>
                    <li>3. Identify the pathogen AND the source</li>
                    <li>4. Learn how EIS officers solved each case</li>
                  </ol>
                </div>
              </div>
            </motion.div>

            {/* Era Selection */}
            <div className="space-y-4">
              <div className="section-header">
                <span className="section-title">Choose Your Era</span>
                <div className="section-header-line" />
              </div>

              <div className="space-y-4">
                {(Object.keys(ERA_INFO) as Era[]).map((eraKey, index) => (
                  <EraCard
                    key={eraKey}
                    era={ERA_INFO[eraKey]}
                    completedCount={getCompletedForEra(eraKey)}
                    totalCount={getCasesByEra(eraKey).length}
                    onClick={() => handleSelectEra(eraKey)}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Cases for Selected Era */}
            <div className="space-y-4">
              <div className="section-header">
                <span className="section-title">{cases.length} Cases Available</span>
                <div className="section-header-line" />
              </div>

              <div className="space-y-4">
                {cases.map((caseData, index) => {
                  const isCompleted = completedCases.includes(caseData.id);
                  // For now, all cases are available (no lock progression)
                  const status = isCompleted ? 'completed' : 'available';

                  return (
                    <CaseCard
                      key={caseData.id}
                      caseData={caseData}
                      status={status}
                      onClick={() => handleSelectCase(caseData.id)}
                      index={index}
                    />
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </GameShell>
  );
}

export default DetectiveHub;
