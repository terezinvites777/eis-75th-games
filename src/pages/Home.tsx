// src/pages/Home.tsx
// Kiosk home page — 6 game poster panels with attract mode

import { PosterPanel } from '../components/exhibit/PosterPanel';
import { GameShell } from '../components/layout/GameShell';
import { AttractMode } from '../components/kiosk/AttractMode';
import { ATTRACT_TIMEOUT } from '../utils/environment';

export function Home() {
  return (
    <AttractMode
      title="EIS 75th Anniversary"
      subtitle="Disease Detective Games"
      timeout={ATTRACT_TIMEOUT}
    >
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
            title="Outbreak Command"
            subtitle="Epidemic Response Decisions"
            description="Lead response operations under pressure."
            cta="Take Command"
            href="/command"
            bgImageUrl="./images/exhibits/command.png"
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
        </div>
      </GameShell>
    </AttractMode>
  );
}

export default Home;
