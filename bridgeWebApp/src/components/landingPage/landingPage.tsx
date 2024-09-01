import { Link } from "react-router-dom";
import styles from "./landingPage.module.css";

const LandingPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Welcome to Bridge Game</h1>
        <div className={styles.options}>
          <Link to="/create-game" className={styles.button}>Create Game</Link>
          <Link to="/join-game" className={styles.button}>Join Game</Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
