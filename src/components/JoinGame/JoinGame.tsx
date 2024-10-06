import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GameContext } from '../../context/GameContext';
import styles from './JoinGame.module.css';

const JoinGame: React.FC = () => {
  const [gameCode, setGameCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setGameCode: setGlobalGameCode, setPlayers } = useContext(GameContext)!;

  const handleJoinGame = async () => {
    if (!gameCode.trim() || !playerName.trim()) {
      setError('Game code and player name are required.');
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.API_BASE_URL}/game/join`, {
        gameId: gameCode,
        playerId: playerName,
      });

      if (response.data.status === 'success') {
        setGlobalGameCode(gameCode);
        setPlayers(response.data.gameState.players.map((name: string, index: number) => ({
          id: index + 1,
          name,
        })));
        navigate(`/waiting-room/${gameCode}`);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to join game.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Join a Game</h2>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.field}>
          <label htmlFor="playerName">Your Name:</label>
          <input
            type="text"
            id="playerName"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className={styles.input}
            placeholder="Enter your name"
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="gameCode">Game Code:</label>
          <input
            type="text"
            id="gameCode"
            value={gameCode}
            onChange={(e) => setGameCode(e.target.value.toUpperCase())}
            className={styles.input}
            placeholder="Enter game code"
          />
        </div>
        <button className={styles.button} onClick={handleJoinGame}>
          Join Game
        </button>
      </div>
    </div>
  );
};

export default JoinGame;
