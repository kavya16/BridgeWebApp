import styles from "./gamePage.module.css";

const GamePage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Bridge Game</h1>
      <p className={styles.text}>Game in progress...</p>
      {/* Add game components here */}
    </div>
  );
};

export default GamePage;
