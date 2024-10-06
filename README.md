# BridgeWebApp

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Project Structure](#project-structure)
4. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Environment Variables](#environment-variables)
   - [Running the Application](#running-the-application)
   - [Building for Production](#building-for-production)
   - [Previewing the Build](#previewing-the-build)
5. [Testing](#testing)
   - [Running Tests](#running-tests)
6. [CI/CD Pipeline](#cicd-pipeline)
7. [Using the API in a Custom Front-End](#using-the-api-in-a-custom-front-end)
   - [Available Endpoints](#available-endpoints)
   - [Socket.IO Integration](#socketio-integration)
   - [Example: Integrating with React](#example-integrating-with-react)
8. [Best Practices](#best-practices)
9. [Contributing](#contributing)
10. [License](#license)

---

## Introduction

**BridgeWebApp** is a modern, scalable, and maintainable frontend application for the Bridge game. Built with React and TypeScript, it offers a seamless user experience for creating, joining, and managing Bridge game sessions. The application leverages Socket.IO for real-time communication, ensuring that players receive instant updates on game state changes.

## Features

- **Create and Join Game Sessions:** Easily create new games or join existing ones with 4 or 8 players.
- **Real-Time Updates:** Instant updates on player actions and game state changes using Socket.IO.
- **Responsive Design:** Modern and responsive UI for an optimal user experience across devices.
- **Comprehensive Routing:** Intuitive navigation using React Router.
- **TypeScript Integration:** Enhanced code quality and maintainability with TypeScript.
- **CI/CD Integration:** Automated build, test, and deployment pipeline using GitHub Actions and Azure.

## Project Structure

A well-organized project structure is crucial for scalability and maintainability. Here's the proposed structure for **BridgeWebApp**:

```
bridgeWebApp/
├── public/
│   ├── vite.svg
│   └── index.html
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── components/
│   │   ├── CreateGame/
│   │   │   └── CreateGame.tsx
│   │   ├── GamePage/
│   │   │   └── GamePage.tsx
│   │   ├── JoinGame/
│   │   │   └── JoinGame.tsx
│   │   ├── LandingPage/
│   │   │   └── LandingPage.tsx
│   │   ├── WaitingRoom/
│   │   │   └── WaitingRoom.tsx
│   │   └── common/
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       └── Loader.tsx
│   ├── context/
│   │   └── GameContext.tsx
│   ├── hooks/
│   │   └── useSocket.ts
│   ├── services/
│   │   └── api.ts
│   ├── styles/
│   │   ├── globals.css
│   │   └── variables.css
│   ├── types/
│   │   └── index.d.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── .github/
│   └── workflows/
│       └── main_bridgeWebApp.yml
├── .gitignore
├── eslint.config.js
├── package.json
├── README.md
├── tsconfig.json
├── vite.config.ts
└── web.config
```

**Key Directories and Files:**

- **`src/components/`**: Contains all React components, organized by feature.
- **`src/context/`**: Implements React Context for global state management.
- **`src/hooks/`**: Custom React hooks, including Socket.IO integration.
- **`src/services/`**: API service layer for handling HTTP requests.
- **`src/styles/`**: Global and modular CSS files.
- **`src/types/`**: TypeScript type definitions.
- **`.github/workflows/`**: GitHub Actions workflows for CI/CD.
- **`public/index.html`**: The main HTML file.

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

- **Node.js**: v20.x or higher
- **npm**: v8.x or higher (comes with Node.js)
- **Git**: For version control
- **Azure Account**: For deployment

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/bridgeWebApp.git
   cd bridgeWebApp
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

### Environment Variables

Create a `.env` file in the root directory with the following content:

```
REACT_APP_VITE_API_BASE_URL=http://localhost:3001/api
REACT_APP_SOCKET_URL=http://localhost:3001
```

- **`REACT_APP_VITE_API_BASE_URL`**: Base URL for the BridgeAPI backend.
- **`REACT_APP_SOCKET_URL`**: URL for Socket.IO server.

Note: In a production environment, ensure these variables are correctly set to point to your deployed backend services.

### Running the Application

#### Development Mode

Start the development server with hot-reloading:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

#### Production Mode

Build the application for production:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

The server will run on the port specified in your environment variables (default: 8080).

### Previewing the Build

To preview the production build locally:

```bash
npm run preview
```

The preview will be available at `http://localhost:4173`.

### API Documentation

Access the Swagger UI for API documentation:

```
http://localhost:3001/api-docs
```

This interface provides detailed information about available endpoints, request/response schemas, and allows you to interact with the API directly.

## Testing

### Running Tests

The project includes both unit and integration tests using Jest and React Testing Library.

- **Run All Tests:**

  ```bash
  npm run test
  ```

- **Run Tests with Coverage:**

  ```bash
  npm run test -- --coverage
  ```

- **Run Tests in Watch Mode:**

  ```bash
  npm run test -- --watch
  ```

Note: Ensure that your backend (bridgeAPI) is running and accessible if your tests depend on it.

## CI/CD Pipeline

The project utilizes GitHub Actions for continuous integration and deployment to Azure. The workflow is defined in `.github/workflows/main_bridgeWebApp.yml`.

### Workflow Configuration

**File:** `.github/workflows/main_bridgeWebApp.yml`

```yaml
name: Build and Deploy BridgeWebApp to Azure

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20.x'

      - name: Install dependencies
        run: npm install

      - name: Run lint
        run: npm run lint

      - name: Run tests
        run: npm run test -- --coverage

      - name: Build project
        run: npm run build

      - name: Upload production-ready build
        uses: actions/upload-artifact@v4
        with:
          name: bridgewebapp-build
          path: dist/

  deploy:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    environment:
      name: 'production'
      url: ${{ steps.deploy-to-azure.outputs.webapp-url }}

    steps:
      - name: Download build artifact
        uses: actions/download-artifact@v4
        with:
          name: bridgewebapp-build
          path: ./dist

      - name: Deploy to Azure Web App
        id: deploy-to-azure
        uses: azure/webapps-deploy@v3
        with:
          app-name: 'your-azure-webapp-name' # Replace with your Azure Web App name
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
          package: ./dist
```

### Setting Up Secrets

Ensure you have added the `AZURE_WEBAPP_PUBLISH_PROFILE` secret in your GitHub repository settings. This should contain the publish profile XML from your Azure Web App.

### Triggering the Pipeline

- **On Push:** The pipeline runs on every push to the main branch.
- **On Pull Request:** The pipeline runs on pull requests targeting the main branch.
- **Manual Trigger:** Use the "Run workflow" button in the GitHub Actions tab.

## Using the API in a Custom Front-End

If you intend to build a custom front-end for the Bridge game, this section will guide you on utilizing the API's endpoints and real-time features.

### Available Endpoints

- **Create Game**

  **URL:** `POST /api/game/create`

  **Body:**

  ```json
  {
    "gameId": "unique-game-id",
    "playerId": "player1",
    "maxPlayers": 4
  }
  ```

  **Description:** Creates a new game session.

- **Join Game**

  **URL:** `POST /api/game/join`

  **Body:**

  ```json
  {
    "gameId": "unique-game-id",
    "playerId": "player2"
  }
  ```

  **Description:** Allows a player to join an existing game.

- **Update Game**

  **URL:** `POST /api/game/update`

  **Body:**

  ```json
  {
    "gameId": "unique-game-id",
    "playerId": "player1",
    "cardPlayed": {
      "suit": "hearts",
      "value": "A"
    }
  }
  ```

  **Description:** Updates the game state when a player plays a card.

- **Delete Game**

  **URL:** `DELETE /api/game/{gameId}`

  **Description:** Deletes a completed game session.

### Socket.IO Integration

**Available Socket Events:**

- `connect`: Triggered when a client connects.
- `disconnect`: Triggered when a client disconnects.
- `playerJoined`: Notifies when a new player joins the game.
- `gameStateUpdated`: Notifies all players about game state changes.
- `gameDeleted`: Notifies all players that the game has been deleted.
- `playerMove`: Custom event for player moves.
- `chatMessage`: Handles in-game chat messages.
- `gameStarted`: Notifies when the game starts.
- `gameEnded`: Notifies when the game ends.
- `error`: Handles error events.

### Example: Integrating with React

Here's a basic example of how to integrate the BridgeWebApp with a React front-end using Socket.IO.

1. **Install Dependencies**

   Ensure you have the necessary dependencies installed:

   ```bash
   npm install axios socket.io-client react-router-dom
   ```

2. **Initialize Socket.IO Client**

   Create a custom hook to manage Socket.IO connections.

   ```typescript
   // src/hooks/useSocket.ts
   import { useEffect } from 'react';
   import { io, Socket } from 'socket.io-client';

   let socket: Socket | null = null;

   const useSocket = (url: string) => {
     useEffect(() => {
       socket = io(url, {
         transports: ['websocket'],
       });

       socket.on('connect', () => {
         console.log('Connected to Socket.IO server');
       });

       socket.on('disconnect', () => {
         console.log('Disconnected from Socket.IO server');
       });

       return () => {
         if (socket) socket.disconnect();
       };
     }, [url]);

     return socket;
   };

   export default useSocket;
   ```

3. **Create a Context for Global State**

   Manage global game state using React Context.

   ```typescript
   // src/context/GameContext.tsx
   import React, { createContext, useState, ReactNode } from 'react';

   interface Player {
     id: number;
     name: string;
   }

   interface GameState {
     moves: Array<{
       playerId: string;
       card: {
         suit: string;
         value: string;
       };
       timestamp: string;
     }>;
   }

   interface GameContextProps {
     gameId: string;
     setGameId: (id: string) => void;
     player: Player | null;
     setPlayer: (player: Player) => void;
     gameState: GameState;
     setGameState: (state: GameState) => void;
   }

   export const GameContext = createContext<GameContextProps | undefined>(undefined);

   export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
     const [gameId, setGameId] = useState<string>('');
     const [player, setPlayer] = useState<Player | null>(null);
     const [gameState, setGameState] = useState<GameState>({ moves: [] });

     return (
       <GameContext.Provider value={{ gameId, setGameId, player, setPlayer, gameState, setGameState }}>
         {children}
       </GameContext.Provider>
     );
   };
   ```

4. **Integrate Socket.IO in Components**

   Update components to listen and emit Socket.IO events.

   ```typescript
   // src/components/GamePage/GamePage.tsx
   import React, { useContext, useEffect } from 'react';
   import { GameContext } from '../../context/GameContext';
   import useSocket from '../../hooks/useSocket';
   import axios from 'axios';

   const GamePage: React.FC = () => {
     const { gameId, player, gameState, setGameState } = useContext(GameContext)!;
     const socket = useSocket(import.meta.env.VITE_SOCKET_URL as string);

     useEffect(() => {
       if (!socket || !gameId) return;

       socket.emit('joinGame', gameId);

       socket.on('gameStateUpdated', (data: any) => {
         setGameState(data.gameState);
       });

       socket.on('gameDeleted', (data: any) => {
         alert('Game has been deleted');
         // Redirect to landing page or handle accordingly
       });

       return () => {
         socket.off('gameStateUpdated');
         socket.off('gameDeleted');
       };
     }, [socket, gameId, setGameState]);

     const playCard = async (card: { suit: string; value: string }) => {
       try {
         await axios.post(`${import.meta.env.VITE_API_BASE_URL}/game/update`, {
           gameId,
           playerId: player?.id,
           cardPlayed: card,
         });
       } catch (error) {
         console.error('Error playing card:', error);
       }
     };

     return (
       <div>
         <h1>Game: {gameId}</h1>
         <div>
           <h2>Moves:</h2>
           <ul>
             {gameState.moves.map((move, index) => (
               <li key={index}>
                 Player {move.playerId} played {move.card.value} of {move.card.suit} at {new Date(move.timestamp).toLocaleTimeString()}
               </li>
             ))}
           </ul>
         </div>
         {/* Add UI for playing cards */}
         <button onClick={() => playCard({ suit: 'hearts', value: 'A' })}>Play Ace of Hearts</button>
       </div>
     );
   };

   export default GamePage;
   ```

5. **Sample Integration in App Component**

   Wrap your application with the GameProvider to provide global state.

   ```typescript
   // src/App.tsx
   import React from 'react';
   import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
   import LandingPage from './components/LandingPage/LandingPage';
   import CreateGame from './components/CreateGame/CreateGame';
   import JoinGame from './components/JoinGame/JoinGame';
   import WaitingRoom from './components/WaitingRoom/WaitingRoom';
   import GamePage from './components/GamePage/GamePage';
   import { GameProvider } from './context/GameContext';

   const App: React.FC = () => {
     return (
       <GameProvider>
         <Router>
           <div className="App">
             <Routes>
               <Route path="/" element={<LandingPage />} />
               <Route path="/create-game" element={<CreateGame />} />
               <Route path="/join-game" element={<JoinGame />} />
               <Route path="/waiting-room/:gameCode" element={<WaitingRoom />} />
               <Route path="/game/:gameCode" element={<GamePage />} />
             </Routes>
           </div>
         </Router>
       </GameProvider>
     );
   };

   export default App;
   ```

## Best Practices

- Follow coding standards and best practices for React and TypeScript.
- Ensure all components are modular and reusable.
- Use environment variables for configuration.
- Write unit and integration tests for critical components.

## Contributing

Contributions are welcome! Please read the [contributing guidelines](CONTRIBUTING.md) for more details.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.