import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/landingPage/landingPage';
import CreateGame from './components/createGame/createGame';
import JoinGame from './components/joinGame/joinGame';
import WaitingRoom from './components/waitingRoom/waitingRoom';
import GamePage from './components/gamePage/gamePage';

function App() {
  return (
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/create-game" element={<CreateGame />} />
            <Route path="/join-game" element={<JoinGame />} />
            <Route path="/waiting-room/:gameCode" element={<WaitingRoom />} />
            <Route path="/game/:gameCode" element={<GamePage />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
