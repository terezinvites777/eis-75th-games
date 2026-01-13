// src/pages/DetectiveHub.tsx
// Main hub for Disease Detective game mode - Archive/Case File aesthetic

import { useNavigate, useParams } from 'react-router-dom';
import { BookOpen, Trophy, Flame, FolderOpen, Search } from 'lucide-react';
import { DetectiveGameShell } from '../components/detective/DetectiveGameShell';
import { ParchmentPanel } from '../components/detective/ParchmentPanel';
import { EraCard } from '../components/detective/EraCard';
import { CaseCard } from '../components/detective/CaseCard';
import { ERA_INFO, getCasesByEra, allCases } from '../data/detective';
import { DETECTIVE_PLATES } from '../data/detectivePlates';
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
    <DetectiveGameShell
      title={eraInfo ? eraInfo.title : "Disease Detective"}
      subtitle={eraInfo ? eraInfo.description : "Solve historical outbreak mysteries"}
      stageImageUrl={DETECTIVE_PLATES.caseSelect.src}
      backPath={selectedEra ? '/detective' : '/'}
      statusStrip={
        <>
          <div className="status-item">
            <Trophy size={16} className="text-[var(--brass-1)]" />
            <span className="status-label">Cases Solved:</span>
            <span className="status-value">{completedCases.length}</span>
          </div>
          <div className="status-item">
            <Flame size={16} className="text-[var(--brass-1)]" />
            <span className="status-label">Win Streak:</span>
            <span className="status-value">{streak}</span>
          </div>
          <div className="status-item">
            <FolderOpen size={16} className="text-[var(--brass-1)]" />
            <span className="status-label">Total Cases:</span>
            <span className="status-value">{allCases.length}</span>
          </div>
        </>
      }
    >
      {!selectedEra ? (
        <>
          {/* How to Play */}
          <ParchmentPanel
            title="How to Play"
            icon={<BookOpen size={14} />}
            showPins
          >
            <ol className="ml-5 list-decimal space-y-2">
              <li>Choose an era from EIS history</li>
              <li>Review clues from real outbreak investigations</li>
              <li>Identify the pathogen AND the source</li>
              <li>Learn how EIS officers solved each case</li>
            </ol>
          </ParchmentPanel>

          {/* Era Selection */}
          <ParchmentPanel
            title="Choose Your Era"
            icon={<Search size={14} />}
          >
            <div className="space-y-4 mt-2">
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
          </ParchmentPanel>
        </>
      ) : (
        <>
          {/* Cases for Selected Era */}
          <ParchmentPanel
            title={`${cases.length} Cases Available`}
            icon={<FolderOpen size={14} />}
            showPins
          >
            <div className="space-y-4 mt-2">
              {cases.map((caseData, index) => {
                const isCompleted = completedCases.includes(caseData.id);
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
          </ParchmentPanel>
        </>
      )}
    </DetectiveGameShell>
  );
}

export default DetectiveHub;
