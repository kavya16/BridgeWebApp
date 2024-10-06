import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GameContext } from '../../context/GameContext';
import styles from './CreateGame.module.css';

const CreateGame: React.FC = () => {
  const [playerName, setPlayerName] = useState('');
  const [playerCount, setPlayerCount] = useState(4);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setGameCode, setPlayers } = useContext(GameContext)!;

  const handleCreateGame = async () => {
    if (!playerName.trim()) {
      setError('Player name is required.');
      return;
    }

    try {
      const gameId = generateGameCode();
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/game/create`, {
        gameId,
        playerId: playerName,
        maxPlayers: playerCount,
      });

      if (response.data.status === 'success') {
        setGameCode(gameId);
        setPlayers([{ id: Date.now(), name: playerName }]);
        navigate(`/waiting-room/${gameId}?players=${playerCount}`);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create game.');
    }
  };

  const generateGameCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Create a New Game</h2>
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
          <label htmlFor="playerCount">Number of Players:</label>
          <select
            id="playerCount"
            value={playerCount}
            onChange={(e) => setPlayerCount(Number(e.target.value))}
            className={styles.select}
          >
            <option value={4}>4 Players</option>
            <option value={8}>8 Players</option>
          </select>
        </div>
        <button className={styles.button} onClick={handleCreateGame}>
          Create Game
        </button>
      </div>
    </div>
  );
};

export default CreateGame;
