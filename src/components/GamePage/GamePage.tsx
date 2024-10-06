import React, { useEffect, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GameContext } from '../../context/GameContext';
import { useSocket } from '../../hooks/useSocket';
import axios from 'axios';
import Loader from '../common/Loader';
import styles from './GamePage.module.css';

interface Move {
  playerId: string;
  card: {
    suit: string;
    value: string;
  };
  timestamp: string;
}

const GamePage: React.FC = () => {
  const { gameCode } = useParams<{ gameCode: string }>();
  const { players } = useContext(GameContext)!;
  const socket = useSocket();
  const [gameState, setGameState] = useState<{ moves: Move[] }>({ moves: [] });
  const [currentPlayer, setCurrentPlayer] = useState<string>('');
  const [selectedCard, setSelectedCard] = useState<{ suit: string; value: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!gameCode) return;

    // Fetch initial game state
    const fetchGameState = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/game/${gameCode}`);
        if (response.data.status === 'success') {
          setGameState(response.data.gameState.gameState);
          setCurrentPlayer(response.data.gameState.currentPlayer);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchGameState();

    // Listen for gameStateUpdated event
    socket?.on('gameStateUpdated', (data: { gameId: string; gameState: any }) => {
      setGameState(data.gameState);
      // Optionally update current player
    });

    // Listen for gameEnded event
    socket?.on('gameEnded', () => {
      alert('Game has ended!');
      // Redirect or perform other actions
    });

    return () => {
      socket?.off('gameStateUpdated');
      socket?.off('gameEnded');
    };
  }, [gameCode, socket]);

  const handlePlayCard = async () => {
    if (!selectedCard || !gameCode) return;

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/game/update`, {
        gameId: gameCode,
        playerId: players.find(p => p.name === selectedCard.value)?.name, // Adjust accordingly
        cardPlayed: selectedCard,
      });
      setSelectedCard(null);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to play card.');
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={styles.container}>
      <h2>Game: {gameCode}</h2>
      <div className={styles.gameBoard}>
        <div className={styles.moves}>
          <h3>Moves:</h3>
          <ul>
            {gameState.moves.map((move: Move, index: number) => (
              <li key={index}>
                <strong>{move.playerId}</strong> played {move.card.value} of {move.card.suit} at {new Date(move.timestamp).toLocaleTimeString()}
              </li>
            ))}
          </ul>
        </div>
        {/* Add your card playing UI here */}
        <div className={styles.playArea}>
          <h3>Your Turn</h3>
          {/* Example card selection */}
          <div className={styles.cards}>
            <button onClick={() => setSelectedCard({ suit: 'hearts', value: 'A' })}>A♥</button>
            <button onClick={() => setSelectedCard({ suit: 'diamonds', value: 'K' })}>K♦</button>
            {/* Add more cards as needed */}
          </div>
          <button onClick={handlePlayCard} disabled={!selectedCard} className={styles.playButton}>
            Play Card
          </button>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
