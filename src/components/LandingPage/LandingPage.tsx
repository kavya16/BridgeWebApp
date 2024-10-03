import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LandingPage.module.css';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h2>Welcome to the Bridge Game</h2>
      <div className={styles.buttonGroup}>
        <button className={styles.button} onClick={() => navigate('/create-game')}>
          Create Game
        </button>
        <button className={styles.button} onClick={() => navigate('/join-game')}>
          Join Game
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
