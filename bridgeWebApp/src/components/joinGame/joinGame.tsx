import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./joinGame.module.css";

// Placeholder function for joining a game
const joinGame = async (gameCode: string, player: { id: number, name: string }) => {
  // TODO: Implement actual server communication here
  console.log(`Joining game ${gameCode} with player:`, player);
  return true; // Assume joining was successful
};

const JoinGame = () => {
  const [gameCode, setGameCode] = useState("");
  const navigate = useNavigate();

  const handleJoinGame = async () => {
    const player = { id: Date.now(), name: "Player" };
    const joined = await joinGame(gameCode, player);
    if (joined) {
      navigate(`/waiting-room/${gameCode}`);
    } else {
      // TODO: Handle join game failure
      console.error("Failed to join game");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Join a Game</h2>
        <input 
          type="text" 
          value={gameCode} 
          onChange={(e) => setGameCode(e.target.value)} 
          placeholder="Enter game code"
          className={styles.input}
        />
        <button onClick={handleJoinGame} className={styles.button}>Join Game</button>
      </div>
    </div>
  );
};

export default JoinGame;
