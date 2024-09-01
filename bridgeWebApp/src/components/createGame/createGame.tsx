import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./createGame.module.css";

const CreateGame = () => {
  const [playerCount, setPlayerCount] = useState(4);
  const navigate = useNavigate();

  const generateGameCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCreateGame = () => {
    const newGameCode = generateGameCode();
    //setGameCode(newGameCode);
    // Here you would typically send this information to your backend
    navigate(`/waiting-room/${newGameCode}?players=${playerCount}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Create a New Game</h2>
        <div className={styles.playerSelection}>
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
