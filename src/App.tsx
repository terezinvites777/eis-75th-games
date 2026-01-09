import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  Home,
  DetectiveHub,
  DetectiveGame,
  Command,
  Connect,
  PatientZero,
  Stories,
  Predict,
  Leaderboard,
  Profile
} from './pages';

function App() {
  return (
    <Router>
      <Routes>
        {/* Main routes */}
        <Route path="/" element={<Home />} />

        {/* Detective mode routes */}
        <Route path="/detective" element={<DetectiveHub />} />
        <Route path="/detective/:era" element={<DetectiveHub />} />
        <Route path="/detective/:era/:caseId" element={<DetectiveGame />} />

        {/* Outbreak Command game */}
        <Route path="/command" element={<Command />} />

        {/* EpiConnect networking */}
        <Route path="/connect" element={<Connect />} />

        {/* Patient Zero mystery */}
        <Route path="/patient-zero" element={<PatientZero />} />

        {/* 75 Stories video gallery */}
        <Route path="/stories" element={<Stories />} />

        {/* Predict the Outbreak */}
        <Route path="/predict" element={<Predict />} />

        {/* Other routes */}
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/profile" element={<Profile />} />

        {/* About EIS page placeholder */}
        <Route path="/about" element={<Home />} />

        {/* Login placeholder */}
        <Route path="/login" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
