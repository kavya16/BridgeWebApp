import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Bridge Game</h1>
      <nav>
        <Link to="/" className={styles.link}>
          Home
        </Link>
        <Link to="/create-game" className={styles.link}>
          Create Game
        </Link>
        <Link to="/join-game" className={styles.link}>
          Join Game
        </Link>
      </nav>
    </header>
  );
};

export default Header;
