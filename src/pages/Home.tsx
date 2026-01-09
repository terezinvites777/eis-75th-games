// src/pages/Home.tsx
// Main landing page for EIS 75th Anniversary Games
// Museum exhibit wall with poster plate tiles

import { PosterPanel } from '../components/exhibit/PosterPanel';
import { GameShell } from '../components/layout/GameShell';

export function Home() {
  return (
    <GameShell theme="default" showHero={true}>
      <div className="eis-exhibitGrid">
        <PosterPanel
          number={1}
          title="Disease Detective"
          subtitle="Outbreak Investigation Puzzle Game"
          description="Solve historical outbreak mysteries using real EIS case studies."
          cta="Solve a Case"
          href="/detective"
          bgImageUrl="/images/exhibits/panel-1.png"
          dataTheme="detective"
        />

        <PosterPanel
          number={2}
          title="Outbreak Command"
          subtitle="Epidemic Response Simulation"
          description="Lead response operations and make critical decisions under pressure."
          cta="Take Command"
          href="/command"
          bgImageUrl="/images/exhibits/panel-2.png"
          dataTheme="command"
        />

        <PosterPanel
          number={3}
          title="EpiConnect"
          subtitle="Speed Networking"
          description="Meet fellow EIS officers, alumni, and supervisors."
          cta="Find My Matches"
          href="/connect"
          bgImageUrl="/images/exhibits/panel-3.png"
          dataTheme="connect"
        />

        <PosterPanel
          number={4}
          title="75 Years, 75 Stories"
          subtitle="Video Archive"
          description="Watch stories from 75 years of EIS and share your own memory."
          cta="Watch Stories"
          href="/stories"
          bgImageUrl="/images/exhibits/panel-4.png"
          dataTheme="default"
        />

        <PosterPanel
          number={5}
          title="Patient Zero"
          subtitle="Multi-Day Mystery"
          description="Follow daily clues to identify historic outbreak sources."
          cta="Investigate"
          href="/patient-zero"
          bgImageUrl="/images/exhibits/panel-5.png"
          dataTheme="detective"
        />

        <PosterPanel
          number={6}
          title="Predict the Outbreak"
          subtitle="Forecast Challenge"
          description="Use partial data to predict outbreak outcomes."
          cta="Make Predictions"
          href="/predict"
          bgImageUrl="/images/exhibits/panel-6.png"
          dataTheme="default"
        />
      </div>
    </GameShell>
  );
}

export default Home;
