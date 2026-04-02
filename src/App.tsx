import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { KioskIdleReset } from './components/kiosk/KioskIdleReset';
import { IDLE_RESET_TIMEOUT } from './utils/environment';
import {
  Home,
  DetectiveHub,
  KioskDetectiveGame,
  OutbreakNetwork,
  FirstResponse,
  Command,
  Predict,
  EpiJeopardy,
  OutbreakTiles,
  EpiMatch,
  FieldOps,
} from './pages';

function App() {
  return (
    <Router>
      <KioskIdleReset timeout={IDLE_RESET_TIMEOUT}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/detective" element={<DetectiveHub />} />
          <Route path="/detective/:era" element={<DetectiveHub />} />
          <Route path="/detective/:era/:caseId" element={<KioskDetectiveGame />} />
          <Route path="/outbreak-network" element={<OutbreakNetwork />} />
          <Route path="/first-response" element={<FirstResponse />} />
          <Route path="/command" element={<Command />} />
          <Route path="/predict" element={<Predict />} />
          <Route path="/epi-jeopardy" element={<EpiJeopardy />} />
          <Route path="/outbreak-tiles" element={<OutbreakTiles />} />
          <Route path="/epi-match" element={<EpiMatch />} />
          <Route path="/field-ops" element={<FieldOps />} />
        </Routes>
      </KioskIdleReset>
    </Router>
  );
}

export default App;
