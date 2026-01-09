// src/pages/Home.tsx
// Main landing page for EIS 75th Anniversary Games
// Uses Exhibit Panel system for museum-style layout

import { PosterPanel } from '../components/exhibit/PosterPanel';
import { GameShell } from '../components/layout/GameShell';

export function Home() {
  return (
    <GameShell theme="default" showHero={true}>
      <div className="eis-exhibitGrid">
        <PosterPanel
          number={1}
          title="Disease Detective Challenge"
          subtitle="Solve bite-sized outbreak puzzles from the 1950s to today!"
          description="Choose an era and crack a case using real investigation clues."
          cta="Solve a Case!"
          href="/detective"
          dataTheme="detective"
        >
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span className="eis-pill">1950s</span>
            <span className="eis-pill">1980s</span>
            <span className="eis-pill">2010s</span>
          </div>
        </PosterPanel>

        <PosterPanel
          number={2}
          title="Outbreak Command"
          subtitle="Lead response operations under pressure!"
          description="Make critical decisions and manage resources in real outbreak scenarios."
          cta="Take Command!"
          href="/command"
          dataTheme="command"
        >
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span className="eis-pill">Strategy</span>
            <span className="eis-pill">Resource Management</span>
          </div>
        </PosterPanel>

        <PosterPanel
          number={3}
          title="EpiConnect Networking"
          subtitle="Meet fellow EIS officers, alumni, and supervisors."
          description="Run 5-minute rounds, earn points for matches, unlock challenges."
          cta="Find My Matches"
          href="/connect"
          dataTheme="connect"
        >
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span className="eis-pill">New Officers</span>
            <span className="eis-pill">Alumni</span>
            <span className="eis-pill">By Topic</span>
          </div>
        </PosterPanel>

        <PosterPanel
          number={4}
          title="75 Years, 75 Stories"
          subtitle="Watch stories from 75 years of EIS."
          description="Explore featured decades and share your own memory."
          cta="Watch Stories"
          href="/stories"
          dataTheme="default"
        />

        <PosterPanel
          number={5}
          title="Leaderboard"
          subtitle="Top Disease Detectives"
          description="See who's solved the most cases and earned the highest scores."
          cta="View Rankings"
          href="/leaderboard"
          dataTheme="default"
        />

        <PosterPanel
          number={6}
          title="About EIS"
          subtitle="75 years of protecting public health."
          description="Learn about the history and mission of the Epidemic Intelligence Service."
          cta="Learn More"
          href="/about"
          dataTheme="default"
        />
      </div>
    </GameShell>
  );
}

export default Home;
