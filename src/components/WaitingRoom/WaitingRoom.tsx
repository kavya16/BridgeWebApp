import React, { useEffect, useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GameContext } from '../../context/GameContext';
import { useSocket } from '../../hooks/useSocket';
import axios from 'axios';
import Loader from '../common/Loader';
import styles from './WaitingRoom.module.css';

interface Player {
  id: number;
  name: string;
}

const WaitingRoom: React.FC = () => {
  const { gameCode } = useParams<{ gameCode: string }>();
  const { players, setPlayers, setGameCode } = useContext(GameContext)!;
  const socket = useSocket();
  const navigate = useNavigate();
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!gameCode) return;

    // Fetch initial game state
    const fetchGameState = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/game/${gameCode}`);
        if (response.data.status === 'success') {
          setPlayers(response.data.gameState.players.map((name: string, index: number) => ({
            id: index + 1,
            name,
          })));
          setMaxPlayers(response.data.gameState.maxPlayers);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchGameState();
    setGameCode(gameCode);

    // Join the game room via Socket.IO
    socket?.emit('joinGame', gameCode);

    // Listen for playerJoined event
    socket?.on('playerJoined', (data: { gameId: string; players: string[] }) => {
      setPlayers(data.players.map((name: string, index: number) => ({
        id: index + 1,
        name,
      })));
    });

    // Listen for gameStarted event
    socket?.on('gameStarted', () => {
      navigate(`/game/${gameCode}`);
    });

    return () => {
      socket?.off('playerJoined');
      socket?.off('gameStarted');
    };
  }, [gameCode, socket, setPlayers, setGameCode, navigate]);

  useEffect(() => {
    if (players.length === maxPlayers) {
      // Notify backend to start the game if needed
      navigate(`/game/${gameCode}`);
    }
  }, [players, maxPlayers, navigate, gameCode]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Waiting Room</h2>
        <p>Game Code: <strong>{gameCode}</strong></p>
        <p>Waiting for players to join...</p>
        <ul className={styles.playerList}>
          {players.map((player: Player) => (
            <li key={player.id} className={styles.playerItem}>{player.name}</li>
          ))}
          {[...Array(maxPlayers - players.length)].map((_, index) => (
            <li key={`empty-${index}`} className={styles.playerItem}>Waiting for player...</li>
          ))}
        </ul>
        <p>{players.length} / {maxPlayers} players joined</p>
      </div>
    </div>
  );
};

export default WaitingRoom;
