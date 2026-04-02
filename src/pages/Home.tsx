// src/pages/Home.tsx
// Kiosk home page — 6 game poster panels with attract mode

import { PosterPanel } from '../components/exhibit/PosterPanel';
import { GameShell } from '../components/layout/GameShell';
import { AttractMode } from '../components/kiosk/AttractMode';
import { isElectron, ATTRACT_TIMEOUT } from '../utils/environment';

export function Home() {
  const content = (
    <GameShell theme="default" showHero={true}>
      <div className="eis-exhibitGrid">
          <PosterPanel
            number={1}
            title="Disease Detective"
            subtitle="Outbreak Investigation"
            description="Solve historical outbreak mysteries."
            cta="Solve a Case"
            href="/detective"
            bgImageUrl="./images/exhibits/detective.png"
            dataTheme="detective"
          />

          <PosterPanel
            number={2}
            title="Outbreak Network"
            subtitle="Contact Tracing Puzzle"
            description="Trace the chain. Find Patient Zero."
            cta="Start Tracing"
            href="/outbreak-network"
            bgImageUrl="./images/exhibits/outbreak-network.png"
            dataTheme="command"
          />

          <PosterPanel
            number={3}
            title="First Response"
            subtitle="Speed Sequencing Challenge"
            description="PPE donning, doffing, and outbreak response — how fast can you go?"
            cta="Suit Up!"
            href="/first-response"
            bgImageUrl="./images/exhibits/first-response.png"
            dataTheme="command"
          />

          <PosterPanel
            number={4}
            title="Outbreak Origins"
            subtitle="Map Investigation & Deduction"
            description="Track the outbreak. Find the source."
            cta="Investigate"
            href="/command"
            bgImageUrl="./images/exhibits/Outbreak Origins.png"
            dataTheme="command"
          />

          <PosterPanel
            number={5}
            title="Predict the Outbreak"
            subtitle="Forecast Challenge"
            description="Read the epi curve. Make your call."
            cta="Make Predictions"
            href="/predict"
            bgImageUrl="./images/exhibits/predict.png"
            dataTheme="default"
          />

          <PosterPanel
            number={6}
            title="Epi Jeopardy"
            subtitle="Head-to-Head Trivia"
            description="Two players. One screen. Who knows more epi?"
            cta="Challenge a Friend"
            href="/epi-jeopardy"
            bgImageUrl="./images/exhibits/epi-jeopardy.png"
            dataTheme="detective"
          />

          <PosterPanel
            number={7}
            title="Outbreak Tiles"
            subtitle="Rapid Classification"
            description="How fast can you classify?"
            cta="Start Tapping"
            href="/outbreak-tiles"
            bgImageUrl="./images/exhibits/Outbreak Tiles.png"
            dataTheme="detective"
          />

          <PosterPanel
            number={8}
            title="Field Ops"
            subtitle="Triage & Investigation"
            description="Triage. Investigate. Solve."
            cta="Deploy"
            href="/field-ops"
            bgImageUrl="./images/exhibits/Field Ops.png"
            dataTheme="command"
          />

          <PosterPanel
            number={9}
            title="Epi Match"
            subtitle="Memory Card Matching"
            description="Match the science. Beat the clock."
            cta="Play Now"
            href="/epi-match"
            bgImageUrl="./images/exhibits/Epi Match.png"
            dataTheme="detective"
          />
        </div>
    </GameShell>
  );

  // Kiosk: show attract/splash screen; Web: go straight to games
  if (!isElectron) return content;

  return (
    <AttractMode
      title="EIS 75th Anniversary"
      subtitle="Disease Detective Games"
      timeout={ATTRACT_TIMEOUT}
    >
      {content}
    </AttractMode>
  );
}

export default Home;
