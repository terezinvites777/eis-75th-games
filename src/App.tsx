import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { KioskIdleReset } from './components/kiosk/KioskIdleReset';
import { IDLE_RESET_TIMEOUT } from './utils/environment';
import {
  Home,
  DetectiveHub,
  DetectiveGame,
  KioskDetectiveGame,
  OutbreakNetwork,
  FirstResponse,
  Command,
  Predict,
  EpiJeopardy,
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
        </Routes>
      </KioskIdleReset>
    </Router>
  );
}

export default App;
