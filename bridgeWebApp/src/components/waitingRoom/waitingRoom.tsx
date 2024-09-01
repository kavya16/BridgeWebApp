import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import styles from "./waitingRoom.module.css";

export interface Player {
  id: number;
  name: string;
}

const WaitingRoom = () => {
  const { gameCode } = useParams<{ gameCode: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [players, setPlayers] = useState<Player[]>([]);
  const [maxPlayers, setMaxPlayers] = useState(4);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const playerCount = searchParams.get('players');
    if (playerCount && gameCode) {
      setMaxPlayers(Number(playerCount));
      localStorage.setItem(`${gameCode}_maxPlayers`, playerCount);
    }
  }, [gameCode, location]);

  useEffect(() => {
    if (!gameCode) return;

    const checkForUpdates = () => {
      const storedPlayers = localStorage.getItem(`${gameCode}_players`);
      if (storedPlayers) {
        const parsedPlayers = JSON.parse(storedPlayers);
        if (JSON.stringify(parsedPlayers) !== JSON.stringify(players)) {
          setPlayers(parsedPlayers);
        }
      }
    };

    checkForUpdates(); // Check immediately on mount
    const interval = setInterval(checkForUpdates, 1000); // Poll every second

    return () => clearInterval(interval);
  }, [gameCode, players]);

  useEffect(() => {
    if (players.length === maxPlayers && gameCode) {
      navigate(`/game/${gameCode}`);
    }
  }, [players, maxPlayers, gameCode, navigate]);

  if (!gameCode) {
    return <div className={styles.container}>Invalid game code</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Waiting Room</h2>
        <p className={styles.gameCode}>Game Code: {gameCode}</p>
        <p className={styles.message}>Waiting for players to join...</p>
        <ul className={styles.playerList}>
          {players.map((player) => (
            <li key={player.id} className={styles.playerItem}>{player.name}</li>
          ))}
          {[...Array(maxPlayers - players.length)].map((_, index) => (
            <li key={`empty-${index}`} className={styles.playerItem}>Waiting for player...</li>
          ))}
        </ul>
        <p className={styles.playerCount}>
          {players.length} / {maxPlayers} players joined
        </p>
      </div>
    </div>
  );
};

export default WaitingRoom;