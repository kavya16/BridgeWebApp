import React, { createContext, useState, ReactNode } from 'react';

interface Player {
  id: number;
  name: string;
}

interface GameContextProps {
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  gameCode: string;
  setGameCode: React.Dispatch<React.SetStateAction<string>>;
}

export const GameContext = createContext<GameContextProps | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameCode, setGameCode] = useState<string>('');

  return (
    <GameContext.Provider value={{ players, setPlayers, gameCode, setGameCode }}>
      {children}
    </GameContext.Provider>
  );
};
