import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home, DetectiveHub, CommandHub, Leaderboard, Profile } from './pages';
import { DetectiveGame } from './pages/DetectiveGame';

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

        {/* Command mode routes */}
        <Route path="/command" element={<CommandHub />} />
        <Route path="/command/:missionId" element={<CommandHub />} />

        {/* Connect mode (placeholder) */}
        <Route path="/connect" element={<Home />} />

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
