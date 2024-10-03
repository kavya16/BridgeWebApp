import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage';
import CreateGame from './components/CreateGame/CreateGame';
import JoinGame from './components/JoinGame/JoinGame';
import WaitingRoom from './components/WaitingRoom/WaitingRoom';
import GamePage from './components/GamePage/GamePage';
import Header from './components/common/Header';
import Footer from './components/common/Footer';

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <main style={{ minHeight: '80vh' }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/create-game" element={<CreateGame />} />
          <Route path="/join-game" element={<JoinGame />} />
          <Route path="/waiting-room/:gameCode" element={<WaitingRoom />} />
          <Route path="/game/:gameCode" element={<GamePage />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
